import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly options = {
    observe: 'response' as const,
    withCredentials: true,
    headers: new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("credentials", "true")
  };
  constructor() {}
}
