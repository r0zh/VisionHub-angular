import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Default to false until authenticated
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (this.isLoggedIn()) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  public login(token: string, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
    }
    this.isAuthenticatedSubject.next(true);
  }

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
    this.isAuthenticatedSubject.next(false);
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
