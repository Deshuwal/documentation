
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
 
 
if (window.location.href.indexOf("piras")>-1 || window.location.href.indexOf("registration") > -1) {
  enableProdMode();
  window.console.log = function () {};
  window.console.warn = function() {};
}
else if(window.location.href.indexOf("reg")> -1){

  console.log("on test server; debugging enabled");
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

