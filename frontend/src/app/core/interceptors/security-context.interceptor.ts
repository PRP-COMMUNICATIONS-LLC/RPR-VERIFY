import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';

@Injectable()
export class SecurityContextInterceptor implements HttpInterceptor {
  private projectService = inject(ProjectService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const projectId = this.projectService.activeProjectId();
    
    // Auto-inject Project ID into all Cloud Run backend calls
    if (projectId && request.url.includes('run.app')) {
      request = request.clone({
        setHeaders: { 'X-Project-ID': projectId }
      });
    }
    return next.handle(request);
  }
}
