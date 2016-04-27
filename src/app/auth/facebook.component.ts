import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router, RouteParams} from "angular2/router";

import {FacebookService} from './facebook.service';

@Component({
  selector: 'facebook',
  template: require('./facebook.component.html'),
  directives: [],
  providers: [FacebookService]
})
export class FacebookComponent implements OnInit {
  constructor(private _router:Router,
              private _routeParams:RouteParams,
              private _facebookService:FacebookService) {
  }

  ngOnInit() {
    this._facebookService.postFacebookAuth({code: this._routeParams.get('code')}).subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }
}