import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from "rxjs";
import {Journal} from "../journal.type";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatGridListModule,
    MatListModule
  ],
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  @Input() journals$!: Observable<Journal[]>;
}
