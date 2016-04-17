import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";
import {ControlGroup, Control, FORM_DIRECTIVES, FormBuilder, Validators} from "angular2/common";

import {VerifyService} from './verify.service';
import {FormValidationService} from "../service/form-validation.service.ts";

@Component({
  selector: 'verify',
  template: require('./verify.component.html'),
  directives: [FORM_DIRECTIVES],
  providers: [VerifyService, FormValidationService]
})
export class VerifyComponent implements OnInit {
  verifyEmailForm:ControlGroup;
  token:Control;
  
  constructor(private _verify:VerifyService,
              private _router:Router,
              private _formBuilder:FormBuilder) {
    this.token = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8)
    ]));
    this.verifyEmailForm = _formBuilder.group({
      token: this.token
    })
  }

  ngOnInit() {
  }
  
  onVerifyEmailSubmit() {
    this._verify.postToken(this.verifyEmailForm.value).subscribe(
      data => this._router.navigate(['Dashboard'])
    )
  }
  
  toDashboard() {
    this._router.navigate(['Dashboard']);
  }
}