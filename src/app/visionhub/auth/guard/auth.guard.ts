import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkToken().subscribe({
    next: (response) => {
      return true;
    },
    error: (error) => {
      router.navigate(["/login"]);
      return false;
    },
  });

  return true;
};
