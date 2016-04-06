import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  selector: 'signup-external',
  template: require('./signup-external.component.html'),
  directives: [],
  providers: []
})
export class SignupExternalComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
  }

  toSignupLocal() {
    this._router.navigate(['SignupLocal']);
  }
}