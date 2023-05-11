import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {JournalEntry} from "../journal-entry.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JournalEntryService} from "../journal-entry.service";

type Mode = 'normal' | 'edit';

@Component({
  selector: 'app-journal-entry-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './journal-entry-detail.component.html',
  styleUrls: ['./journal-entry-detail.component.scss']
})
export class JournalEntryDetailComponent {
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private journalEntryService = inject(JournalEntryService);
  public mode$ = new BehaviorSubject<Mode>("normal");
  public journalEntry$ = new BehaviorSubject<JournalEntry | undefined>(undefined);
  public entryForm: FormGroup = this.formBuilder.group({body: ['', Validators.required]});

  public navigateBack() {
    this.location.back();
  }

  public enterEditMode() {
    this.mode$.next("edit");
  }

  public deleteJournalEntry() {

  }

  public cancelEditing() {
    this.mode$.next("normal");
  }

  public doneEditing() {

  }

  public ngOnDestroy() {
    this.mode$.unsubscribe();
  }
}
