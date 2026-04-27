import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">🚲</span>
            <span class="logo-text">GoBicycle <span>Admin</span></span>
          </div>
        </div>
        
        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/bicycles" routerLinkActive="active" class="nav-item">
            <span class="icon">🚲</span> Manage Bicycles
          </a>
          <a routerLink="/users" routerLinkActive="active" class="nav-item">
            <span class="icon">👥</span> Manage Users
          </a>
          <a routerLink="/bookings" routerLinkActive="active" class="nav-item">
            <span class="icon">📋</span> Bookings
          </a>
        </nav>

        <div class="sidebar-footer">
          <button (click)="logout()" class="btn btn-danger btn-sm" style="width: 100%">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main">
        <header class="header">
          <div class="page-title">Admin Console</div>
          <div class="user-info">
            <div class="avatar">AD</div>
            <div class="name">Administrator</div>
          </div>
        </header>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; }
    
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(20px);
    }

    .sidebar-header { padding: 32px 24px; }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-icon { font-size: 24px; }
    .logo-text { font-size: 18px; font-weight: 800; color: white; }
    .logo-text span { color: var(--primary); font-weight: 400; font-size: 14px; }

    .nav { flex: 1; padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 500;
      transition: var(--transition);
    }
    .nav-item:hover { background: var(--bg-card-hover); color: white; }
    .nav-item.active { background: var(--primary-light); color: var(--primary); }
    .nav-item .icon { font-size: 18px; }

    .sidebar-footer { padding: 24px; border-top: 1px solid var(--border); }

    .main { flex: 1; display: flex; flex-direction: column; overflow-y: auto; background: var(--bg); }
    
    .header {
      height: var(--topbar-height);
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      background: rgba(15, 17, 23, 0.8);
      backdrop-filter: blur(10px);
      position: sticky; top: 0; z-index: 100;
    }

    .page-title { font-size: 14px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    .user-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
    .name { font-size: 14px; font-weight: 500; }

    .content { padding: 32px; flex: 1; }
  `]
})
export class DashboardLayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
