import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../environments/environment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { AuthResponse } from "../../models/auth-response";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  submitted = false;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder, private authService: AuthService) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    console.log(this.loginForm.value);
    const { email, password } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (response) => {
        console.log(response);
        let response2 = response as AuthResponse;
        this.authService.saveToken(response2.token);
        alert("Login successful. Token: " + response2.token);
        this.router.navigate(["/gallery"]);
      },
      error: (error) => {
        if (error.status == 401) {
          alert("Invalid credentials");
        } else {
          alert("An error occurred. Please try again later.");
        }
        console.log("Error occurred: ", error);
      },
      complete: () => console.log("Login request completed"),
    });
  }
}
