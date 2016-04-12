import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class ForgotService {
  constructor(private http:Http) {
  }

  postEmail(data:{email: string}) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/forgot-password/email', body, options)
      .map(res => res.json())
      .do((data) => console.log(data))
      .catch(this.handleError);
  }

  postToken(data:{token: string}) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/forgot-password/token', body, options)
      .map(res => res.json())
      .do((data) => console.log(data))
      .catch(this.handleError);
  }

  postPassword(data:{password: string}) {
    let body = JSON.stringify({data});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post('/api/forgot-password/new-password', body, options)
      .map(res => res.json())
      .do((data) => console.log(data))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    let _error = error.json();
    console.error(_error);
    toastr.error(_error.message);
    return Observable.throw(_error.error || 'Server error');
  }
}