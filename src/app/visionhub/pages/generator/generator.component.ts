import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { FloatLabelModule } from "primeng/floatlabel";
import { CommonModule } from "@angular/common";
import { AuthResponse } from "../../auth/model/auth-response";
import { AuthService } from "../../auth/services/auth.service";
import { CheckboxModule } from "primeng/checkbox";
import { MessageService } from "primeng/api";


@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule,
    HttpClientModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    CheckboxModule,
    FormsModule,],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.css'
})
export class GeneratorComponent {
  submitted = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  generatorForm: FormGroup = new FormGroup({
    prompt: new FormControl(""),
  });

  ngOnInit(): void {
    this.generatorForm = this.fb.group({
      prompt: ["", [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.generatorForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.generatorForm.invalid) {
      return;
    }

    console.log(this.generatorForm.value);
    const { prompt } = this.generatorForm.value;

    this.http.post(`${environment.apiUrl}/generate`, { prompt }).subscribe({
      next: (response) => {
        console.log(response);
        let response2 = response as AuthResponse;
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
