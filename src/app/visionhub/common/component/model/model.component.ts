import { Component, ViewChild, ElementRef, Input, AfterViewInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ThreeDModel } from "../../model/three_d_model";
import { ThreeDModelService } from "../../service/three_d_model.service";
import { PanelModule } from "primeng/panel";
import { ModelViewerComponent } from "../model-viewer/model-viewer.component";
import { DialogModule } from "primeng/dialog";
import { UserService } from "../../service/user.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-model",
  standalone: true,
  imports: [ProgressSpinnerModule, PanelModule, ModelViewerComponent, DialogModule, RouterLink],
  templateUrl: "./model.component.html",
  styleUrl: "./model.component.css",
})
export class ModelComponent implements AfterViewInit {
  @Input() modelObject!: ThreeDModel;
  @ViewChild("lazyImage") lazyImage!: ElementRef<HTMLImageElement>;

  creator = "";

  sourceLoaded = false;
  modelPath = "";
  modalOpen = false;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  constructor(private threeDModelService: ThreeDModelService, private sanitizer: DomSanitizer, private userService: UserService) {}

  ngAfterViewInit(): void {
    const reader = new FileReader();
    if (this.modelObject) {
      this.threeDModelService.getThreeDModelThumbnail(this.modelObject.id).subscribe((imageBlob) => {
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
          this.lazyImage.nativeElement.src = reader.result as string;
          this.lazyImage.nativeElement.classList.add("loaded");
          this.sourceLoaded = true;
        };
      });
    }
    this.userService.getProfile(this.modelObject.user_id).subscribe((profile) => {
      this.creator = profile.name;
    });
  }

  viewModel() {
    this.threeDModelService.getThreeDModel(this.modelObject.id).subscribe((model) => {
      this.modelPath = URL.createObjectURL(model);
      this.modalOpen = true;
    });
  }

  createdAgo(fullDate: string) {
    let date = new Date(fullDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      return `${diffDays} days ago`;
    } else {
      return "Today";
    }
  }
}
