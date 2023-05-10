import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {HttpService} from "../http/http.service";

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  private http = inject(HttpService);
  public journalEntries$(journalId: string): Observable<JournalEntry> {

  }
}
