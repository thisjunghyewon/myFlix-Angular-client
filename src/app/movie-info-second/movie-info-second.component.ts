/**
 * A secondary movie-info dialog component to render basic details and
  set an if condition on original info dialog for movies with more than one director/genre
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info-second',
  templateUrl: './movie-info-second.component.html',
  styleUrls: ['./movie-info-second.component.scss'],
})
export class MovieInfoSecondComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
