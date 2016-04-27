import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router, RouteParams} from "angular2/router";

import {GoogleService} from './google.service';

@Component({
  selector: 'google',
  template: require('./google.component.html'),
  directives: [],
  providers: [GoogleService]
})
export class GoogleComponent implements OnInit {
  constructor(private _router:Router,
              private _routeParams:RouteParams,
              private _googleService:GoogleService) {
  }

  ngOnInit() {
    console.log(this._routeParams);
    // this._googleService.postGoogleAuth({code: this._routeParams.get('code')}).subscribe(
    //   data => this._router.navigate(['Dashboard'])
    // );
  }
}