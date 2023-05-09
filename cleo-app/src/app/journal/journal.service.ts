import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {catchError, map, Observable, of} from "rxjs";
import {Journal} from "./journal.type";
import {CLEO_API_JOURNALS_URL} from "./journal.constants";

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private http = inject(HttpService);

  public journals$(): Observable<Journal[]> {
    return this.http.getRequest$<Journal[]>(CLEO_API_JOURNALS_URL).pipe(
      map((response) => {
        return response.body as Journal[];
      }),
      catchError(() => {
        return of([]);
      }),
    );
  };
}
