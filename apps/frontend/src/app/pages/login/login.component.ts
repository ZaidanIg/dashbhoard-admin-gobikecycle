import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card fade-in">
        <div class="header">
          <div class="logo">🚲</div>
          <h1>Admin Console</h1>
          <p>Please enter your credentials to continue</p>
        </div>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control" 
              name="username" 
              [(ngModel)]="username" 
              placeholder="Enter username"
              required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              name="password" 
              [(ngModel)]="password" 
              placeholder="Enter password"
              required>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%" [disabled]="isLoading || !loginForm.valid">
            {{ isLoading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
      
      <div class="footer">
        GoBicycle Admin Dashboard v1.0 &copy; 2026
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1a1c2e, #0f1117);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-lg);
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .header { text-align: center; margin-bottom: 32px; }
    .logo { font-size: 40px; margin-bottom: 12px; }
    h1 { font-size: 24px; font-weight: 800; color: white; margin-bottom: 8px; }
    p { font-size: 14px; color: var(--text-secondary); }

    form { display: flex; flex-direction: column; gap: 20px; }

    .error-message {
      padding: 12px;
      background: rgba(255, 78, 106, 0.1);
      border: 1px solid rgba(255, 78, 106, 0.2);
      border-radius: var(--radius-sm);
      color: var(--danger);
      font-size: 13px;
      text-align: center;
    }

    .footer { margin-top: 32px; font-size: 12px; color: var(--text-muted); }
  `]
})
export class LoginPageComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.error = '';
    
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }
}
