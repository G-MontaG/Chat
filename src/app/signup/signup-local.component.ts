import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {ControlGroup, FORM_DIRECTIVES, Control, FormBuilder, Validators} from "angular2/common";
import {Router} from 'angular2/router';

import {SignupService} from './signup.service';
import {FormValidationService} from "../service/form-validation.service";

@Component({
  selector: 'signup-local',
  template: require('./signup-local.component.html'),
  directives: [FORM_DIRECTIVES],
  providers: [SignupService, FormValidationService]
})
export class SignupLocalComponent implements OnInit {
  signupLocalForm:ControlGroup;
  firstname:Control;
  lastname:Control;
  email:Control;
  password:Control;
  confirm:Control;

  private isEqual;

  constructor(private _router:Router,
              private _signupService:SignupService,
              private _formBuilder:FormBuilder,
              private _validationService: FormValidationService) {
    this.isEqual = this._validationService.isEqual.bind(this);
    this.firstname = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(2)
    ]));
    this.lastname = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(2)
    ]));
    this.email = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      FormValidationService.isEmail
    ]));
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.confirm = new Control('', Validators.compose([
      Validators.required,
      this.isEqual
    ]));
    this.signupLocalForm = _formBuilder.group({
      profile: _formBuilder.group({
        firstname: this.firstname,
        lastname: this.lastname,
      }),
      email: this.email,
      password: this.password,
      confirm: this.confirm
    });
  }

  ngOnInit() {

  }

  toSignupExternal() {
    this._router.navigate(['SignupExternal']);
  }

  onSignupLocalSubmit() {
    delete this.signupLocalForm.value.confirm;
    this._signupService.postSignupLocal(this.signupLocalForm.value).subscribe(
      data => this._router.navigateByUrl('/dashboard')
    );
  }
}