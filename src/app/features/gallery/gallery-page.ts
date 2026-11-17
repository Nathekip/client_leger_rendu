import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Department } from '../../core/models/department';
import { MetObject } from '../../core/models/met-object';
import { MetApiService } from '../../core/services/met-api.service';
import { DepartmentChartComponent, DepartmentChartRow } from './department-chart.component';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-gallery-page',
  imports: [DepartmentChartComponent, FormsModule, RouterLink],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss',
})
export class GalleryPage implements OnInit {
  private readonly api = inject(MetApiService);
  private searchSequence = 0;
  private offset = 0;

  readonly artworks = signal<MetObject[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly loadingMore = signal(false);
  readonly error = signal('');
  readonly departmentError = signal('');
  readonly query = signal('landscape');
  readonly selectedDepartmentId = signal<number | null>(null);

  readonly chartRows = computed<DepartmentChartRow[]>(() => {
    const counts = new Map<string, number>();
    for (const artwork of this.artworks()) {
      const department = artwork.department || 'Non renseigné';
      counts.set(department, (counts.get(department) ?? 0) + 1);
    }

    const sorted = [...counts.entries()].sort((first, second) => second[1] - first[1]);
    const visible = sorted.slice(0, 5);
    const otherCount = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0);
    if (otherCount) {
      visible.push(['Autres départements', otherCount]);
    }

    const displayedCount = this.artworks().length;
    return visible.map(([department, count]) => ({
      department,
      count,
      percentage: displayedCount ? (count / displayedCount) * 100 : 0,
    }));
  });

  async ngOnInit(): Promise<void> {
    void this.loadDepartments();
    await this.search();
  }

  async search(): Promise<void> {
    const query = this.query().trim();
    if (!query) {
      this.error.set('Saisissez un mot-clé pour lancer la recherche.');
      return;
    }

    const sequence = ++this.searchSequence;
    this.loading.set(true);
    this.loadingMore.set(false);
    this.error.set('');
    this.artworks.set([]);
    this.offset = 0;

    try {
      const results = await firstValueFrom(
        this.api.searchObjects(query, this.selectedDepartmentId(), PAGE_SIZE, this.offset),
      );
      if (sequence !== this.searchSequence) {
        return;
      }

      this.total.set(results.total);
      const objectIds = results.objectIDs ?? [];
      this.offset += objectIds.length;
      const artworks = objectIds.length ? await firstValueFrom(this.api.getObjects(objectIds)) : [];
      if (sequence === this.searchSequence) {
        this.artworks.set(artworks);
      }
    } catch {
      if (sequence === this.searchSequence) {
        this.error.set('La collection est momentanément inaccessible. Réessayez dans un instant.');
      }
    } finally {
      if (sequence === this.searchSequence) {
        this.loading.set(false);
      }
    }
  }

  async loadMore(): Promise<void> {
    if (this.loadingMore() || this.offset >= this.total()) {
      return;
    }

    const sequence = this.searchSequence;
    this.loadingMore.set(true);
    this.error.set('');

    try {
      const results = await firstValueFrom(
        this.api.searchObjects(
          this.query().trim(),
          this.selectedDepartmentId(),
          PAGE_SIZE,
          this.offset,
        ),
      );
      if (sequence !== this.searchSequence) {
        return;
      }

      const objectIds = results.objectIDs ?? [];
      const artworks = objectIds.length ? await firstValueFrom(this.api.getObjects(objectIds)) : [];
      if (sequence === this.searchSequence) {
        this.offset += objectIds.length;
        this.artworks.update((current) => [...current, ...artworks]);
      }
    } catch {
      if (sequence === this.searchSequence) {
        this.error.set('Impossible de charger davantage d’œuvres pour le moment.');
      }
    } finally {
      if (sequence === this.searchSequence) {
        this.loadingMore.set(false);
      }
    }
  }

  private async loadDepartments(): Promise<void> {
    try {
      const response = await firstValueFrom(this.api.getDepartments());
      this.departments.set(response.departments);
    } catch {
      this.departmentError.set('Les filtres par département sont indisponibles.');
    }
  }
}
