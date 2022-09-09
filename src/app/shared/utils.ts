import { ElementFinder, ProtractorBrowser } from "protractor";

export class Utils {
    static isMobile() {
        return window && window.matchMedia('(max-width: 767px)').matches;
    }
    static ngbDateToDate(ngbDate: { month, day, year }) {
        if (!ngbDate) {
            return null;
        }
        return new Date(`${ngbDate.month}/${ngbDate.day}/${ngbDate.year}`);
    }
    static dateToNgbDate(date: Date) {
        if (!date) {
            return null;
        }
        date = new Date(date);
        return { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    static scrollToTop(selector: string) {
        if (document) {
            const element = <HTMLElement>document.querySelector(selector);
            element.scrollTop = 0;
        }
    }
    static genId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    static parsePhpDate(unixtimestamp:any){
 
            // Unixtimestamp 
           
            // Months array
            var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
           
            // Convert timestamp to milliseconds
            var date = new Date(unixtimestamp*1000);
           
            // Year
            var year = date.getFullYear();
           
            // Month
            var month = months_arr[date.getMonth()];
           
            // Day
            var day = date.getDate();
           
            // Hours
            var hours = date.getHours();
           
            // Minutes
            var minutes = "0" + date.getMinutes();
           
            // Seconds
            var seconds = "0" + date.getSeconds();
           
            // Display date time in MM-dd-yyyy h:m:s format
            var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
             
            return convdataTime;
            
           
    }

    static getTimeIntervalPhpTimeStamp(date:number) {

        let seconds = Math.floor((Date.now()/1000) - date);
        let unit = "second";
        let direction = "ago";
        if (seconds < 0) {
          seconds = -seconds;
          direction = "from now";
        }
        let value = seconds;
        if (seconds >= 31536000) {
          value = Math.floor(seconds / 31536000);
          unit = "year";
        } else if (seconds >= 86400) {
          value = Math.floor(seconds / 86400);
          unit = "day";
        } else if (seconds >= 3600) {
          value = Math.floor(seconds / 3600);
          unit = "hour";
        } else if (seconds >= 60) {
          value = Math.floor(seconds / 60);
          unit = "minute";
        }
        if (value != 1)
          unit = unit + "s";
        return value + " " + unit + " " + direction;
      }
      

    static formatNumber(x:number){
 
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    }

    static getRandom(max:number){

      return Math.floor(Math.random() * max);
    }


    public static selectForNgxDropDownE2E(browser:ProtractorBrowser, elem:ElementFinder, indexToSelect:number){
 

      elem.click().then(()=>{ 
         browser.driver.sleep(200);
         browser.executeScript("$('.available-items li:nth-child("+indexToSelect+")').click()");
          
      }); 
      browser.sleep(200);
   }
  
  
     public static convertTextToCssSelectorForE2E(text:string){


         return text.split(" ").join("").split("-").join("").toLowerCase();    
     }
}
