import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('crossdev3');

  constructor(private router: Router, private themeService: ThemeService) {
    console.log('App component constructor called.');
  }

  ngOnInit(): void {
    console.log('App component ngOnInit called.');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
