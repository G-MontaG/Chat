import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  selector: 'login-local',
  template: require('./login-local.component.html'),
  directives: [],
  providers: []
})
export class LoginLocalComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
    
  }

  toLoginExternal() {
    this._router.navigate(['LoginExternal']);
  }
}