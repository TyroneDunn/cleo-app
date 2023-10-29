import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";
import {map, Observable} from "rxjs";
import {Journal} from "./journal.type";
import {
  CreateJournalDTO,
  GetJournalsDTO,
  GetJournalsResponseDTO,
  UpdateJournalDTO
} from "./journal-dtos";
import {JournalService} from "./journal.service";
import {UserService} from "../user/user.service";
import {API_JOURNALS_URL} from "../../environments/constants";

@Injectable({
  providedIn: 'root'
})
export class JournalHttpService implements JournalService {
  private http = inject(HttpService);
  private userService = inject(UserService);

  public getJournals$ = (dto: GetJournalsDTO): Observable<GetJournalsResponseDTO> => {
    const url = this.mapToGetJournalsURL(dto);
    return this.http.getRequest$<GetJournalsResponseDTO>(url).pipe(
      map((response) => {
        return response.body as GetJournalsResponseDTO;
      })
    );
  };

  public getJournal$ = (id: string): Observable<Journal | null> =>
    this.http.getRequest$<Journal | null>(`${API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public createJournal$ = (dto: CreateJournalDTO): Observable<Journal> => {
    const payload = {
      ... dto.name && {name: dto.name}
    };

    return this.http.postRequest$(API_JOURNALS_URL, payload).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );
  };

  public deleteJournal$ = (id: string): Observable<Journal> =>
    this.http.deleteRequest$(`${API_JOURNALS_URL}/${id}`).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );

  public updateJournal$(dto: UpdateJournalDTO): Observable<Journal> {
    const payload = {
      ... dto.name && {name: dto.name}
    };

    return this.http.patchRequest$<object>(`${API_JOURNALS_URL}${dto.id}`, payload).pipe(
      map((response) => {
        return response.body as Journal;
      })
    );
  };

  private mapToGetJournalsURL = (dto: GetJournalsDTO): string => {
    const url = new URL(API_JOURNALS_URL);
    url.searchParams.append('author', this.userService.user.username);
    if (dto.name)
      url.searchParams.append('name', dto.name);
    if (dto.nameRegex)
      url.searchParams.append('nameRegex', dto.nameRegex);
    else
      url.searchParams.append('nameRegex','');
    if (dto.sort)
      url.searchParams.append('sort', dto.sort);
    if (dto.order !== undefined)
      url.searchParams.append('order', dto.order.toString());
    if (dto.page !== undefined)
      url.searchParams.append('page', dto.page.toString());
    if (dto.limit !== undefined)
      url.searchParams.append('limit', dto.limit.toString());
    if (dto.startDate)
      url.searchParams.append('startDate', dto.startDate.toString());
    if (dto.endDate)
      url.searchParams.append('endDate', dto.endDate.toString());
    return url.href;
  };
}
