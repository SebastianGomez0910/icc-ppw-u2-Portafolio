import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { ProgrammerProfile } from './features/public/programmer-profile/programmer-profile';
import { Loading } from './shared/components/loading/loading';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { ManageUsers } from './features/admin/manage-users/manage-users';
import { ProgrammerDashboard } from './features/programmer/programmer-dashboard/programmer-dashboard';
import { ManageProjects } from './features/programmer/manage-projects/manage-projects';
import { Appointments } from './features/programmer/appointments/appointments';

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
        path:'profile/:id',
        component:ProgrammerProfile
    },
    {
        path:'login',
        component:Loading
    },
    {
        path:'admin',
        component:AdminDashboard,
        children:[
            {
                path:'users',
                component:ManageUsers
            }
        ]
    },
    {
        path:'programer',
        component:ProgrammerDashboard,
        children:[
            {
                path:'projects',
                component:ManageProjects
            },
            {
                path:'appointments',
                component:Appointments
            }
        ]
    },
    {
        path:'**',
        redirectTo:'home'
    }
];
