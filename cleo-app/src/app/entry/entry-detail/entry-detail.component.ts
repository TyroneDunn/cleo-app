import {Component, inject} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {Entry} from "../entry.type";
import {EntryHttpService} from "../entry-http.service";
import {MatInputModule} from "@angular/material/input";
import {DeleteEntryComponent}
  from "../delete-entry/delete-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {QuillEditorComponent} from "ngx-quill";
import {FormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

type Mode = 'normal' | 'edit';

@Component({
  selector: 'app-entry-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    MatInputModule,
    MatCardModule,
    QuillEditorComponent,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.scss']
})
export class EntryDetailComponent {
  private location = inject(Location);
  private entryService = inject(EntryHttpService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public mode$ = new BehaviorSubject<Mode>("normal");
  public journalEntry$ = new BehaviorSubject<Entry | undefined>(undefined);
  private journalId$ = new BehaviorSubject<string>('');
  private entryId$ = new BehaviorSubject<string>('');

  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.entryId$.next(params.get('id') as string);
      this.fetchEntry();
    })
  }

  private fetchEntry() {
    this.entryService.journalEntry$(this.journalId$.value, this.entryId$.value)
      .subscribe((journalEntry) => {
        if (!journalEntry) return;
        this.journalEntry$.next(journalEntry);
      })
  }

  private updateEntry(body: string, title: string) {
    if (this.journalEntry$.value) {
      let entry = this.journalEntry$.value;
      entry.body = body;
      entry.title = title;
      this.journalEntry$.next(entry);
    }
  }

  public navigateBack() {
    this.location.back();
  }

  private enterNormalMode() {
    this.mode$.next("normal");
  }

  public enterEditMode() {
    this.mode$.next("edit");
  }

  public cancelEditing() {
    this.mode$.next("normal");
  }

  public doneEditing() {
    if (!this.journalEntry$.value)
      return;

    const body = this.journalEntry$.value?.body as string;
    const title = this.journalEntry$.value?.title as string;

    if (!title) {
      this.notify('Please enter a title.');
      return;
    }

    this.entryService.patchJournalEntry$(this.journalId$.value, this.entryId$.value, body, title)
      .subscribe((success) => {
        if (!success) return;
        this.updateEntry(body, title);
        this.notify('Entry updated.')
        this.enterNormalMode();
      });
  }

  public deleteEntry() {
    const config = {
      data: {journalEntry: this.journalEntry$.value}
    }
    const dialogRef = this.dialog.open(DeleteEntryComponent, config);
    dialogRef.afterClosed().subscribe((confirm) => {
      if (!confirm) return;

      if (this.journalEntry$.value) {
        this.entryService.deleteJournalEntry$(this.journalEntry$.value._id)
          .subscribe((success) => {
            if (success) {
              this.notify('Entry deleted.')
              this.navigateBack();
            }
          });
      }
    });
  }

  private notify(message: string): void {
    this.snackBar.open(message, '×', {
      duration: 3000,
      horizontalPosition: "left",
      verticalPosition: "bottom",
    });
  }
  public ngOnDestroy() {
    this.mode$.unsubscribe();
  }
}
