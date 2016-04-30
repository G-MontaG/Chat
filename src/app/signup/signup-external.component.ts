import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {SignupService} from "./signup.service";

@Component({
  selector: 'signup-external',
  template: require('./signup-external.component.html'),
  directives: [],
  providers: [SignupService]
})
export class SignupExternalComponent implements OnInit {
  constructor(private _router:Router,
              private _signupService:SignupService) {
  }

  ngOnInit() {
  }

  toSignupLocal() {
    this._router.navigate(['SignupLocal']);
  }

  onGoogleSubmit() {
    this._signupService.getGoogle().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }

  onFacebookSubmit() {
    this._signupService.getFacebook().subscribe(
      data => window.location.href = data.redirectUrl
    );
  }
}