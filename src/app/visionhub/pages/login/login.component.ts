import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, NgModule, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { AuthResponse } from "../../auth/model/auth-response";
import { AuthService } from "../../auth/services/auth.service";
import { CheckboxModule } from "primeng/checkbox";
import { MessageService } from "primeng/api";

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
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
  submitted = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
    rememberMe: new FormControl(""),
  });

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: ["false"],
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

    const { email, password, rememberMe } = this.loginForm.value;

    this.http.post(`${environment.apiUrl}/auth/login`, { email, password }).subscribe({
      next: (response) => {
        console.log(response);
        let response2 = response as AuthResponse;
        this.authService.login(response2.token, rememberMe);
        this.messageService.add({ severity: "success", detail: "Logged in successfully" });
        this.router.navigate(["/gallery"]);
      },
      error: (error) => {
        if (error.status == 401) {
          this.messageService.add({ severity: "error", summary: "Error", detail: "Invalid email or password" });
        } else {
          this.messageService.add({ severity: "error", summary: "Error", detail: "An error occurred. Please try again later." });
        }
        console.log("Error occurred: ", error);
      },
      complete: () => console.log("Login request completed"),
    });
  }
}
