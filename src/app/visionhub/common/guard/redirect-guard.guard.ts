import { CanActivateFn } from "@angular/router";

export const RedirectGuard: CanActivateFn = (route, state) => {
  window.location.href = route.data["externalUrl"];
  return true;
};
