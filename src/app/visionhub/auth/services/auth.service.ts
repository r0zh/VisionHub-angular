import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthResponse } from "../model/auth-response";
import { User } from "../../common/model/user";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Default to false until authenticated
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    if (this.isLoggedIn()) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  public login(email: string, password: string, rememberMe: boolean): void {
    this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response.token, rememberMe);
        this.messageService.add({ severity: "success", detail: "Logged in successfully" });
        //redirect to community
        this.router.navigate(["/community"]);
      },
      error: (error) => {
        if (error.status === 401) {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Invalid email or password" });
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: "An error occurred. Please try again later." });
        }
        console.log("Error occurred: ", error);
      },
      complete: () => console.log("Login request completed"),
    });
  }

  private handleLoginSuccess(token: string, rememberMe: boolean): void {
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
