import { ChangeDetectorRef, Component, OnInit, afterNextRender, afterRender } from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { SplitButtonModule } from "primeng/splitbutton";
import { Subscription } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { AuthService } from "../../../auth/services/auth.service";
import { VISIONHUB_PATHES } from "../../../properties/properties";
import { User } from "../../model/user";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MenubarModule, ButtonModule, SplitButtonModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  profileItems: MenuItem[] | undefined;
  loginPath = VISIONHUB_PATHES.LOGIN;
  registerPath = VISIONHUB_PATHES.REGISTER;
  private authSubscription?: Subscription; // To hold the subscription
  private user?: User;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.updateMenuItems(isAuthenticated);
      this.cdr.markForCheck(); // Mark for check after updating menu items
    });
  }

  updateMenuItems(isLoggedIn: boolean) {
    this.items = isLoggedIn
      ? [
        {
          label: "Home",
          icon: "pi pi-home",
          route: VISIONHUB_PATHES.HOME,
        },
        {
          label: "Generator",
          icon: "pi pi-cog",
          route: VISIONHUB_PATHES.GENERATOR,
        },
        {
          label: "Gallery",
          icon: "pi pi-image",
          route: VISIONHUB_PATHES.GALLERY,
        },
        {
          label: "Community",
          icon: "pi pi-star",
          route: VISIONHUB_PATHES.COMMUNITY,
        },
      ]
      : [
        {
          label: "Home",
          icon: "pi pi-home",
          route: VISIONHUB_PATHES.HOME,
        },
      ];

    this.profileItems = isLoggedIn
      ? [
        {
          label: "Profile",
          icon: "pi pi-user",
          command: () => {
            this.navigateToProfile();
          },
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            this.authService.logout();
            this.messageService.add({
              severity: "success",
              detail: "Logged out successfully",
            });
            this.cdr.detectChanges();
          },
        },
      ]
      : [];
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  // send to `${enviroment.webUrl}/profile`
  navigateToProfile() {
    window.open(`${environment.webUrl}/profile`, "_blank");
  }
}
