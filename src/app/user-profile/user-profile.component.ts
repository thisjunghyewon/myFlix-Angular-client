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
  favoriteMovies: any[] = [];
  updatedUser: any = {};
  movies: any[] = [];
  // @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.getUser();
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.fetchFavoriteMovies();
    } else {
      this.router.navigate(['welcome']);
    }
  }

  /**
   * @returns the user's favorite movies list
   */
  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp;
      movies.forEach((movie: any) => {
        if (this.user.Favorite_movies.includes(movie._id)) {
          this.favoriteMovies.push(movie);
        }
      });
    });
  }

  /**
   * Username and token will be taken from localstorage to send a request to the api for the users information
   * User profile page will then be able to display the users favorite movies list and their username, name, email, etc.
   */

  // getUser(): void {
  //   this.fetchApiData.getOneUser().subscribe((response: any) => {
  //     this.user = response;
  //     this.userData.Username = this.user.Username;
  //     this.userData.Email = this.user.Email;
  //     this.user.Birthday = formatDate(
  //       this.user.Birthday,
  //       'yyyy-MM-dd',
  //       'en-US',
  //       'UTC+0'
  //     );

  //     this.fetchApiData.getAllMovies().subscribe((response: any) => {
  //       this.Favorite_movies = response.filter(
  //         (m: { _id: any }) => this.user.Favorite_movies.indexOf(m._id) >= 0
  //       );
  //     });
  //   });
  // }

  // editUser(): void {
  //   this.fetchApiData.editUser(this.userData).subscribe(
  //     (data) => {
  //       localStorage.setItem('user', JSON.stringify(data));
  //       localStorage.setItem('Username', data.Username);
  //       console.log(data);
  //       this.snackBar.open('User has been updated', 'OK', {
  //         duration: 2000,
  //       });
  //       window.location.reload();
  //     },
  //     (result) => {
  //       this.snackBar.open(result, 'OK', {
  //         duration: 2000,
  //       });
  //     }
  //   );
  // }

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
    // if (confirm('are you sure?')) {
    //   this.router.navigate(['welcome']).then(() => {
    //     this.snackBar.open('You have successfully deleted your account', 'OK', {
    //       duration: 2000,
    //     });
    //   });
    //   this.fetchApiData.deleteUser().subscribe((result) => {
    //     console.log(result);
    //     localStorage.clear();
    //   });
    // }
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
