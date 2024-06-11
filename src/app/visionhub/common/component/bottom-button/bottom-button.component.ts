import { Component, OnInit } from "@angular/core";

@Component({
  selector: "bottom-button",
  templateUrl: "./bottom-button.component.html",
  styleUrls: ["./bottom-button.component.css"],
  standalone: true,
})
export class BottomButtonComponent {
  scrollToBottom() {
    console.log("Scrolling to bottom");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}