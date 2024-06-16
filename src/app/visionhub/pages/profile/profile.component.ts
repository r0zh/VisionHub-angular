import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ThreeDModel } from "../../common/model/three_d_model";
import { ThreeDModelService } from "../../common/service/three_d_model.service";
import { ModelComponent } from "../../common/component/model/model.component";
import { User } from "../../common/model/user";
import { UserService } from "../../common/service/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [ModelComponent],
})
export class ProfileComponent implements OnInit {
  id!: number;
  models!: ThreeDModel[];
  profile!: User;

  constructor(private route: ActivatedRoute, private userService: UserService, private threeDModelService: ThreeDModelService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = parseInt(params.get("id")!);
    });
    this.userService.getProfile(this.id).subscribe((profile) => {
      this.profile = profile;
    });
    this.getModels(this.id);
  }

  getModels(id: number) {
    this.threeDModelService.getUserThreeDModels(id).subscribe((models) => {
      this.models = models;
    });
  }
}
