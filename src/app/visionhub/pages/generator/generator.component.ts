import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import JSZip from "jszip";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { PasswordModule } from "primeng/password";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ToggleButtonModule } from "primeng/togglebutton";
import { environment } from "../../../../environments/environment";
import { BottomButtonComponent } from "../../common/component/bottom-button/bottom-button.component";
import { ModelViewerComponent } from "../../common/component/model-viewer/model-viewer.component";
import { ThreeDModelService } from "./../../common/service/image/three_d_model.service";

@Component({
  selector: "app-generator",
  standalone: true,
  templateUrl: "./generator.component.html",
  styleUrl: "./generator.component.css",
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    HttpClientModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    ProgressSpinnerModule,
    ModelViewerComponent,
    DialogModule,
    InputTextareaModule,
    BottomButtonComponent,
    ToggleButtonModule,
  ],
})
export class GeneratorComponent {
  submitted = false;
  generated = false;
  modelPaths: string[] = [];
  visible = false;
  windowWidth: number = 0;

  @ViewChild("thumbnailViewer") thumbnailViewer!: ModelViewerComponent;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private threeDModelService: ThreeDModelService
  ) {}

  generatorForm: FormGroup = new FormGroup({
    prompt: new FormControl(""),
    batchSize: new FormControl(""),
  });

  saveForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    isPublic: new FormControl(""),
  });

  ngOnInit(): void {
    this.generatorForm = this.fb.group({
      prompt: ["", [Validators.required]],
      batchSize: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    this.saveForm = this.fb.group({
      name: ["", []],
      description: ["", [Validators.maxLength(255), Validators.minLength(10)]],
      isPublic: [false, []],
    });

    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 320 * 3) {
      this.windowWidth = 320 * 3;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.generatorForm.invalid) {
      return;
    }

    if (this.modelPaths.length > 0) {
      for (const modelPath of this.modelPaths) {
        URL.revokeObjectURL(modelPath);
      }
      this.modelPaths = [];
    }

    const { prompt, batchSize } = this.generatorForm.value;

    this.http.post(`${environment.flaskUrl}/generate`, { prompt, batchSize }, { responseType: "blob" }).subscribe({
      next: (response) => {
        const zip = new JSZip();
        zip.loadAsync(response).then(async () => {
          const entries = Object.values(zip.files);
          for (const entry of entries) {
            if (entry.name.endsWith(".obj")) {
              const objBlob = await entry.async("blob");
              const objUrl = URL.createObjectURL(objBlob);
              this.modelPaths.push(objUrl);
            }
          }
        });

        this.submitted = false;
        this.generated = true;
        this.messageService.add({ severity: "success", summary: "Success", detail: "Model generated successfully." });
      },
      error: (error) => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Service unavailable. Please try again later." });
        console.log("Error occurred: ", error);
      },
      complete: () => console.log("Request completed"),
    });
  }

  onSave(modelPath: string) {
    const { name, description, isPublic } = this.saveForm.value;
    let formData = new FormData();
    let threeDModel = this.http.get(modelPath, { responseType: "blob" });
    threeDModel.subscribe({
      next: (response) => {
        formData.append("model", response as Blob);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("prompt", this.generatorForm.value.prompt);
        formData.append("isPublic", isPublic);

        this.thumbnailViewer.render();
        this.thumbnailViewer.renderer.domElement.toBlob((blob) => {
          formData.append("thumbnail", blob as Blob);
          this.threeDModelService.uploadThreeDModel(formData).subscribe({
            next: (response) => {
              this.messageService.add({ severity: "success", summary: "Success", detail: "Model saved successfully." });
            },
          });
        });
      },
    });
  }
}
