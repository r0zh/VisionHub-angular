import { ThreeDModelService } from "./../../common/service/image/three_d_model.service";
import { Component } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { HttpClient, HttpClientModule, HttpResponse } from "@angular/common/http";
import { Router, RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { FloatLabelModule } from "primeng/floatlabel";
import { CommonModule } from "@angular/common";
import { AuthResponse } from "../../auth/model/auth-response";
import { AuthService } from "../../auth/services/auth.service";
import { CheckboxModule } from "primeng/checkbox";
import { MessageService } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ModelViewerComponent } from "../../common/component/model-viewer/model-viewer.component";
import { ThreeDModel } from "../../common/model/three_d_model";
import { DialogModule } from "primeng/dialog";
import { InputTextareaModule } from "primeng/inputtextarea";
import JSZip from "jszip";
import { BottomButtonComponent } from "../../common/component/bottom-button/bottom-button.component";

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
  ],
})
export class GeneratorComponent {
  submitted = false;
  generated = false;
  modelPaths: string[] = [];
  visible = false;
  windowWidth: number = 0;

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
  });

  ngOnInit(): void {
    this.generatorForm = this.fb.group({
      prompt: ["", [Validators.required]],
      batchSize: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    this.saveForm = this.fb.group({
      name: ["", []],
      description: ["", [Validators.maxLength(255), Validators.minLength(10)]],
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

    console.log(this.generatorForm.value);
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

        console.log(this.modelPaths);
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
    const { name, description } = this.saveForm.value;
    let formData = new FormData();
    let threeDModel = this.http.get(modelPath, { responseType: "blob" });
    threeDModel.subscribe({
      next: (response) => {
        formData.append("file", response as Blob);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("prompt", this.generatorForm.value.prompt);
        this.threeDModelService.uploadThreeDModel(formData).subscribe({
          next: (response) => {
            this.messageService.add({ severity: "success", summary: "Success", detail: "Model saved successfully." });
          },
        });
      },
    });
  }
}