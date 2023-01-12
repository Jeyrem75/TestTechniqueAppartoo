import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  urlRegex!: RegExp;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn = false;
  name: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profilePicture: ['', [Validators.pattern(this.urlRegex), Validators.required]],
      role: ['', Validators.required],
    });

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.name = this.storageService.getUser().username;
    }
  }

  onRegisterSubmit(): void {
    const username = this.registerForm.getRawValue().username;
    const password = this.registerForm.getRawValue().password;
    const profilePicture = this.registerForm.getRawValue().profilePicture;
    const role = this.registerForm.getRawValue().role;

    this.authService.register(username, password, profilePicture, role).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
