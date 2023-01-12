import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      'http://localhost:3000/api/auth/login',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, password: string, profilePicture: string, role:  string): Observable<any> {
    return this.http.post(
      'http://localhost:3000/api/auth/register',
      {
        username,
        password,
        profilePicture,
        role,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/logout', { }, httpOptions);
  }
}
