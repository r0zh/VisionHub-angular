import { ModelViewerComponent } from "./../../common/component/model-viewer/model-viewer.component";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ModelComponent } from "../../common/component/model/model.component";
import { AuthService } from "../../auth/services/auth.service";
import { ThreeDModelService } from "../../common/service/three_d_model.service";
import { ThreeDModel } from "../../common/model/three_d_model";

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [ModelComponent, ModelViewerComponent],
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.css",
})
export class GalleryComponent implements OnInit {
  constructor(private authService: AuthService, private threeDModelService: ThreeDModelService) {}
  models: ThreeDModel[] | undefined;

  ngOnInit(): void {
    this.getModels();
  }

  getModels() {
    this.threeDModelService.getUserThreeDModels().subscribe((models) => {
      this.models = models;
    });
  }
}
