import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bookings-page fade-in">
      <div class="header-section">
        <div>
          <h1>Booking History</h1>
          <p>Monitor all bicycle rental activities and transactions.</p>
        </div>
        <button class="btn btn-ghost" (click)="loadBookings()">
          <span>🔄</span> Refresh
        </button>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Bicycle</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bookings">
                <td style="font-family: monospace; font-size: 12px; color: var(--text-muted);">
                  #{{ b.id.substring(0, 8) }}
                </td>
                <td>{{ b.profile?.full_name || 'Guest' }}</td>
                <td>{{ b.bicycle?.name }}</td>
                <td>
                  <span class="badge" [ngClass]="b.status === 'active' ? 'badge-success' : 'badge-info'">
                    {{ b.status | titlecase }}
                  </span>
                </td>
                <td>{{ b.created_at | date:'medium' }}</td>
                <td>
                  <span *ngIf="b.total_price" style="font-weight: 600;">
                    Rp {{ b.total_price | number }}
                  </span>
                  <span *ngIf="!b.total_price" style="color: var(--text-muted); font-style: italic;">
                    Ongoing
                  </span>
                </td>
              </tr>
              <tr *ngIf="bookings.length === 0">
                <td colspan="6" class="empty-state">
                  <div class="icon">📋</div>
                  <p>No bookings found yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section { margin-bottom: 32px; }
    .header-section h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .header-section p { color: var(--text-secondary); }
  `]
})
export class BookingsPageComponent implements OnInit {
  bookings: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.api.getBookings().subscribe(res => this.bookings = res);
  }
}
