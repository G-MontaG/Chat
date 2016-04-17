import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {ResetService} from './reset.service.ts';
import {Router} from "angular2/router";
import {ControlGroup, Control, FORM_DIRECTIVES, FormBuilder, Validators} from "angular2/common";
import {FormValidationService} from "../service/form-validation.service.ts";

@Component({
  selector: 'reset',
  template: require('./reset.component.html'),
  directives: [FORM_DIRECTIVES],
  providers: [ResetService, FormValidationService]
})
export class ResetComponent implements OnInit {
  resetPasswordForm:ControlGroup;
  password:Control;
  newPassword:Control;
  confirm:Control;

  constructor(private _reset:ResetService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.newPassword = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30),
      FormValidationService.isPassword
    ]));
    this.confirm = new Control('', Validators.compose([
      Validators.required,
      FormValidationService.isEqual
    ]));
    this.resetPasswordForm = _formBuilder.group({
      password: this.password,
      newPassword: this.newPassword,
      confirm: this.confirm
    });
  }

  ngOnInit() {
  }

  onResetPasswordSubmit() {
    delete this.resetPasswordForm.value.confirm;
    this._reset.postResetPassword(this.resetPasswordForm.value).subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }

  toDashboard() {
    this._router.navigate(['Dashboard']);
  }
}