import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  public journalEntries$(journalId: string): Observable<JournalEntry> {

  }
}
