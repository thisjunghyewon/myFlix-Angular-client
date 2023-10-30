import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieInfoSecondComponent } from './movie-info-second.component';

describe('MovieInfoSecondComponent', () => {
  let component: MovieInfoSecondComponent;
  let fixture: ComponentFixture<MovieInfoSecondComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieInfoSecondComponent]
    });
    fixture = TestBed.createComponent(MovieInfoSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
