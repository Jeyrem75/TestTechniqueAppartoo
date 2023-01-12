import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users?: any;
  friends?: any;
  user_id?: string;
  isSuccessful = false;
  isAddFailed = false;
  errorMessage = '';
  
  constructor(private userService: UserService, private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    const _id = this.storageService.getUser()._id;

    this.userService.getUsers().subscribe({
      next: data => {
        this.users = data;
        console.log(this.users);
      },
      error: err => {console.log(err)
        if (err.error) {
          this.users = JSON.parse(err.error).message;
        } else {
          this.users = "Error with status: " + err.status;
        }
      }
    });

    this.userService.getFriends(_id).subscribe({
      next: data => {
        this.friends = data;
        console.log(this.friends);
      },
      error: err => {console.log(err)
        if (err.error) {
          this.friends = JSON.parse(err.error).message;
        } else {
          this.friends = "Error with status: " + err.status;
        }
      }
    });

    const user = this.storageService.getUser();
    this.user_id = user._id;
  }

  goToUserProfile(_id: string): void {
    this.router.navigate([`/profile/${_id}`]);
  }

  followUser(_id: string): void {
    const user_id = this.storageService.getUser()._id;
    this.userService.followUser(_id, user_id).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isAddFailed = false;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isAddFailed = true;
      }
    })
  }

  unfollowUser(_id: string): void {
    const user_id = this.storageService.getUser()._id;
    this.userService.unfollowUser(_id, user_id).subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.isAddFailed = false;
          this.reloadPage();
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isAddFailed = true;
        }
    })
  }

  reloadPage(): void {
    window.location.reload();
  }
}
