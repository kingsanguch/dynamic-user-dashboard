import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/users', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserManagementComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard/users' }
];
