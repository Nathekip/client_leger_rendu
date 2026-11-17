import { Routes } from '@angular/router';
import { ArtworkDetailPage } from './features/artwork/artwork-detail-page';
import { GalleryPage } from './features/gallery/gallery-page';

export const routes: Routes = [
  { path: '', component: GalleryPage, title: 'Explorer la collection | Met' },
  { path: 'oeuvre/:id', component: ArtworkDetailPage, title: 'Fiche de l’œuvre | Met' },
  { path: '**', redirectTo: '' },
];
