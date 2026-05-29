import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-assigned-tickets',
  imports: [FormsModule],
  templateUrl: './assigned-tickets.html'
})
export class AssignedTicketsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly ticketService = inject(TicketService);

  readonly tickets = signal<Ticket[]>([]);
  readonly selectedTicketId = signal<number | null>(null);
  readonly newStatus = signal('InProgress');
  readonly comment = signal('');
  readonly message = signal('');
  readonly error = signal('');

  ngOnInit(): void {
    this.loadTickets();
  }

  selectTicket(ticket: Ticket): void {
    this.selectedTicketId.set(ticket.ticketId);
    this.newStatus.set(ticket.status === 'Assigned' ? 'InProgress' : ticket.status);
    this.comment.set('');
  }

  updateStatus(): void {
    const user = this.authService.currentUser();
    const ticketId = this.selectedTicketId();

    if (!user || !ticketId) {
      this.error.set('Select a ticket first.');
      return;
    }

    this.ticketService.updateStatus(ticketId, {
      changedByEmployeeId: user.employeeId,
      newStatus: this.newStatus(),
      comment: this.comment()
    }).subscribe({
      next: ticket => {
        this.message.set(`${ticket.ticketNumber} moved to ${ticket.status}.`);
        this.error.set('');
        this.selectedTicketId.set(null);
        this.loadTickets();
      },
      error: () => this.error.set('Could not update ticket status.')
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

  private loadTickets(): void {
    const user = this.authService.currentUser();

    if (!user) {
      this.error.set('Please login first.');
      return;
    }

    this.ticketService.getAssignedToEmployee(user.employeeId).subscribe({
      next: tickets => this.tickets.set(tickets),
      error: () => this.error.set('Could not load assigned tickets.')
    });
  }

  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, firstLetter => firstLetter.toUpperCase());
  }
}
