import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'task',
    loadComponent: () =>
      import('./components/post-task/post-task.component').then((m) => m.PostTaskComponent),
  },
  { 
    path: "task/:id/update", 
    loadComponent: () =>
      import('./components/update-task/update-task.component').then((m) => m.UpdateTaskComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}