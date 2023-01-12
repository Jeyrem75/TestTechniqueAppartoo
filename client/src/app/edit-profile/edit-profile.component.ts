import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editForm!: FormGroup;
  urlRegex!: RegExp;
  isSuccessful = false;
  isEditFailed = false;
  errorMessage = '';
  name: string = this.storageService.getUser().username;
  pass: string = this.storageService.getUser().password;
  pic: string = this.storageService.getUser().profilePicture;
  class: string = this.storageService.getUser().role;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;

    this.editForm = this.formBuilder.group({
      username: [this.name, Validators.required],
      profilePicture: [this.pic, Validators.pattern(this.urlRegex)],
      role: [this.class, Validators.required],
    })
  }

  onEditSubmit(): void {
    const username = this.editForm.getRawValue().username;
    const profilePicture = this.editForm.getRawValue().profilePicture;
    const role = this.editForm.getRawValue().role;
    const _id = this.storageService.getUser()._id;

    this.userService.editUser(_id, username, profilePicture, role).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isEditFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isEditFailed = true;
      }
    });
  }

}
