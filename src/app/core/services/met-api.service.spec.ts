import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MetApiService } from './met-api.service';

describe('MetApiService', () => {
  let service: MetApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MetApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the paginated v1.1 endpoint and trims search terms', () => {
    service.searchObjects('  portrait  ', 4, 12, 24).subscribe();

    const request = http.expectOne(
      (candidate) =>
        candidate.url ===
        'https://collectionapi.metmuseum.org/public/collection/v1.1/search',
    );

    expect(request.request.params.get('q')).toBe('portrait');
    expect(request.request.params.get('departmentId')).toBe('4');
    expect(request.request.params.get('hasImages')).toBe('true');
    expect(request.request.params.get('limit')).toBe('12');
    expect(request.request.params.get('offset')).toBe('24');
    request.flush({ total: 0, objectIDs: null });
  });

  it('loads an object from the collection detail endpoint', () => {
    service.getObject(436535).subscribe();

    const request = http.expectOne(
      'https://collectionapi.metmuseum.org/public/collection/v1/objects/436535',
    );

    expect(request.request.method).toBe('GET');
    request.flush({ objectID: 436535 });
  });
});
