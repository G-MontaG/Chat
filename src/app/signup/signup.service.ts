import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

import {postSignupLocalData} from "./signup.d";

@Injectable()
export class SignupService {
  constructor(private http:Http) {

  }

  postSignupLocal(data:postSignupLocalData) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/signup-local', body, options)
      .map(res => res.json())
      .do((data) => localStorage.setItem("token", data.token))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    let _error = error.json();
    console.error(_error);
    toastr.error(_error.message);
    return Observable.throw(_error.error || 'Server error');
  }
}