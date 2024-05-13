import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = "";
  password: string = "";
  name: string = "";
  passwordConfirmation: string = "";
  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    //formData.append('password_confirmation', this.passwordConfirmation);

    this.http.post(`${environment.apiUrl}/auth/register`, formData)
      .subscribe(
        response => console.log(response),
        error => console.log(error)
      );
  }
}
