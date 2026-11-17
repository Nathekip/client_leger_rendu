import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { GalleryPage } from './gallery-page';

describe('GalleryPage', () => {
  it('loads collection results and reflects them in the list and department chart', async () => {
    TestBed.configureTestingModule({
      imports: [GalleryPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });

    const fixture = TestBed.createComponent(GalleryPage);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    http
      .expectOne('https://collectionapi.metmuseum.org/public/collection/v1/departments')
      .flush({ departments: [{ departmentId: 11, displayName: 'European Paintings' }] });
    http
      .expectOne(
        (request) =>
          request.url === 'https://collectionapi.metmuseum.org/public/collection/v1.1/search',
      )
      .flush({ total: 1, objectIDs: [436535] });

    await Promise.resolve();
    http
      .expectOne('https://collectionapi.metmuseum.org/public/collection/v1/objects/436535')
      .flush({
        objectID: 436535,
        title: 'Wheat Field with Cypresses',
        artistDisplayName: 'Vincent van Gogh',
        artistDisplayBio: '',
        objectDate: '1889',
        medium: 'Oil on canvas',
        dimensions: '',
        department: 'European Paintings',
        culture: '',
        period: '',
        objectURL: 'https://www.metmuseum.org/',
        primaryImage: '',
        primaryImageSmall: 'https://images.metmuseum.org/example.jpg',
        isHighlight: true,
        creditLine: '',
        accessionNumber: '',
        objectName: 'Painting',
      });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.art-card h3')?.textContent?.trim()).toBe(
      'Wheat Field with Cypresses',
    );
    expect(fixture.nativeElement.querySelector('.chart-row')?.textContent).toContain(
      'European Paintings',
    );
    http.verify();
  });
});
