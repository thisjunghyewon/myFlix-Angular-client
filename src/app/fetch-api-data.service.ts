import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mymovieflix-3d9c07cffa0d.herokuapp.com';
@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      //Using this.http, it posts it to the API endpoint and returns the API's response.
      catchError(this.handleError)
    );
  }

  //user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  //get all movies endpoint
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

  //get a single movie endpoint
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
  getAllDirectors(): Observable<any> {
    const directors = JSON.parse(localStorage.getItem('directors') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + directors, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get a director endpoint
  getOneDirector(): Observable<any> {
    const directors = JSON.parse(localStorage.getItem('directors') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + `directors/${directors.Name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get all genres endpoint
  getAllGenres(): Observable<any> {
    const genres = JSON.parse(localStorage.getItem('genres') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + genres, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get a genre endpoint
  getOneGenre(): Observable<any> {
    const genres = JSON.parse(localStorage.getItem('genres') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + `genres/${genres.Name}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // get favourite movies for a user endpoint
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return this.http
      .get(apiUrl + `users/${users.Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.favoriteMovies),
        catchError(this.handleError)
      );
  }

  //add a movie to favourite Movies endpoint
  addFavoriteMovie(MovieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    return this.http
      .post(
        apiUrl + `users/${users.Username}/movies/${MovieId}`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //delete favorite movie
  removeFavoriteMovie(MovieId: string): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + `users/${users.Username}/movies/${MovieId}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //get a user endpoint
  getOneUser(): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + `users/${users.Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  //edit user endpoint
  editUser(updatedUser: any): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + `users/${users.Username}`, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //delete user endpoint
  deleteUser(): Observable<any> {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + `users/${users.Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
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
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
