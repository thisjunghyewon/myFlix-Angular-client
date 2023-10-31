// import { Component, OnInit, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

//to close the dialog on success
// import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

//brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

//to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

// import { formatDate } from '@angular/common';
import { MovieInfoSecondComponent } from '../movie-info-second/movie-info-second.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  Favorite_movies: any[] = [];
  updatedUser: any = {};
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.getFavoriteMovies();
    } else {
      this.router.navigate(['welcome']);
    }
  }

  /**
   * @returns the user's favorite movies list
   */
  getFavoriteMovies(): void {
    this.fetchApiData
      .getFavoriteMovies(this.user.Username || '')
      .subscribe((favoriteMoviesIDs: any) => {
        this.fetchApiData.getAllMovies().subscribe((movies: any) => {
          // filter the full movies objects array against the array of favorite movies id of the user
          this.Favorite_movies = movies.filter((movie: any) =>
            favoriteMoviesIDs.includes(movie._id)
          );
        });
      });
  }

  /**
   * updates the user's information on form submission
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.user.Username, this.updatedUser).subscribe(
      (resp: any) => {
        this.snackBar.open('Update Successful!', 'OK', {
          duration: 2000,
        });
        localStorage.setItem('user', JSON.stringify(resp));
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * deletes the user's account and navigates the user back to the login/sign up page
   */
  deleteUser(): void {
    this.fetchApiData.deleteUser(this.user.Username).subscribe(
      (resp: any) => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['welcome']);
      },
      (result) => {
        console.log(result);
        this.snackBar.open('Cannot delete user', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * @param movie
   * will open a dialog with the selected movie's details
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.closeAll();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      dialogTitle: 'Synopsis',
      dialogContent: movie.Description,
    };
    dialogConfig.width = '500px';
    this.dialog.open(MovieInfoSecondComponent, dialogConfig);
  }

  /**
   * @param movie
   * removes the selected movie from the user's favorite movies list
   */
  removeFromFavoriteMovies(movie: any): void {
    if (this.user.Favorite_movies.includes(movie._id)) {
      this.fetchApiData
        .deleteFavoriteMovie(this.user.Username, movie._id)
        .subscribe((resp: any) => {
          this.user.Favorite_movies = this.user.Favorite_movies.filter(
            (id: String) => id !== movie._id
          );
          localStorage.setItem('user', JSON.stringify(this.user));
        });
    }
  }
}
