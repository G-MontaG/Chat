import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

@Component({
  selector: 'app',
  template: require('./app.component.html'),
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/', name: 'App', component: AppComponent, useAsDefault: true},
])
export class AppComponent implements OnInit {
  constructor() {
    console.log(_.last([1, 2, 3]));
  }

  ngOnInit() {
  }
}