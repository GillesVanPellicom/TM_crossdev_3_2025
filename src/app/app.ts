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
  // Application title, managed as an Angular signal for reactive updates.
  protected readonly title = signal('crossdev3');

  // Inject Router for navigation and ThemeService to initialize the application's theme.
  // The ThemeService is injected here to ensure it's instantiated at app startup.
  constructor(private router: Router, private themeService: ThemeService) {
  }

  // Lifecycle hook that is called after Angular has initialized all data-bound properties.
  ngOnInit(): void {
    // This is a good place for one-time initializations.
  }

  // Navigates to a specified route within the application.
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
