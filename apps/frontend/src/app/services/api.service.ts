import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  // Bicycles
  getBicycles(): Observable<any[]> {
    return this.http.get<any>(`${this.API}/bicycles`, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  createBicycle(bicycle: any): Observable<any> {
    return this.http.post<any>(`${this.API}/bicycles`, bicycle, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  updateBicycle(id: string, bicycle: any): Observable<any> {
    return this.http.put<any>(`${this.API}/bicycles/${id}`, bicycle, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  deleteBicycle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/bicycles/${id}`, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  reactivateBicycle(id: string): Observable<any> {
    return this.http.post<any>(`${this.API}/bicycles/${id}/reactivate`, {}, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  // Users
  getUsers(): Observable<any[]> {
    return this.http.get<any>(`${this.API}/users`, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  topUpUser(id: string, amount: number): Observable<any> {
    return this.http.put<any>(`${this.API}/users/${id}/balance`, { amount }, { headers: this.headers }).pipe(map((res: any) => res.data));
  }

  // Bookings
  getBookings(): Observable<any[]> {
    return this.http.get<any>(`${this.API}/bookings`, { headers: this.headers }).pipe(map((res: any) => res.data));
  }
}
