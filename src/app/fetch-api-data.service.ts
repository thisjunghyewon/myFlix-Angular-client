import { Injectable } from '@angular/core';
// import { map, catchError, tap } from 'rxjs/operators';
import { map, mergeMap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mymovieflix-3d9c07cffa0d.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   * Making the api call for the user registration endpoint
   * @param userDetails
   * @returns a user that has been registered in the DB
   * used in user-registration-form component
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      //Using this.http, it posts it to the API endpoint and returns the API's response.
      // tap((response: any) => {
      //   localStorage.setItem('user', JSON.stringify(response.user)); // Assuming the response contains the user object
      //   localStorage.setItem('token', response.token); // Assuming the response contains the token
      // }),
      catchError(this.handleError)
    );
  }

  /**
   * direct users to the login page
   * @param userDetails
   * @returns will login the user with a token and user info in the local storage
   * used in user-login-form component
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      // tap((response: any) => {
      //   localStorage.setItem('user', JSON.stringify(response.user)); // Assuming the response contains the user object
      //   localStorage.setItem('token', response.token); // Assuming the response contains the token
      // }),
      catchError(this.handleError)
    );
  }
  /**
   * @returns all of the movies
   * used in the movie-card component
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @param title
   * @returns a movie title for the user
   */
  getOneMovie(Title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + Title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get all directors endpoint
  // getAllDirectors(): Observable<any> {
  //   const directors = JSON.parse(localStorage.getItem('directors') || '{}');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + directors, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  /**
   * @returns all the directors in the DB
   */
  getAllDirectors(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get a director endpoint
  // getOneDirector(): Observable<any> {
  //   const directors = JSON.parse(localStorage.getItem('directors') || '{}');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + `directors/${directors.Name}`, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }

  /**
   *
   * @param directorName
   * @returns the director by name
   * used in the movie-card component
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors/' + directorName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @returns all genres in the DB
   */
  getAllGenres(): Observable<any> {
    // const genres = JSON.parse(localStorage.getItem('genres') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'genres', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   *
   * @param genreName
   * @returns the genre by name
   * used in the movie-card component
   */
  getOneGenre(genreName: string): Observable<any> {
    // const genres = JSON.parse(localStorage.getItem('genres') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * have the list of favorite movies displayed on their profile page
   * @param username
   * @returns the users array of favorite movies
   */
  // getFavoriteMovies(Username: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + 'users/' + Username, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(
  //       map(this.extractResponseData),
  //       map((data) => data.Favorite_movies),
  //       catchError(this.handleError)
  //     );
  // }
  getFavoriteMovies(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + Username, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.Favorite_movies),
        catchError(this.handleError)
      );
  }

  /**
   * @param Username
   * @param MovieID
   * @returns a movie added to the users favorite movies array
   * used in the movie-card component
   */
  // addFavoriteMovie(MovieID: string): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');

  //   console.log('Before:', user.Favorite_movies);
  //   user.Favorite_movies.push(MovieID); // Update the FavoriteMovies array
  //   console.log('After:', user.Favorite_movies);
  //   localStorage.setItem('user', JSON.stringify(user)); // Update the user object in localStorage
  //   return this.http
  //     .post(
  //       apiUrl + 'users/' + user.Username + '/movies/' + MovieID,
  //       {},
  //       {
  //         headers: new HttpHeaders({
  //           Authorization: 'Bearer ' + token,
  //         }),
  //       }
  //     )
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  // Ensure that FavoriteMovies is an array before pushing
  //   if (!Array.isArray(user.Favorite_movies)) {
  //     user.Favorite_movies = [];
  //   }

  //   user.Favorite_movies.push(MovieID);
  //   localStorage.setItem('user', JSON.stringify(user));

  //   return this.http
  //     .put(
  //       apiUrl + `users/${user.Username}/movies/${MovieID}`,
  //       {},
  //       {
  //         headers: new HttpHeaders({
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + token,
  //         }),
  //       }
  //     )
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  addFavoriteMovie(Username: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .post(apiUrl + 'users/' + Username + '/movies/' + MovieID, null, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * @param Username
   * @param MovieID
   * @returns deletes the movie from the users favorite movies array
   * used in the movie-card component and the user-profile component
   */
  // deleteFavoriteMovie(MovieID: string): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
  //   const index = user.Favorite_movies.indexOf(MovieID);
  //   if (index > -1) {
  //     user.Favorite_movies.splice(index, 1); // Remove the movie ID from the array
  //   }

  //   localStorage.setItem('user', JSON.stringify(user)); // Update the user object in localStorage

  //   return this.http
  //     .delete(apiUrl + 'users/' + user.Username + '/movies/' + MovieID, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //       responseType: 'text',
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  deleteFavoriteMovie(Username: string, MovieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .delete(apiUrl + 'users/' + Username + '/movies/' + MovieID, {
        headers,
        responseType: 'text',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * @param MovieID
   * @returns a boolean value that will check if the favorite movies array has the param of movieID
   * used in the movie-card component
   */
  isFavoriteMovie(MovieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) return user.Favorite_movies.includes(MovieID);
    return false;
  }

  /**
   * get one of the users
   * @param username
   * @returns the user on the user-profile component
   */
  // getOneUser(): Observable<any> {
  //   const username = localStorage.getItem('Username');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .get(apiUrl + 'users/' + username, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  getOneUser(Username: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  /**
   * edit the users profile and update information
   * @param username
   * @param updatedUser
   * @returns takes the data the user wants to change in the user-profile component and updates it for the user and the DB
   */
  // editUser(updatedUser: any): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .put(apiUrl + 'users/' + user.Username, updatedUser, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  editUser(Username: string, updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + Username, updatedUser, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * delete the users account
   * @param username
   * @returns a deleted user from the DB
   * used in the user-profile component
   */
  // deleteUser(): Observable<any> {
  //   const user = JSON.parse(localStorage.getItem('user') || '{}');
  //   const token = localStorage.getItem('token');
  //   return this.http
  //     .delete(apiUrl + 'users/' + user._id, {
  //       headers: new HttpHeaders({
  //         Authorization: 'Bearer ' + token,
  //       }),
  //     })
  //     .pipe(catchError(this.handleError));
  // }
  deleteUser(Username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
          responseType: 'text',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.log(error);
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
