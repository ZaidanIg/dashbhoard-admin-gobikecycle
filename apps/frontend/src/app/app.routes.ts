import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPageComponent } from './pages/login/login.component';
import { DashboardLayoutComponent } from './components/layout/layout.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard.component';
import { BicyclesPageComponent } from './pages/bicycles/bicycles.component';
import { UsersPageComponent } from './pages/users/users.component';
import { BookingsPageComponent } from './pages/bookings/bookings.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'bicycles', component: BicyclesPageComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'bookings', component: BookingsPageComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
