import { Injectable, isDevMode } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpHandler } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  //Only for demo purpose
  private host: string;

  private local = isDevMode();

  private payments_api: string = "http://localhost:5002"; //"https://payments.psirs.gov.ng/";

  private proxy_server: string = "https://proxy.psirs.gov.ng/"; //"https://payments.psirs.gov.ng/"; //"http://18.134.166.205/";

  private nin_server:string = "http://54.217.208.241/pictdaIntegration/";

  constructor(private httpClient: HttpClient, private toastr: ToastrService) {//use for prod
    let current_url: string = window.location.href;

    if (//enable url redirection check
      current_url.indexOf("registration.psirs.gov.ng") > -1 ||
      current_url.indexOf("piras.psirs.gov.ng") > -1
    ) {
      this.host =
        environment.API_BASE_URL_PROD || "https://stagingbackend.psirs.gov.ng/";
    } else if (current_url.indexOf("http://reg.psirs.gov.ng") > -1 || current_url.indexOf("http://lands.psirs.gov.ng") > -1) {
      this.host =
        environment.API_BASE_URL_DEV ||
        "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/";
      this.payments_api = "http://3.9.45.117/";
    } else {
      this.host =
        environment.API_BASE_URL_LOCAL ||
        "http://test-psirs-backend-server.eu-west-2.elasticbeanstalk.com/";
      this.payments_api =    "http://localhost:5002/"; //"http://3.9.45.117/";
    }
  }
  addRequestHeaders() {
    var auth_token = localStorage["token"];
    let headers = new HttpHeaders();
    return headers.set("Authorization", "Bearer " + auth_token);
  }

  doGet(api: string) {//getting inform
    let url = this.host + api;
    if (this.local) {
      console.log("getting data ", api);
    }
    return this.httpClient.get(url, { headers: this.addRequestHeaders() });
  }

  doPost(api: string, data: any) {
    let url = this.host + api;
    console.log("url is " + url);
    return this.httpClient.post(url, data, {
      headers: this.addRequestHeaders(),
    });
  }

  doPatch(api: string, data: any) {
    let url = this.host + api;
    console.log("url is " + url);
    return this.httpClient.patch(url, data, {
      headers: this.addRequestHeaders(),
    });
  }

  doGetPaymentsServer(api: string) {
    let url = this.payments_api + api;
    return this.httpClient.get(url, {
      headers: this.addRequestHeaders(),
    });
  }


  doPostNINServer(api:string, data:any){

    let url = this.nin_server + api;
    return this.httpClient.post(url, data,  {
      headers: this.addRequestHeaders(),
    });

  }

  doPostPaymentsServer(api: string, data: any) {
    let url = this.payments_api + api;
    console.log("payment url ", url);
    return this.httpClient.post(url, data, {
      headers: this.addRequestHeaders(),
    });
  }

  doPostProxyServer(api: string, data: any) {
    let url = this.proxy_server;// + api;
    console.log("payment url ", url);
    return this.httpClient.post(url, data, {
      headers: this.addRequestHeaders(),
    });
  }

  doPostProxyRemita(api: string, data: any) {
    let url = this.proxy_server+ api;
    console.log("payment url ", url);
    return this.httpClient.post(url, data, {
      headers: this.addRequestHeaders(),
    });
  }
  

  doGetProxyServer(api: string) {
    let url = this.proxy_server + api;
    console.log("url ", url);
    return this.httpClient.get(url, {
      headers: this.addRequestHeaders(),
    });
  }
  
  doPut(api: string) {
    let url = this.host + api;
    return this.httpClient.put(url, { headers: this.addRequestHeaders() });
  }

  getDataHttp(url: string) {
    return this.httpClient.get(url);
  }

  displayServerValidautionErrors(error: any) {
    console.log(
      "Error saving ",
      "Error",
      error
      // "Error.error",
      // error.error,
      // "Error.error.errors",
      // error.error.errors
    );
    if (error && error.error && error.error.errors) {
      var obj = error.error.errors;
      for (const key in obj) {
        this.toastr.error(error.error.errors[key], "Wrong Input", {
          progressBar: true,
        });
      }
    } else {
      this.toastr.error("Action Failed", "Fatal Error", {
        progressBar: true,
      });
    }
  }

  getCurrentHost() {
    return this.host;
  }
}