import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { NavbarComponent } from "./visionhub/common/component/navbar/navbar.component";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ButtonModule, NavbarComponent, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "visionhub";
}
