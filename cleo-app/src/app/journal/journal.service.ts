import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private http = inject(HttpService);
}
