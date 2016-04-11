import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {SignupService} from './signup.service';

@Component({
  selector: 'signup-local',
  template: require('./signup-local.component.html'),
  directives: [],
  providers: [SignupService]
})
export class SignupLocalComponent implements OnInit {
  public signupLocalModel = {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  };

  public confirmPassword: string = '';

  constructor(private _router:Router, private _signupService: SignupService) {
  }

  ngOnInit() {
    
  }

  toSignupExternal() {
    this._router.navigate(['SignupExternal']);
  }

  onSignupLocalSubmit() {
    this._signupService.postSignupLocal(this.signupLocalModel).subscribe(
      data => this._router.navigateByUrl('/dashboard')
    );
  }
}