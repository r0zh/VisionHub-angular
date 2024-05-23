import { Component } from "@angular/core";
import { ModelComponent } from "../../common/component/model/model.component";
import { AuthService } from "../../auth/services/auth.service";
import { ImageService } from "../../common/service/image/image.service";
import { Image } from "../../common/model/image";

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [ModelComponent],
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.css",
})
export class GalleryComponent {
  constructor(private authService: AuthService, private imageService: ImageService) {}
  images: Image[] | undefined;

  ngOnInit(): void {
    this.getImages();
  }

  getImages() {
    let images = this.imageService.getUserImages().subscribe((images) => {
      this.images = images;
    });
  }
}
