import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  selector: 'login-external',
  template: require('./login-external.component.html'),
  directives: [],
  providers: []
})
export class LoginExternalComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
  }

  toLoginLocal() {
    this._router.navigate(['LoginLocal']);
  }
}