import { Component, inject, OnInit, signal } from '@angular/core';
import { Ticket } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.html'
})
export class MyTicketsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly error = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser();

    if (!user) {
      this.error.set('Please login first.');
      return;
    }

    this.ticketService.getRaisedByEmployee(user.employeeId).subscribe({
      next: tickets => this.tickets.set(tickets),
      error: () => this.error.set('Could not load your tickets.')
    });
  }

  requestDataRows(ticket: Ticket): { key: string; value: string }[] {
    if (!ticket.requestDataJson) {
      return [];
    }

    try {
      const data = JSON.parse(ticket.requestDataJson) as Record<string, unknown>;

      return Object.keys(data).map(key => ({
        key: this.formatKey(key),
        value: String(data[key] ?? '')
      }));
    } catch {
      return [];
    }
  }

  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, firstLetter => firstLetter.toUpperCase());
  }
}
