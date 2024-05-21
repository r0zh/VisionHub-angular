import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { ImageService } from "../../common/service/image/image.service";
import { Image } from "../../common/model/image";
import { ModelComponent } from "../../common/component/model/model.component";

@Component({
    selector: "app-community",
    standalone: true,
    templateUrl: "./community.component.html",
    styleUrl: "./community.component.css",
    imports: [ModelComponent]
})
export class CommunityComponent implements OnInit {
  constructor(private authService: AuthService, private imageService: ImageService) {}
  images: Image[] | undefined;

  ngOnInit(): void {
    this.getImages();
  }

  getImages() {
    let images = this.imageService.getAllImages().subscribe((images) => {
      this.images = images;
    });
  }
}
