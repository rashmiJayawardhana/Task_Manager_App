import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'task-details/:id',
    loadComponent: () =>
      import('./components/view-task-details/view-task-details.component').then(m => m.ViewTaskDetailsComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../../shared/components/profile/profile.component').then((m) => m.ProfileComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
