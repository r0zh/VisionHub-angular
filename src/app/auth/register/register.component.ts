import { Component } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../environments/environment";
import { FormsModule } from "@angular/forms";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
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
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  form: FormGroup = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
  });

  submitted = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
    let formValue = this.form.value;
    const formData = new FormData();
    formData.append("name", formValue.name!);
    formData.append("email", formValue.email!);
    formData.append("password", formValue.password!);

    this.http.post(`${environment.apiUrl}/auth/register`, formData).subscribe({
      next: (response) => {
        console.log(response);
        let response2 = response as AuthResponse;
        this.authService.saveToken(response2.token);
        alert("Registered successfuly. Token: " + response2.token);
        this.router.navigate(["/home"]);
      },
      error: (error) => {
        console.log(error);
        alert("Invalid credentials");
      },
      complete: () => console.log("Login request completed"),
    });
  }
}
