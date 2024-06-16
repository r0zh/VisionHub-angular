import { response } from "express";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID, WritableSignal, signal } from "@angular/core";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { AuthResponse } from "../model/auth-response";
import { User } from "../../common/model/user";
import { Router } from "@angular/router";
import { Console } from "console";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Default to false until authenticated
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private user: WritableSignal<User> = signal(new User());
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkToken().subscribe({
        next: (response) => {
          this.isAuthenticatedSubject.next(true);
          this.user = signal(response.user);
        },
        error: (error) => {
          if (error.status === 401) {
            this.isAuthenticatedSubject.next(false);
          }
        },
      });
    }
  }

  public login(email: string, password: string, rememberMe: boolean): void {
    this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response.token, rememberMe);
        this.user = signal(response.user);
        this.messageService.add({ severity: "success", detail: "Logged in successfully" });
        this.router.navigate(["/generator"]);
        this.isAuthenticatedSubject.next(true);
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

  public register(name: string, email: string, password: string): void {
    this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password }).subscribe({
      next: (response) => {
        this.messageService.add({ severity: "success", detail: "Registered successfuly" });
        this.login(email, password, true);
      },
      error: (error) => {
        if (error.status === 401) {
          this.messageService.add({ severity: "error", summary: "Error", detail: error.error.errors.email[0] });
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
    this.router.navigate(["/community"]);
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem("token") || sessionStorage.getItem("token");
    }
    return null;
  }

  public checkToken() {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.getToken(),
      }),
    };

    return this.http.get<AuthResponse>(`${environment.apiUrl}/auth/checkToken`, options);
  }

  public getCurrentUser(): Observable<User> {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.getToken(),
      }),
    };

    return this.http.get<User>(`${environment.apiUrl}/user`, options);
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Unathorized" });
      this.router.navigate(["/login"]);
    }
    if (error.status === 403) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Forbidden" });
    }
    if (error.status === 500) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Internal server error" });
    }
    this.router.navigate(["/login"]);
    this.isAuthenticatedSubject.next(false);
  }
}
