import { Injectable, inject } from '@angular/core';
import { HttpClient } from '../utils/http-shim';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EscalationState, EscalationTriggerResponse } from "../models/escalation";

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class EscalationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiUrl;

  private getAuthHeaders$(token?: string): Observable<Record<string, string>> {
    const t$ = token ? from(Promise.resolve(token)) : from(this.authService.getCurrentUserToken());
    return t$.pipe(map((tok: string | null | undefined): Record<string, string> => (tok ? { Authorization: `Bearer ${tok}` } : {} as Record<string, string>)));
  }

  private mapKeysToCamelCase<T>(data: T): T {
    if (data === null || typeof data !== 'object') {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map(i => this.mapKeysToCamelCase(i)) as T;
    }

    const result = Object.keys(data as object).reduce((acc, key) => {
      const camelCaseKey = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );

      const accRecord = acc as Record<string, unknown>;
      const dataRecord = data as Record<string, unknown>;
      accRecord[camelCaseKey] = this.mapKeysToCamelCase<unknown>(dataRecord[key] as unknown);
      return accRecord;
    }, {} as Record<string, unknown>);

    return result as unknown as T;
  }

  getStatus(reportId: string): Observable<EscalationState> {
    const url = `${this.baseUrl}/api/escalation/status/${reportId}`;
    return this.getAuthHeaders$().pipe(
      switchMap((headers: Record<string, string>) => this.http.get<Record<string, unknown>>(url, { headers })),
      map((raw: Record<string, unknown>) => this.mapKeysToCamelCase(raw) as unknown as EscalationState)
    );
  }

  trigger(reportId: string, metadata: object = {}): Observable<EscalationTriggerResponse> {
    const url = `${this.baseUrl}/api/escalation/trigger`;
    const body = { reportId, metadata };
    return this.getAuthHeaders$().pipe(
      switchMap((headers: Record<string, string>) => this.http.post<Record<string, unknown>>(url, body, { headers })),
      map((raw: Record<string, unknown>) => this.mapKeysToCamelCase(raw) as unknown as EscalationTriggerResponse)
    );
  }

  resolve(reportId: string, resolutionNote: string): Observable<EscalationState> {
    const url = `${this.baseUrl}/api/escalation/resolve`;
    const body = { reportId, resolutionNote };
    return this.getAuthHeaders$().pipe(
      switchMap((headers: Record<string, string>) => this.http.post<Record<string, unknown>>(url, body, { headers })),
      map((raw: Record<string, unknown>) => {
        // Narrow the response so callers don't have to deal with unknown
        const mapped = this.mapKeysToCamelCase(raw) as { updatedState?: EscalationState; updated_state?: EscalationState; currentState?: EscalationState };
        return mapped.updatedState ?? mapped.updated_state ?? mapped.currentState as EscalationState;
      })
    );
  }
}
