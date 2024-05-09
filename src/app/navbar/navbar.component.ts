import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/home'
      },
      {
        label: 'Gallery',
        icon: 'pi pi-image',
        route: '/gallery'
      },
      {
        label: 'Community',
        icon: 'pi pi-star',
        route: '/community'
      }
    ]
  }

}
