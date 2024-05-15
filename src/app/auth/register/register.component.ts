import { Component } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../environments/environment";
import { FormsModule } from "@angular/forms";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { AuthResponse } from "../../models/auth-response";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  submitted = false;

  constructor(private http: HttpClient, private router: Router, private fb: FormBuilder, private authService: AuthService) {}

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
  });

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value);
    const { name, email, password } = this.registerForm.value;
    this.http.post(`${environment.apiUrl}/auth/register`, { name, email, password }).subscribe({
      next: (response) => {
        let authResponse = response as AuthResponse;
        this.authService.saveToken(authResponse.token);
        alert("Registered successfuly. Token: " + authResponse.token);
        this.router.navigate(["/home"]);
      },
      error: (error) => {
        if (error.status == 401) {
          alert(error.error.errors.email[0]);
        } else {
          alert("An error occurred. Please try again later.");
        }
        console.log("Error occurred: ", error);
      },
      complete: () => console.log("Login request completed"),
    });
  }
}
