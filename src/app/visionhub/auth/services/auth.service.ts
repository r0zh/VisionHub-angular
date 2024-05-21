import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  public login(token: string, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
    }
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token") || sessionStorage.getItem("token");
    }
    return null;
  }

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem("token") || !!sessionStorage.getItem("token");
    }
    return false;
  }
}
