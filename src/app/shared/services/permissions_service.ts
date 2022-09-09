import { Injectable } from "@angular/core";
import { LocalStoreService } from "./local-store.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpService } from "./http.service";
import { parse } from "querystring";
import { PayeeCalculator } from "../models/payee_calculator";


@Injectable({
  providedIn: "root"
})
export class PermissionService {
  //Only for demo purpose
  authenticated = true;

  constructor(private store: LocalStoreService, private httpService:HttpService, private router: Router) {
    
  }
 
        

          
  
}
