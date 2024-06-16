import { Routes } from "@angular/router";
import { authGuard } from "./visionhub/auth/guard/auth.guard";
import { CommunityComponent } from "./visionhub/pages/community/community.component";
import { GalleryComponent } from "./visionhub/pages/gallery/gallery.component";
import { GeneratorComponent } from "./visionhub/pages/generator/generator.component";
import { HomeComponent } from "./visionhub/pages/home/home.component";
import { LoginComponent } from "./visionhub/pages/login/login.component";
import { RegisterComponent } from "./visionhub/pages/register/register.component";
import { VISIONHUB_PATHES } from "./visionhub/properties/properties";
import { ProfileComponent } from "./visionhub/pages/profile/profile.component";

export const routes: Routes = [
  { path: VISIONHUB_PATHES.HOME, component: HomeComponent },
  { path: VISIONHUB_PATHES.GENERATOR, component: GeneratorComponent, canActivate: [authGuard] },
  { path: "", redirectTo: VISIONHUB_PATHES.HOME, pathMatch: "full" },
  { path: VISIONHUB_PATHES.GALLERY, component: GalleryComponent, canActivate: [authGuard] },
  { path: VISIONHUB_PATHES.COMMUNITY, component: CommunityComponent },
  { path: VISIONHUB_PATHES.LOGIN, component: LoginComponent },
  { path: VISIONHUB_PATHES.REGISTER, component: RegisterComponent },
  { path: VISIONHUB_PATHES.PROFILE, component: ProfileComponent },
];
