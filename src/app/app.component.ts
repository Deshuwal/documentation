import { Component, enableProdMode } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bootDash';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  loading:boolean = false;
  
  constructor(private router:Router,private idle: Idle, private keepalive: Keepalive) {
    
/**
 * @param  {Event} (event
 */

      this.router.events.subscribe((event: Event) => { 
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }
   
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
             this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      });







    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(60 * 15);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    /**
     * @param  {} =>{this is an arrow function that test idles time
     */
    idle.onIdleEnd.subscribe(() => { 
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      this.reset();
    });
    
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      localStorage["token"] = "";

      this.router.navigate(['/']);
    });
    
    idle.onIdleStart.subscribe(() => {
        this.idleState = 'You\'ve gone idle!'
        console.log(this.idleState);
    });
    
    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);
    /**
     * @param  this is an arrow method that check for server ping
     */
    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }
  /**
   * @param checks for idle time that the use say without touching the system
   */
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
