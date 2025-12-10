import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register/register';
import { ManageUsers } from './features/admin/manage-users/manage-users';
import { AdminScheduleComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { Appointment } from './core/models/appointment';
import { ProgrammerAppointmentsComponent } from './features/programmer/appointments/appointments';
import { ProgrammerProjectsComponent } from './features/programmer/manage-projects/manage-projects';
import { RequestAppointmentComponent } from './features/public/solicitud/solicitud-appointment/solicitud-appointment';
import { authGuard } from './core/guards/auth-guard';
import { PublicProjectsComponent } from './features/public/project-public/project-public/project-public';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path:'home',
        component:Home
    },
    {
        path:'login',
        component:Login
    },
    {
        path:'registro',
        component:Register
    },
    {
        path:'admin',
        component:ManageUsers
    },
    {   path: 'admin/schedule', 
        component: AdminScheduleComponent 
    },
    {   path: 'programmer/projects', 
        component: ProgrammerProjectsComponent
    },
    {   path: 'programmer/appointments', 
        component: ProgrammerAppointmentsComponent
    },
    {
        path:'asesorias',
        component:RequestAppointmentComponent,
        canActivate:[authGuard]
    },
    {
        path:'proyectos',
        component:PublicProjectsComponent
    }
];
