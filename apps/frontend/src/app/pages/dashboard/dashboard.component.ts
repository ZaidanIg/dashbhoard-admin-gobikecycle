import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page fade-in">
      <div class="welcome-section">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with GoBicycle today.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-box primary">🚲</div>
          <div class="stat-content">
            <div class="label">Total Bicycles</div>
            <div class="value">{{ stats.bicycles }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="icon-box success">✅</div>
          <div class="stat-content">
            <div class="label">Available</div>
            <div class="value">{{ stats.available }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-box info">👥</div>
          <div class="stat-content">
            <div class="label">Total Users</div>
            <div class="value">{{ stats.users }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-box warning">📋</div>
          <div class="stat-content">
            <div class="label">Active Bookings</div>
            <div class="value">{{ stats.activeBookings }}</div>
          </div>
        </div>
      </div>

      <div class="section-grid">
        <div class="card recent-activity">
          <div class="card-header">
            <h3>Recent Bookings</h3>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Bicycle</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of recentBookings">
                  <td>{{ b.profile?.full_name || 'Guest' }}</td>
                  <td>{{ b.bicycle?.name }}</td>
                  <td>
                    <span class="badge" [ngClass]="b.status === 'active' ? 'badge-success' : 'badge-info'">
                      {{ b.status }}
                    </span>
                  </td>
                  <td>{{ b.created_at | date:'short' }}</td>
                </tr>
                <tr *ngIf="recentBookings.length === 0">
                  <td colspan="4" class="text-center">No recent activity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { display: flex; flex-direction: column; gap: 32px; }
    
    .welcome-section h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .welcome-section p { color: var(--text-secondary); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: var(--transition);
    }
    .stat-card:hover { transform: translateY(-4px); background: var(--bg-card-hover); }

    .icon-box {
      width: 56px; height: 56px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px;
    }
    .icon-box.primary { background: rgba(108, 99, 255, 0.15); color: var(--primary); }
    .icon-box.success { background: rgba(34, 211, 165, 0.15); color: var(--success); }
    .icon-box.info    { background: rgba(56, 189, 248, 0.15); color: var(--info); }
    .icon-box.warning { background: rgba(255, 179, 71, 0.15); color: var(--warning); }

    .stat-content .label { font-size: 13px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-content .value { font-size: 28px; font-weight: 800; color: white; margin-top: 4px; }

    .card-header { padding: 24px; border-bottom: 1px solid var(--border); }
    .card-header h3 { font-size: 18px; font-weight: 700; }
  `]
})
export class DashboardPageComponent implements OnInit {
  stats = {
    bicycles: 0,
    available: 0,
    users: 0,
    activeBookings: 0
  };
  recentBookings: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      bicycles: this.api.getBicycles(),
      users: this.api.getUsers(),
      bookings: this.api.getBookings()
    }).subscribe({
      next: (res) => {
        this.stats.bicycles = res.bicycles.length;
        this.stats.available = res.bicycles.filter((b: any) => b.is_available).length;
        this.stats.users = res.users.length;
        this.stats.activeBookings = res.bookings.filter((b: any) => b.status === 'active').length;
        this.recentBookings = res.bookings.slice(0, 5);
      }
    });
  }
}
