import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import * as toastr from 'toastr';

@Injectable()
export class DashboardService {
  constructor(private http:Http) {
  }

  getData() {
    let jwt = localStorage.getItem('token') || '';
    let headers = new Headers({'Authorization': jwt});
    let options = new RequestOptions({ headers: headers });
    return this.http.get('/dashboard', options)
      .map(res => res.json().data)
      //.do(data => console.log(data))
      .catch(this.handleError);
  }

  private handleError(error:Response) {
    let _error = error.json();
    console.error(_error);
    toastr.error(_error.message);
    return Observable.throw(_error.error || 'Server error');
  }
}