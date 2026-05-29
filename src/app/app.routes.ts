import { Routes } from '@angular/router';
import { AssignedTicketsComponent } from './components/assigned-tickets/assigned-tickets';
import { DashboardComponent } from './components/dashboard/dashboard';
import { EmployeesComponent } from './components/employees/employees';
import { LoginComponent } from './components/login/login';
import { MasterComponent } from './components/master/master';
import { MyTicketsComponent } from './components/my-tickets/my-tickets';
import { RaiseTicketComponent } from './components/raise-ticket/raise-ticket';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'raise-ticket', component: RaiseTicketComponent },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'assigned-tickets', component: AssignedTicketsComponent },
  { path: 'master', component: MasterComponent },
  { path: '**', redirectTo: 'login' }
];
