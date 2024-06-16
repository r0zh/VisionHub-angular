import { Injectable, WritableSignal } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { User } from "../model/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  private profile!: WritableSignal<User>;

  getCurrentProfile(): WritableSignal<User> {
    return this.profile;
  }

  public getProfile(user_id: number) {
    return this.http.get<User>(`${environment.apiUrl}/user/${user_id}/get`, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
    });
  }

  setProfile(user: User) {
    this.profile.set(user);
  }
}
