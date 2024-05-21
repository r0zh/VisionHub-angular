import { Routes } from "@angular/router";
import { CommunityComponent } from "./visionhub/pages/community/community.component";
import { HomeComponent } from "./visionhub/pages/home/home.component";
import { GalleryComponent } from "./visionhub/pages/gallery/gallery.component";
import { LoginComponent } from "./visionhub/pages/login/login.component";
import { RegisterComponent } from "./visionhub/pages/register/register.component";

export const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "gallery", component: GalleryComponent },
  { path: "community", component: CommunityComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "login", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "register", redirectTo: "/auth/register", pathMatch: "full" },
  { path: "auth/login", component: LoginComponent },
  { path: "auth/register", component: RegisterComponent },
];
