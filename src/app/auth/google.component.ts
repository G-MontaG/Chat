import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {Router} from "angular2/router";

import {GoogleService} from './google.service';

@Component({
  selector: 'google',
  template: require('./google.component.html'),
  directives: [],
  providers: [GoogleService]
})
export class GoogleComponent implements OnInit {
  constructor(private _router:Router,
              private _googleService:GoogleService) {
  }

  ngOnInit() {
    this._googleService.getGoogleUser().subscribe(
      data => this._router.navigate(['Dashboard'])
    );
  }
}