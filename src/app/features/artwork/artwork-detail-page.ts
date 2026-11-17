import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MetObject } from '../../core/models/met-object';
import { MetApiService } from '../../core/services/met-api.service';

@Component({
  selector: 'app-artwork-detail-page',
  imports: [RouterLink],
  templateUrl: './artwork-detail-page.html',
  styleUrl: './artwork-detail-page.scss',
})
export class ArtworkDetailPage implements OnInit {
  private readonly api = inject(MetApiService);
  private readonly route = inject(ActivatedRoute);

  readonly artwork = signal<MetObject | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    const objectId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(objectId) || objectId <= 0) {
      this.error.set('Cette œuvre n’existe pas dans la collection.');
      this.loading.set(false);
      return;
    }

    try {
      this.artwork.set(await firstValueFrom(this.api.getObject(objectId)));
    } catch {
      this.error.set('Cette œuvre n’a pas pu être chargée depuis la collection.');
    } finally {
      this.loading.set(false);
    }
  }
}
