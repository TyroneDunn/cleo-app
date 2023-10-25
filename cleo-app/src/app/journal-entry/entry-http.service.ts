import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {Entry} from "./entry.type";
import {HttpService} from "../http/http.service";
import {CLEO_API_JOURNAL_ENTRIES_URL} from "./journal-entry.constants";
import {GetEntriesResponseDTO} from './entry-dtos';

@Injectable({
  providedIn: 'root'
})
export class EntryHttpService {
  private http = inject(HttpService);

  public journalEntries$(journalId: string): Observable<GetEntriesResponseDTO> {
    const url = new URL(CLEO_API_JOURNAL_ENTRIES_URL);
    url.searchParams.append('journal', journalId);
    return this.http.getRequest$<GetEntriesResponseDTO>(url.toString()).pipe(
      map((response) => {
        return response.body as GetEntriesResponseDTO;
      })
    );
  }

  public journalEntry$(journalId: string, entryId: string): Observable<Entry | undefined> {
    return this.http.getRequest$<Entry>(`${CLEO_API_JOURNAL_ENTRIES_URL}${entryId}`).pipe(
      map((response) => {
        return response.body as Entry;
      }),
      catchError(() => {
        return of(undefined);
      }),
    )
  }

  public createJournalEntry$(journalId: string, content: string): Observable<Entry | undefined> {
    const payload = {content: content};
    return this.http.postRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}${journalId}`, payload).pipe(
      map((response) => {
        return response.body as Entry;
      }),
      catchError(() => {
        return of(undefined);
      }),
    );
  }

  public deleteJournalEntry$(journalId: string, entryId: string): Observable<boolean> {
    return this.http.deleteRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}${entryId}`)
      .pipe(
        map((response) => {
          return response.ok;
        }),
        catchError(() => {
          return of(false);
        }),
      );
  }

  public patchJournalEntry$(journalId: string, entryId: string, body: string): Observable<boolean> {
    const payload = {body: body};
    return this.http.patchRequest$<object>(`${CLEO_API_JOURNAL_ENTRIES_URL}${entryId}`, payload).pipe(
      map((response) => {
        return response.ok;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
