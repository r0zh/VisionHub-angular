import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, PasswordModule, ButtonModule, FloatLabelModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.http.post(`${environment.apiUrl}/auth/login`, formData)
      .subscribe({
        next: response => console.log(response),
        error: error => console.log(error),
        complete: () => console.log('Login request completed')
      });
    this.router.navigate(['/gallery']);
  }
}
