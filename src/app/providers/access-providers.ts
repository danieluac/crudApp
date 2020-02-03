import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class AccessProviders {
    server : string = "http://localhost:7000/Auth/";
    constructor (
        public http : HttpClient 
    ){}

    postData(body,file)
    {
        let headers = new HttpHeaders({
            "Content-Type": "application/json; charset=UTF-8"
        });
        let options = {
            headers : headers
        }
        return this.http.post(this.server + file,JSON.stringify(body), options)
        ;//.timeout(59000)
        //.map(res => res);
    }
}