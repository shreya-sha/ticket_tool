import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStats } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly ticketService = inject(TicketService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly error = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser();

    if (!user) {
      this.error.set('Please login first.');
      return;
    }

    this.ticketService.getDashboard(user.employeeId).subscribe({
      next: value => this.stats.set(value),
      error: () => this.error.set('Could not load dashboard.')
    });
  }
}
