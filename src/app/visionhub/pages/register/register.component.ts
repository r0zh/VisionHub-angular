import { Component } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../auth/services/auth.service";

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
})
export class RegisterComponent {
  submitted = false;
  rememberMe = false;

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

    const { name, email, password } = this.registerForm.value;
    this.authService.register(name, email, password);
  }
}
