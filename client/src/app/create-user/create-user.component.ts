import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  urlRegex!: RegExp;
  isSuccessful = false;
  isCreationFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;

    this.createUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profilePicture: ['', [Validators.pattern(this.urlRegex), Validators.required]],
      role: ['', Validators.required],
    });
  }

  onCreateUserSubmit(): void {
    const username = this.createUserForm.getRawValue().username;
    const password = this.createUserForm.getRawValue().password;
    const profilePicture = this.createUserForm.getRawValue().profilePicture;
    const role = this.createUserForm.getRawValue().role;

    this.userService.createUser(username, password, profilePicture, role).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isCreationFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isCreationFailed = true;
      }
    });
  }
}
