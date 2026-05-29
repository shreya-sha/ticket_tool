import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly isDark = signal(false);

  protected toggleTheme(): void {
    this.isDark.update(value => !value);
  }

  protected logout(): void {
    this.authService.logout();
  }
}
