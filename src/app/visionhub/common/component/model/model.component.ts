import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Image } from "../../model/image";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-model",
  standalone: true,
  imports: [CardModule],
  templateUrl: "./model.component.html",
  styleUrl: "./model.component.css",
})
export class ModelComponent {
  @Input() modelObject: Image | undefined;
}
