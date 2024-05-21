import { Component } from "@angular/core";
import { ModelComponent } from "../../common/component/model/model.component";

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [ModelComponent],
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.css",
})
export class GalleryComponent {
  modelUrls: string[] = [];
  //modelUrls: string[] = ['assets/models/model1/scene.gltf', 'assets/models/model2/scene.gltf'];
}
