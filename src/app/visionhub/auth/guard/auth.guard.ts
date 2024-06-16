import { inject } from "@angular/core";
import { AuthService } from "./../services/auth.service";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkToken().subscribe({
    next: (response) => {
      console.log("Token is valid");
      return true;
    },
    error: (error) => {
      console.log("Token is invalid");
      router.navigate(["/login"]);
      return false;
    },
  });

  return true;
};
