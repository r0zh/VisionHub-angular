import { Component } from "@angular/core";

@Component({
  selector: "bottom-button",
  templateUrl: "./bottom-button.component.html",
  standalone: true,
})
export class BottomButtonComponent {
  scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}
