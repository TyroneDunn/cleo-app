import {inject, Injectable} from '@angular/core';
import {HttpService} from "../http/http.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpService);
}
