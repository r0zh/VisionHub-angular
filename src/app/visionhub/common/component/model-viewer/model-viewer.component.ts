import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  imports: [],
  template: '<div #rendererContainer></div>',
  styleUrl: './model-viewer.component.css'
})
export class ModelViewerComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  ngOnInit() {
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initControls();
    this.loadModel();
    this.render();
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private initScene() {
    this.scene = new THREE.Scene();
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  private loadModel() {
    const loader = new OBJLoader();
    loader.load('assets/model.obj', (object) => {
      this.scene.add(object);
    });
  }

  private render() {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}