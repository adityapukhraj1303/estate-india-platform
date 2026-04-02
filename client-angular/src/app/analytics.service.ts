import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties`);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/properties/stats`);
  }

  getAIRecommendations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ai/recommendations`);
  }
}
