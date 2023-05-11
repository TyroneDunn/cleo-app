import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {JournalEntry} from "./journal-entry.type";
import {HttpService} from "../http/http.service";
import {CLEO_API_JOURNAL_ENTRIES_URL} from "./journal-entry.constants";

@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  private http = inject(HttpService);
  public journalEntries$(journalId: string): Observable<JournalEntry[]> {
    return this.http.getRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}/${journalId}`).pipe(
      map((response) => {
        return response.body as JournalEntry[];
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }

  public journalEntry$(journalId: string, entryId: string): Observable<JournalEntry | undefined> {
    return this.http.getRequest$<JournalEntry>(`${CLEO_API_JOURNAL_ENTRIES_URL}${journalId}/${entryId}`).pipe(
      map((response) => {
        return response.body as JournalEntry;
      }),
      catchError(() => {
        return of(undefined);
      }),
    )
  }

  public createJournalEntry$(journalId: string, content: string): Observable<JournalEntry | undefined> {
    const payload = {content: content};
    return this.http.postRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}/${journalId}`, payload).pipe(
      map((response) => {
        return response.body as JournalEntry;
      }),
      catchError(() => {
        return of(undefined);
      }),
    );
  }

  public deleteJournalEntry$(journalId: string, entryId: string): Observable<boolean> {
    return this.http.deleteRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}/${journalId}/${entryId}`)
      .pipe(
        map((response) => {
          return response.ok;
        }),
        catchError(() => {
          return of(false);
        }),
      )
  }
}
