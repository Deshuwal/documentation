import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpService } from "./http.service";
  

@Injectable({
  providedIn: 'root',
})  
export class TinService { 

  private states:any[];
  private lgas:any[];
  private pre_tin:string = "23";

  constructor(private httpService:HttpService) { 

    this.loadJsonAssets();
    
  }


  loadJsonAssets() {
    let statesFile: string = "../../../../assets/data/state.json";
    let lgaFiles: string = "../../../../assets/data/status.json";

    this.httpService.getDataHttp(statesFile).subscribe((data: any[]) => {
      var testResponse = data;
      this.states = data; 
    });
  }


  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getPreTin(state:string, lga:string) { 
 
    
    let pre_tin = this.pre_tin;
    let done_flag = false;

    for (let i = 0; i < this.states.length; i++) {
        if(done_flag){
          break;
        }
      if (this.states[i].state == state) {
        for (let j = 0; j < this.states[i].lgas.length; j++) {
          let thisLga: string = this.states[i].lgas[j];

          if (thisLga == lga) {
            let pre_state =  this.states[i].state_code;
            let pre_lga = this.states[i].lga_codes[thisLga];
            pre_tin = pre_tin + pre_state + pre_lga;
            done_flag = true;
          }

          if(done_flag){
            break;
          }
        }
      }
    }

    return pre_tin;
  }

  
}
