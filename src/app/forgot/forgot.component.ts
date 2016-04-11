import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {ForgotService} from './forgot.service';

@Component({
  selector: 'forgot',
  template: require('./forgot.component.html'),
  directives: [],
  providers: [ForgotService]
})
export class ForgotComponent implements OnInit {
  constructor(private _forgot: ForgotService) {
  }

  ngOnInit() {
  }
}