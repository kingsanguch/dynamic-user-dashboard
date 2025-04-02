import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserFormComponent } from './user-form/user-form.component';
import { CounterComponent } from './counter/counter.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard/users', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserManagementComponent },
      {path: 'new-user', component: UserFormComponent},
      {path:'counter', component: CounterComponent}
    ]
  },
  { path: '**', redirectTo: 'dashboard/users' }
];
