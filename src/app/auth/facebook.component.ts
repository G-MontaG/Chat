import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";

import {FacebookService} from './facebook.service';

@Component({
  selector: 'facebook',
  template: require('./facebook.component.html'),
  directives: [],
  providers: [FacebookService]
})
export class FacebookComponent implements OnInit {
  constructor(private _router:Router,
              private _facebookService:FacebookService) {
  }

  ngOnInit() {
    this._facebookService.getFacebookUser().subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }
}