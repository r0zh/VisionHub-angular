import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  WritableSignal,
  afterNextRender,
  afterRender,
} from "@angular/core";
import { MenuItem, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { SplitButtonModule } from "primeng/splitbutton";
import { Subscription } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { AuthService } from "../../../auth/services/auth.service";
import { VISIONHUB_PATHES } from "../../../properties/properties";
import { User } from "../../model/user";
import { isPlatformBrowser } from "@angular/common";

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
  profile: User | undefined;
  isAuthenticated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
      if (!isAuthenticated) {
        this.profile = undefined;
      }
      this.updateMenuItems(isAuthenticated);
      this.cdr.detectChanges();
    });
  }

  updateMenuItems(isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.items = [
        {
          label: "Home",
          icon: "pi pi-home",
          route: VISIONHUB_PATHES.HOME,
        },
        {
          label: "Community",
          icon: "pi pi-star",
          route: VISIONHUB_PATHES.COMMUNITY,
        },
      ];
      this.profileItems = [];
      return;
    } else {
      this.authService.getCurrentUser().subscribe((user: User) => {
        this.profile = user;
        this.items = [
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
        ];

        this.profileItems = [
          {
            label: user.name,
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
        ];
      });
    }
  }

  // send to `${enviroment.webUrl}/profile`
  navigateToProfile() {
    window.open(`${environment.webUrl}/profile`, "_blank");
  }
}
