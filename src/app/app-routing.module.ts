import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { ErrorComponent } from './components/error/error.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'pages',
    pathMatch: 'full' 
  },
  { path: 'pages', loadChildren: './components/pages/pages.module#PagesModule' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: ErrorComponent }    
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);