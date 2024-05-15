import { Component, OnInit } from "@angular/core";
import { MenubarModule } from "primeng/menubar";
import { MenuItem } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { AuthService } from "../auth/auth.service";
import { SplitButtonModule } from "primeng/splitbutton";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MenubarModule, ButtonModule, SplitButtonModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}
  items: MenuItem[] | undefined;
  profileItems: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: "Home",
        icon: "pi pi-home",
        route: "/home",
      },
      {
        label: "Gallery",
        icon: "pi pi-image",
        route: "/gallery",
      },
      {
        label: "Community",
        icon: "pi pi-star",
        route: "/community",
      },
    ];

    this.profileItems = [
      {
        label: "Profile",
        icon: "pi pi-user",
        route: "/user/profile",
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: () => {
          this.authService.logout();
        },
      },
    ];
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}
