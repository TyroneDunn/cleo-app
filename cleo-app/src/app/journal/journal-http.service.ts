import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {map, Observable} from "rxjs";
import {Journal} from "./journal.type";
import {CLEO_API_JOURNALS_URL} from "./journal.constants";
import {CreateJournalDTO, GetJournalsDTO, UpdateJournalDTO} from "./journal-dtos";
import {JournalService} from "./journal.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class JournalHttpService implements JournalService {
  private http = inject(HttpService);
  private userService = inject(UserService);

  public getJournals$ = (dto: GetJournalsDTO): Observable<Journal[]> => {
    const url = this.mapToGetJournalsURL(dto);
    return this.http.getRequest$<Journal[]>(url).pipe(
      map((response) => {
        return response.body as Journal[];
      })
    );
  };

  public getJournal$ = (id: string): Observable<Journal | null> =>
    this.http.getRequest$<Journal | null>(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public createJournal$ = (dto: CreateJournalDTO): Observable<Journal> => {
    const payload = {
      ... dto.name && {name: dto.name}
    };

    return this.http.postRequest$(CLEO_API_JOURNALS_URL, payload).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );
  };

  public deleteJournal$ = (id: string): Observable<Journal> =>
    this.http.deleteRequest$(`${CLEO_API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public updateJournal$(dto: UpdateJournalDTO): Observable<Journal> {
    const payload = {
      ... dto.name && {name: dto.name}
    };

    return this.http.patchRequest$<object>(`${CLEO_API_JOURNALS_URL}${dto.id}`, payload).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );
  };

  private mapToGetJournalsURL = (dto: GetJournalsDTO): string => {
    const url = new URL(CLEO_API_JOURNALS_URL);
    url.searchParams.append('author', this.userService.user.username);
    if (dto.name)
      url.searchParams.append('name', dto.name);
    if (dto.nameRegex)
      url.searchParams.append('nameRegex', dto.nameRegex);
    else
      url.searchParams.append('nameRegex','');
    if (dto.sort)
      url.searchParams.append('sort', dto.sort);
    if (dto.order)
      url.searchParams.append('order', dto.order.toString());
    if (dto.page)
      url.searchParams.append('page', dto.page.toString());
    if (dto.limit)
      url.searchParams.append('limit', dto.limit.toString());
    if (dto.startDate)
      url.searchParams.append('startDate', dto.startDate.toString());
    if (dto.endDate)
      url.searchParams.append('endDate', dto.endDate.toString());
    return url.href;
  };
}
