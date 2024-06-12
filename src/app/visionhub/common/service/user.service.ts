import { Injectable, WritableSignal, signal } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { tap, retry, catchError, throwError } from "rxjs";
import { User } from "../model/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private authService: AuthService, private httpClient: HttpClient) {
    this.getUserId().subscribe((userId) => {
      this.getUser(userId).subscribe((user) => {
        this.profile.set(user);
      });
    });
  }

  private profile: WritableSignal<User> = signal<User>(new User({}));

  getUserId() {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    return this.httpClient.get<number>(`${environment.apiUrl}/user/get_id`, options).pipe(
      tap((data) => data as number),
      retry(1),
      catchError(this.handleError)
    );
  }

  getUser(userId: number) {
    const options = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + this.authService.getToken(),
      }),
    };

    // parse the response to a User object
    return this.httpClient.get<User>(`${environment.apiUrl}/user/${userId}/get`, options).pipe(
      tap((data) => data as User),
      retry(1),
      catchError(this.handleError)
    );
  }

  getProfile(): WritableSignal<User> {
    return this.profile;
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
