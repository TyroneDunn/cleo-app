import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent {

  public navigateBack() {

  }
}
