import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class LoginService {
  constructor(private http:Http) {
  }

  postLogin(data:Object) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/login', body, options)
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