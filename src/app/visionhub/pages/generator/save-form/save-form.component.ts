import { Component, Input, OnInit, ViewChild, WritableSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ModelViewerComponent } from "../../../common/component/model-viewer/model-viewer.component";
import { ThreeDModelService } from "../../../common/service/three_d_model.service";

@Component({
  selector: "generator-save-form",
  templateUrl: "./save-form.component.html",
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    ProgressSpinnerModule,
    DialogModule,
    InputTextareaModule,
    ToggleButtonModule,
    ModelViewerComponent,
  ],
  standalone: true,
})
export class SaveFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private threeDModelService: ThreeDModelService
  ) {}

  @Input() visible!: WritableSignal<boolean>;
  @Input() modelPath!: WritableSignal<string>;
  @Input() generationData!: WritableSignal<any>;

  @ViewChild("thumbnailViewer") thumbnailViewer!: ModelViewerComponent;

  saveForm: FormGroup = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    isPublic: new FormControl(""),
  });

  ngOnInit() {
    this.saveForm = this.fb.group({
      name: ["", []],
      description: ["", [Validators.maxLength(255), Validators.minLength(10)]],
      isPublic: [false, []],
    });
  }

  onSave() {
    const { name, description, isPublic } = this.saveForm.value;
    let formData = new FormData();
    let threeDModel = this.http.get(this.modelPath(), { responseType: "blob" });
    threeDModel.subscribe({
      next: (response) => {
        formData.append("model", response);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("prompt", this.generationData().prompt);
        formData.append("isPublic", isPublic);

        this.thumbnailViewer.render();
        this.thumbnailViewer.renderer.domElement.toBlob((blob) => {
          formData.append("thumbnail", blob as Blob);
          this.threeDModelService.uploadThreeDModel(formData).subscribe({
            next: () => {
              this.messageService.add({ severity: "success", summary: "Success", detail: "Model saved successfully." });
            },
          });
        });
      },
    });
  }
}
