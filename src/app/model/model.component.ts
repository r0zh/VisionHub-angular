import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  template: `<div #rendererContainer></div>`,
  styleUrl: './model.component.css'
})
export class ModelComponent implements OnInit {
  @ViewChild('rendererContainer')
  rendererContainer!: ElementRef;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private loader: GLTFLoader;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.loader = new GLTFLoader();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  ngOnInit(): void {
    this.loadModels(['assets/models/model1/scene.gltf', 'assets/models/model2/scene.gltf']);
  }

  private async loadModels(modelUrls: string[]): Promise<void> {
    await Promise.all(modelUrls.map(url => this.loadModel(url)));
  }

  private async loadModel(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loader.load(url, (gltf) => {
        gltf.scene.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
        this.scene.add(gltf.scene);
        this.camera.position.z = 5; // Position the camera
        this.render();
        resolve();
      }, undefined, reject);
    });
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
