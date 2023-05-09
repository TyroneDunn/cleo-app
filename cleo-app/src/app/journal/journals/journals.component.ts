import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable} from "rxjs";
import {Journal} from "../journal.type";

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent {
  @Input() journals$!: Observable<Journal[]>;
}
