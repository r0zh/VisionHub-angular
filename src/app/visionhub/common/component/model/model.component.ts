import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, model } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Image } from "../../model/image";
import { environment } from "../../../../../environments/environment";
import { ImageService } from "../../service/image/image.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ThreeDModel } from "../../model/three_d_model";
import { ThreeDModelService } from "../../service/image/three_d_model.service";
import { PanelModule } from "primeng/panel";
import { ModelViewerComponent } from "../model-viewer/model-viewer.component";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-model",
  standalone: true,
  imports: [ProgressSpinnerModule, PanelModule, ModelViewerComponent, DialogModule],
  templateUrl: "./model.component.html",
  styleUrl: "./model.component.css",
})
export class ModelComponent implements AfterViewInit {
  @Input() modelObject: ThreeDModel | undefined;
  @ViewChild("lazyImage") lazyImage!: ElementRef<HTMLImageElement>;
  sourceLoaded = false;
  modelPath = "";

  modalOpen = false;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  constructor(private threeDModelService: ThreeDModelService, private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    const reader = new FileReader();
    if (this.modelObject) {
      console.log(this.modelObject);
      this.threeDModelService.getThreeDModelThumbnail(this.modelObject.id).subscribe((imageBlob) => {
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
          this.lazyImage.nativeElement.src = reader.result as string;
          this.lazyImage.nativeElement.classList.add("loaded");
          this.sourceLoaded = true;
        };
      });
    }
  }

  viewModel() {
    console.log(this.modelObject);
    this.threeDModelService.getThreeDModel(this.modelObject!.id).subscribe((model) => {
      this.modelPath = URL.createObjectURL(model);
      this.modalOpen = true;
    });
  }

  // display gif of model on hover
  displayGif() {
    if (this.modelObject) {
      return this.sanitizer.bypassSecurityTrustUrl(`${environment.apiUrl}/images/${this.modelObject.id}/gif`);
    } else {
      return "";
    }
  }
}
