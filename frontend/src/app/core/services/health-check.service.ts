import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  private readonly healthCheckUrl = `${environment.apiUrl}/health`;

  constructor(private http: HttpClient) { }

  checkHealth(): Observable<{status: string, color: string}> {
    return this.http.get<{status: string, color: string}>(this.healthCheckUrl);
  }
}