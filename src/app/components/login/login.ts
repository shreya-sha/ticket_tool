import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('it.admin@example.com');
  readonly password = signal('Password@123');
  readonly isLoading = signal(false);
  readonly error = signal('');

  login(): void {
    this.error.set('');
    this.isLoading.set(true);

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: user => {
        this.authService.saveLogin(user);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.error.set('Invalid email or password.')
         this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }
}
