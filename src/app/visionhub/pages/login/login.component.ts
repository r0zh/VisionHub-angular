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

    console.log(this.loginForm.value);

    const { email, password, rememberMe } = this.loginForm.value;
    this.authService.login(email, password, rememberMe);
    this.router.navigate(["/gallery"]);
  }
}
