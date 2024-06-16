import { Component, OnInit } from "@angular/core";
import { ModelComponent } from "../../common/component/model/model.component";
import { ThreeDModelService } from "../../common/service/three_d_model.service";
import { ThreeDModel } from "../../common/model/three_d_model";

@Component({
  selector: "app-community",
  standalone: true,
  templateUrl: "./community.component.html",
  imports: [ModelComponent],
})
export class CommunityComponent implements OnInit {
  constructor(private threeDModelService: ThreeDModelService) {}
  models: ThreeDModel[] | undefined;

  ngOnInit(): void {
    this.getModels();
  }

  getModels() {
    this.threeDModelService.getPublicModels().subscribe((models) => {
      this.models = models;
    });
  }
}
