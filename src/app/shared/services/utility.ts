import { Injectable } from "@angular/core";  

@Injectable({
  providedIn: "root",
})

 export class UtilityService { 

    getTodaysDate(){  
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        return date;
     }

     
}