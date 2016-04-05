import './vendors.ts';

import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {AppComponent} from './app/app.component';

import './main.scss';

bootstrap(<any>AppComponent, [
  ROUTER_PROVIDERS
]);