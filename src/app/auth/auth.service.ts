import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  public saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log("Saving token", token);
      localStorage.setItem("token", token);
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token");
    }
    return null;
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
  }

  public isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token") !== null;
    }
    return false;
  }
}
