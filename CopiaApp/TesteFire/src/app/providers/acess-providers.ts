import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AcessProviders{
    //Coloca o ip da sua maquina aqui
    server:string = "http://192.168.0.19/CopiaApp/TesteFire/api/";
    /* server:string = "http://10.42.0.208/CopiaApp/TesteFire/api/"; */
    //server:string = "http://10.0.0.8/CopiaApp/TesteFire/api/";
    constructor(public http: HttpClient){

    }

    postData(body, file){
        let header  = new HttpHeaders({
            'Content-Type': "application/json; charset-UTF-8"
        });
        let options = {
            headers : header
        }

        return this.http.post(this.server + file, JSON.stringify(body),options)
        .timeout(590000) //59sec
        .map(res => res);
    }

}