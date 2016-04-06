import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  selector: 'signup-local',
  template: require('./signup-local.component.html'),
  directives: [],
  providers: []
})
export class SignupLocalComponent implements OnInit {
  constructor(private _router:Router) {
  }

  ngOnInit() {
    
  }

  toSignupExternal() {
    this._router.navigate(['SignupExternal']);
  }
}