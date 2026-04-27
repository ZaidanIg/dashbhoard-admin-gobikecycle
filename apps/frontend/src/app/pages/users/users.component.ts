import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-page fade-in">
      <div class="header-section">
        <div>
          <h1>User Management</h1>
          <p>View registered users and manage their wallet balance.</p>
        </div>
        <button class="btn btn-ghost" (click)="loadUsers()">
          <span>🔄</span> Refresh
        </button>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>NIK</th>
                <th>Balance</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td>{{ u.full_name }}</td>
                <td>{{ u.nik }}</td>
                <td>
                  <span style="color: var(--success); font-weight: 700;">
                    Rp {{ u.balance | number }}
                  </span>
                </td>
                <td>{{ u.created_at | date:'mediumDate' }}</td>
                <td>
                  <button class="btn btn-primary btn-sm" (click)="openTopUp(u)">
                    Top Up
                  </button>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="5" class="empty-state">
                  <div class="icon">👥</div>
                  <p>No users found yet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Up Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-box">
          <h2 class="modal-title">Manual Top Up</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">
            Add balance to <strong>{{ selectedUser.full_name }}</strong>'s wallet.
          </p>
          
          <form (ngSubmit)="confirmTopUp()">
            <div class="form-group">
              <label class="form-label">Amount (Rp)</label>
              <input type="number" class="form-control" name="amount" [(ngModel)]="topUpAmount" placeholder="e.g. 50000" required>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-ghost" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!topUpAmount || topUpAmount <= 0">
                Confirm Top Up
              </button>
            </div>
          </form>
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
export class UsersPageComponent implements OnInit {
  users: any[] = [];
  showModal = false;
  selectedUser: any = null;
  topUpAmount: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe(res => this.users = res);
  }

  openTopUp(user: any) {
    this.selectedUser = user;
    this.topUpAmount = 0;
    this.showModal = true;
  }

  confirmTopUp() {
    if (this.selectedUser && this.topUpAmount > 0) {
      this.api.topUpUser(this.selectedUser.id, this.topUpAmount).subscribe(() => {
        this.loadUsers();
        this.showModal = false;
        alert('Top up successful!');
      });
    }
  }
}
