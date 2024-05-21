import { Routes } from "@angular/router";
import { CommunityComponent } from "./visionhub/pages/community/community.component";
import { HomeComponent } from "./visionhub/pages/home/home.component";
import { GalleryComponent } from "./visionhub/pages/gallery/gallery.component";
import { LoginComponent } from "./visionhub/pages/login/login.component";
import { RegisterComponent } from "./visionhub/pages/register/register.component";
import { VISIONHUB_PATHES } from "./visionhub/properties/properties";

export const routes: Routes = [
  { path: VISIONHUB_PATHES.HOME, component: HomeComponent },
  { path: "", redirectTo: VISIONHUB_PATHES.HOME, pathMatch: "full" },
  { path: VISIONHUB_PATHES.GALLERY, component: GalleryComponent },
  { path: VISIONHUB_PATHES.COMMUNITY, component: CommunityComponent },
  { path: VISIONHUB_PATHES.LOGIN, component: LoginComponent },
  { path: VISIONHUB_PATHES.REGISTER, component: RegisterComponent },
];
