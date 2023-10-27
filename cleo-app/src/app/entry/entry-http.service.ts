import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {Entry} from "./entry.type";
import {HttpService} from "../http/http.service";
import {CLEO_API_JOURNAL_ENTRIES_URL} from "./journal-entry.constants";
import {CreateEntryDTO, GetEntriesDTO, GetEntriesResponseDTO} from './entry-dtos';

@Injectable({
  providedIn: 'root'
})
export class EntryHttpService {
  private http = inject(HttpService);

  public journalEntries$(dto: GetEntriesDTO): Observable<GetEntriesResponseDTO> {
    const url: string = this.mapToGetEntriesURL(dto);
    return this.http.getRequest$<GetEntriesResponseDTO>(url).pipe(
      map((response) => {
        return response.body as GetEntriesResponseDTO;
      })
    );
  }

  private mapToGetEntriesURL(dto: GetEntriesDTO): string {
    const url = new URL(CLEO_API_JOURNAL_ENTRIES_URL);
    url.searchParams.append('journal', dto.journal);
    if (dto.bodyRegex !== undefined)
      url.searchParams.append('bodyRegex', dto.bodyRegex);
    if (dto.startDate)
      url.searchParams.append('startDate', dto.startDate.toString());
    if (dto.endDate)
      url.searchParams.append('endDate', dto.endDate.toString());
    if (dto.sort)
      url.searchParams.append('sort', dto.sort);
    if (dto.order !== undefined)
      url.searchParams.append('order', dto.order.toString());
    if (dto.page !== undefined)
      url.searchParams.append('page', dto.page.toString());
    if (dto.limit !== undefined)
      url.searchParams.append('limit', dto.limit.toString());
    return url.toString();
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

  public createJournalEntry$(dto: CreateEntryDTO): Observable<Entry | undefined> {
    const payload = {body: dto.body};
    return this.http.postRequest$(`${CLEO_API_JOURNAL_ENTRIES_URL}${dto.journal}`, payload).pipe(
      map((response) => {
        return response.body as Entry;
      }),
      catchError(() => {
        return of(undefined);
      }),
    );
  }

  public deleteJournalEntry$(entryId: string): Observable<boolean> {
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
