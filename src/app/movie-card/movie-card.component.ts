import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieInfoComponent } from '../movie-info/movie-info.component';
import { MovieInfoSecondComponent } from '../movie-info-second/movie-info-second.component';
// import { DirectorComponent } from '../director/director.component';
// import { GenreComponent } from '../genre/genre.component';
// import { MatDialog } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  // movies: any[] = [];
  // favorites: any[] = [];
  movies: any[] = [];
  directors: any[] = [];
  genres: any[] = [];
  user: any | undefined;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    // public snackBar: MatSnackBar
    public router: Router
  ) {}

  ngOnInit(): void {
    // this.getMovies();
    // this.getFavorites();
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.fetchApiData.getAllDirectors().subscribe((resp: any) => {
        this.directors = resp;
        this.fetchApiData.getAllGenres().subscribe((resp: any) => {
          this.genres = resp;
          this.fetchMovies();
        });
      });
      this.user = JSON.parse(localStorage.getItem('user')!);
    } else {
      this.router.navigate(['welcome']);
    }
  }

  /**
   * @returns all movies
   */
  fetchMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      for (const movie of this.movies) {
        this.findMoviesDirectors(movie);
        this.findMoviesGenre(movie);
      }
      return this.movies;
    });
  }

  /**
   * @param movie
   * @returns the movie's director
   */
  private findMoviesDirectors(movie: any): void {
    if (!movie.Director) {
      console.error('Director is undefined for movie:', movie);
      return;
    }
    const foundDirector = this.directors.find((d) => d._id === movie.Director);
    if (foundDirector) {
      movie.Director = foundDirector;
    } else {
      console.error('Director not found for id:', movie.Director);
    }
  }
  /**
   * @param movie
   * @returns the movie's genre
   */
  private findMoviesGenre(movie: any): void {
    let foundGenre: any;
    foundGenre = this.genres.find((g) => g._id === movie.Genre);
    movie.Genre = foundGenre;
  }

  // listDirectors(directors: any) {
  //   return directors.map((director: any) => {
  //     return director.Name;
  //   });
  // }
  /**
   * @param genre
   * the genre will be passed into the dialog when openend
   */
  openGenreDialog(genre: any): void {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dialogTitle: genre.Name,
      dialogContent: genre.Description,
    };
    // dialogConfig.width = '500px';
    // this.dialog.open(MovieInfoSecondComponent, dialogConfig);
    console.log('dialogConfig: ', dialogConfig.data);

    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoSecondComponent, {
      data: dialogConfig.data,
      width: dialogConfig.width,
    });
  }

  /**
   * @param director
   * the directors will be passed into the dialog when openend
   */
  openDirectorsDialog(director: any): void {
    this.dialog.closeAll();
    console.log('dialog: ', director);

    const dialogConfig = new MatDialogConfig();
    const directorName = director.Name;
    const directorBio = director.Bio;
    const directorBirth = director.Birth;
    const directorDeath = director.Death;
    dialogConfig.data = {
      dialogTitle: directorName,
      dialogContent: { directorBio, directorBirth, directorDeath },
    };
    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoComponent, {
      data: dialogConfig.data,
      width: dialogConfig.width,
    });
  }

  /**
   * @param description
   * param data will be passed into the dialog when opened
   */
  openSynopsisDialog(description: any): void {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dialogTitle: 'Synopsis',
      dialogContent: description,
    };
    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoSecondComponent, dialogConfig);
  }

  /**
   * @param movieId
   * will set the selected movie as one of the user's favorites
   */

  handleSetFavoriteMovie(movieId: string): void {
    if (this.user.Favorite_movies.includes(movieId)) {
      this.fetchApiData
        .deleteFavoriteMovie(this.user.Username, movieId)
        .subscribe((resp: any) => {
          this.user.Favorite_movies = this.user.Favorite_movies.filter(
            (id: String) => id !== movieId
          );
          localStorage.setItem('user', JSON.stringify(this.user));
        });
    } else {
      this.fetchApiData
        .addFavoriteMovie(this.user.Username, movieId)
        .subscribe((resp: any) => {
          this.user.Favorite_movies.push(movieId);
          localStorage.setItem('user', JSON.stringify(this.user));
        });
    }
  }
}
