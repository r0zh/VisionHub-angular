import { Routes } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'gallery', component: GalleryComponent },
    { path: 'community', component: CommunityComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'register', redirectTo: '/auth/register', pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent }
];