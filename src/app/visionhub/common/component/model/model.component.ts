import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, model } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Image } from "../../model/image";
import { CardModule } from "primeng/card";
import { environment } from "../../../../../environments/environment";
import { ImageService } from "../../service/image/image.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: "app-model",
  standalone: true,
  imports: [CardModule, ProgressSpinnerModule],
  templateUrl: "./model.component.html",
  styleUrl: "./model.component.css",
})
export class ModelComponent implements AfterViewInit {
  @Input() modelObject: Image | undefined;
  @ViewChild("lazyImage") lazyImage!: ElementRef<HTMLImageElement>;
  sourceLoaded = false;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    const reader = new FileReader();
    if (this.modelObject) {
      this.imageService.getImage(this.modelObject.id).subscribe((imageBlob) => {
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
          this.lazyImage.nativeElement.src = reader.result as string;
          this.sourceLoaded = true;
        };
      });
    }
  }
}
