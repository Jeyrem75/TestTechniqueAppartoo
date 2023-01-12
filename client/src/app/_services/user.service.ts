import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string = '';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getUsers(): Observable<any> {
    return this.http.get(
      'http://localhost:3000/api/users',
      httpOptions,
    );
  }

  getUser(_id: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/api/users/${_id}`,
      httpOptions,
    );
  }

  editUser(_id: string, username: string, profilePicture: string, role: string): Observable<any> {
    this.token = this.storageService.getUser().accessToken;
    return this.http.put(
      `http://localhost:3000/api/users/${_id}`,
      {
        username,
        profilePicture,
        role
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      }
    )
  }

  followUser(_id: string, user_id: string): Observable<any> {
    this.token = this.storageService.getUser().accessToken;
    return this.http.put(
      `http://localhost:3000/api/users/${_id}/follow`,
      {
          userId: user_id
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      },
    )
  }

  unfollowUser(_id: string, user_id: string): Observable<any> {
    this.token = this.storageService.getUser().accessToken;
    return this.http.put(
      `http://localhost:3000/api/users/${_id}/unfollow`,
      {
          userId: user_id
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      },
    )
  }

  getFriends(_id: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/api/users/friends/${_id}`,
      httpOptions
    )
  }
}
