import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user?: any;
  friends?: any;

  constructor(private userService: UserService, private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    const _id = this.router.url.split("/")[2];
    this.userService.getUser(_id).subscribe({
      next: data => {
        this.user = data;
        console.log(this.user)
      },
      error: err => {console.log(err)
        if (err.error) {
          this.user = JSON.parse(err.error).message;
        } else {
          this.user = "Error with status: " + err.status;
        }
      }
    });

    this.userService.getFriends(_id).subscribe({
      next: data => {
        this.friends = data;
        console.log(this.friends)
      },
      error: err => {console.log(err)
        if (err.error) {
          this.friends = JSON.parse(err.error).message;
        } else {
          this.friends = "Error with status: " + err.status;
        }
      }
    });
  }
}
