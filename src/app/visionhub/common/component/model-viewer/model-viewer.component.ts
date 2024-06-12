import { Component, ElementRef, Input, OnInit, ViewChild, afterNextRender, afterRender } from "@angular/core";
import { ButtonModule } from "primeng/button";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { objectPosition } from "three/examples/jsm/nodes/Nodes";

@Component({
  selector: "model-viewer",
  standalone: true,
  imports: [ButtonModule],
  templateUrl: "./model-viewer.component.html",
  styleUrl: "./model-viewer.component.css",
})
export class ModelViewerComponent {
  @ViewChild("rendererContainer", { static: true }) rendererContainer!: ElementRef;

  @Input() modelPath!: string;
  @Input() height!: number;
  @Input() width!: number;
  @Input() takeScreenshotButton!: boolean;

  constructor() {
    afterNextRender(() => {
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.loadModel();
      this.loadScenary();
      this.loadLight();
      this.render();
    });
  }

  ngOnInit(): void {
    if (!this.width) this.width = window.innerWidth / 3;
    if (!this.height) this.height = window.innerHeight / 3;
  }

  renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 1;
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private loadModel() {
    const loader = new OBJLoader();
    loader.load(this.modelPath, (object) => {
      let scale = 0.0005 * this.width;
      object.scale.set(scale, scale, scale);
      object.rotateX(-Math.PI / 2);
      this.scene.add(object);

      // Object material
      object.traverse((node) => {
        if ((node as THREE.Mesh).material) {
          const meshNode = node as THREE.Mesh;
          if (meshNode.material instanceof THREE.MeshBasicMaterial) {
            meshNode.material.vertexColors = true;
          }
        }
      });
    });
  }

  private loadScenary() {
    const background = new THREE.Color(0xdddddd);
    this.scene.background = background;
  }

  private loadLight() {
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  takeScreenshot() {
    this.renderer.render(this.scene, this.camera);
    const imgData = this.renderer.domElement.toBlob((blob) => {
      console.log(this.renderer.domElement);
      const link = document.createElement("a");
      link.download = "model.obj";
      if (blob) link.href = URL.createObjectURL(blob);
      link.click();
      link.remove();
    });
  }
}
