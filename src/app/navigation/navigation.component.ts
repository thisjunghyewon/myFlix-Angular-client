import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public username: string = '';

  constructor(public router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.username = JSON.parse(localStorage.getItem('user')!).Username;
  }

  navigateToMovieView(): void {
    this.router.navigate(['movies']);
  }

  navigateToUserProfile(): void {
    this.router.navigate(['user-profile']);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
