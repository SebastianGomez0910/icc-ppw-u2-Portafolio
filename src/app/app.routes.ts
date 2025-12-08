import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register/register';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { ManageUsers } from './features/admin/manage-users/manage-users';

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
    }
];
