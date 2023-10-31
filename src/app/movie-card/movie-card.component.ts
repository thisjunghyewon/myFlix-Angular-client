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
  // getMovies(): void {
  //   this.fetchApiData.getAllMovies().subscribe((resp: any) => {
  //     this.movies = resp;
  //     console.log(this.movies);
  //     return this.movies;
  //   });
  // }
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
  private findMoviesDirectors(movie: any): void {
    let foundDirectors: any[] = [];
    movie.Directors.forEach((director: any) => {
      foundDirectors.push(this.directors.find((d) => d._id === director));
    });
    movie.Directors = foundDirectors;
  }
  /**
   * @param movie
   * @returns the movie's genre
   */
  // openGenre(name: string, description: string): void {
  //   this.dialog.open(GenreComponent, {
  //     data: {
  //       Name: name,
  //       Description: description,
  //     },
  //     width: '400px',
  //   });
  // }
  private findMoviesGenre(movie: any): void {
    let foundGenre: any;
    foundGenre = this.genres.find((g) => g._id === movie.Genre);
    movie.Genre = foundGenre;
  }

  listDirectors(directors: any) {
    return directors.map((director: any) => {
      return director.Name;
    });
  }
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
    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoSecondComponent, dialogConfig);
  }

  /**
   * @param movie
   * @returns the movie's director
   */
  // openDirector(
  //   name: string,
  //   bio: string,
  //   birthday: string,
  //   death: string
  // ): void {
  //   this.dialog.open(DirectorComponent, {
  //     data: {
  //       Name: name,
  //       Bio: bio,
  //       Birth: birthday,
  //       Death: death,
  //     },
  //     width: '400px',
  //   });
  // }

  /**
   * @param directors
   * the directors will be passed into the dialog when openend
   */
  openDirectorsDialog(directors: any): void {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    const directorNames = directors.map((director: any) => director.Name);
    const directorBios = directors.map((director: any) => director.Bio);
    const directorBirth = directors.map((director: any) => director.Birth);
    const directorDeath = directors.map((director: any) => director.Death);
    dialogConfig.data = {
      dialogTitle: directorNames,
      dialogContent: { directorBios, directorBirth, directorDeath },
    };
    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoComponent, dialogConfig);
  }

  /**
   * @param description
   * param data will be passed into the dialog when opened
   */
  // openSummary(title: string, description: string): void {
  //   this.dialog.open(MovieInfoComponent, {
  //     data: {
  //       Title: title,
  //       Description: description,
  //     },
  //     width: '400px',
  //   });
  // }
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
   * @param MovieID
   * will set the selected movie as one of the user's favorites
   */
  // getFavorites(): void {
  //   this.fetchApiData.getOneUser().subscribe(
  //     (resp: any) => {
  //       if (resp.user && resp.user.Favorite_movies) {
  //         this.favorites = resp.user.Favorite_movies;
  //       } else {
  //         this.favorites = []; // Set an empty array if data is not available
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error fetching user data:', error);
  //       this.favorites = []; // Set an empty array on error as well
  //     }
  //   );
  // }

  // check if a movie is a user's favorite
  // isFavoriteMovie(MovieID: string): boolean {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   return user.Favorite_movies.indexOf(MovieID) >= 0;
  // }
  // // add a movie to a user's favorites
  // addToFavorites(id: string): void {
  //   if (this.isFavoriteMovie(id)) {
  //     // Movie is already a favorite, so remove it
  //     this.removeFromFavorites(id);
  //     /*   this.snackBar.open('Movie removed from favorites', 'OK', {
  //     duration: 2000,
  //   }); */
  //   } else {
  //     // Movie is not a favorite, so add it
  //     this.fetchApiData.addFavoriteMovie(id).subscribe(() => {
  //       this.snackBar.open('Movie added to favorites', 'OK', {
  //         duration: 2000,
  //       });
  //       this.getFavorites();
  //     });
  //   }
  // }

  // // Removes a movie from a user's favorites
  // removeFromFavorites(id: string): void {
  //   console.log(id);
  //   this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
  //     this.snackBar.open('Movie removed from favorites', 'OK', {
  //       duration: 2000,
  //     });

  //     const username = localStorage.getItem('Username');
  //     if (username !== null) {
  //       // Fetch the updated favorites data
  //       this.fetchApiData
  //         .getFavoriteMovies(username)
  //         .subscribe((favorites: any) => {
  //           this.favorites = favorites;
  //         });
  //     }
  //   });
  // }
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
