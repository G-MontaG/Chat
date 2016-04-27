import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class GoogleService {
  constructor(private http:Http) {
  }

  getGoogleUser() {
    return this.http.get('/api/google-auth/user')
      .map(res => res.json())
      .do((data) => localStorage.setItem('token', data.token))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    let _error = error.json();
    console.error(_error);
    toastr.error(_error.message);
    return Observable.throw(_error.error || 'Server error');
  }
}