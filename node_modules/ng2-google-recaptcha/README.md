## Build Status

[![npm version](https://badge.fury.io/js/ng2-google-recaptcha.svg)](https://badge.fury.io/js/ng2-google-recaptcha)

**Master Branch**

[![Build Status](https://travis-ci.org/leewinder/ng2-google-recaptcha.svg?branch=master)](https://travis-ci.org/leewinder/ng2-google-recaptcha) 
[![Dependency Status](https://dependencyci.com/github/leewinder/ng2-google-recaptcha/badge)](https://dependencyci.com/github/leewinder/ng2-google-recaptcha)

**Develop Branch**

[![Build Status](https://travis-ci.org/leewinder/ng2-google-recaptcha.svg?branch=develop)](https://travis-ci.org/leewinder/ng2-google-recaptcha) 

<br>

## Overview

An Angular module implementing Google's reCAPTCHA that actually works, requires no additional dependancies and only needs a single import.

<br>

![](https://cloud.githubusercontent.com/assets/1649415/19627247/731fa85e-993a-11e6-9a3d-24dec5d15de0.gif)

## Dependancies
Currently built against Angular ^5.2.3 and Typescript ^2.6.2

ng2-google-recaptcha has the following additional dependancies
- [TsLerp](https://www.npmjs.com/package/tslerp): Typescript library for lerping single and multi-sample data sets over time

<br>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"ng2-google-recaptcha": "^5.0.0"`
  
  Optionally, you can manually install the package using the npm command line

  `npm install ng2-google-recaptcha --save`
  
2. Add ng2-google-recaptcha to both your `map` and `packages` structures in `systemjs.config.js`

  ```javascript
  var map = {
    ...
    'ng2-google-recaptcha': 'node_modules/ng2-google-recaptcha'
  };
  ```
  
  ```javascript
  var packages = {
    ...
    'ng2-google-recaptcha': { main: 'index.js', defaultExtension: 'js' },
  };
  ```
  
3. Optionally, add the `rootDir` option to `tsconfig.json` to make sure TypeScript's default root path algorithm doesn't pull in the `node_modules` folder

<br>

## Usage

### Importing The 'ng2-google-recaptcha' Module
To use ng2-google-recaptcha, you need to import the Ng2GoogleRecaptchaModule into the relevent module in your application.  In the sample application this is done in the entry module - [app.module.ts](https://github.com/leewinder/ng2-google-recaptcha/blob/master/samples/src/app/app.module.ts)

```TypeScript
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Ng2GoogleRecaptchaModule }  from 'ng2-google-recaptcha';

@NgModule({
    imports: [
        BrowserModule,
        Ng2GoogleRecaptchaModule,
    ],

    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
```

<br>

### Adding a reCAPTCHA

To add a reCAPTCHA all you need is to link to Google's reCAPTCHA script, a [site key](https://developers.google.com/recaptcha/), and a response callback.

Add the following to your `<head>` tag in your main HTML page
* `<script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>`

The following is the most basic component to implement the reCAPTCHA

```TypeScript
@Component({
    template: `<ng2-google-recaptcha 
                  [siteKey]="recaptchaSiteKey" 
                  (onCaptchaComplete)="onCaptchaComplete($event)">
               </ng2-google-recaptcha>`,
})
export class BasicComponent {

	private recaptchaSiteKey = 'YOUR-RECAPTCHA-SITE-KEY-HERE';

	private onCaptchaComplete(response: any) {
        console.log('reCAPTCHA response recieved:');
        console.log(response.success);
        console.log(response.token);
    }
}
```

Once `BasicComponent.onCaptchaComplete` is called, the response element will contain the following attributes
* success: True is the request succeeded, False otherwise
* token: The validation token which can be used to [validate the users response](https://developers.google.com/recaptcha/docs/verify)
* recaptcha: The ng2-google-recpatcha instance this response was generated on

If the users response times out, `BasicComponent.onCaptchaComplete` will be automatically called with a failed response and a null token, requiring the user to restart the process.

<br>

### Additional reCAPTCHA Options

When specifying `<ng2-google-recaptcha>` you can pass through the following additional properties
* captchaStyle: An object containing the style of the reCAPTCHA to render (see the code example below)
* renderDelay: A delay (in milliseconds) before the reCAPTCHA renders on screen (defaults to 500ms)
* recaptchaId: When using multiple reCAPTCHA elements, a unique ID that identifies this element

```TypeScript
@Component({
    template: `<ng2-google-recaptcha 
                  
                  [captchaStyle]="recaptchaStyle" 
                  [renderDelay]="delayToRender" 
                  [recaptchaId]="thisRecaptchaId" 
                  
                  [siteKey]="recaptchaSiteKey" 
                  
                  (onCaptchaComplete)="onCaptchaComplete($event)">
                  
               </ng2-google-recaptcha>`,
})
export class BasicComponent {

	private recaptchaSiteKey: string = 'YOUR-RECAPTCHA-SITE-KEY-HERE';

  private delayToRender: number = 1000; // A one second delay before rendering this element
  private thisRecaptchaId: string = 'this-is-my-unique-id'; // ID to uniquely identify this reCAPTCHA
  
  // Style to use - all properties are optional and the style can be ommitted completely
  private recaptchaStyle = {
        theme: 'dark',     // Uses the Dark theme for this reCAPTCHA
        type: 'audio',     // Use the audio version for user verification
        size: 'compact',   // Use the compact style 
        tabindex: 0,       // Tab Index for this element
  };
  
  

	private onCaptchaComplete(response: string) {
        console.log('reCAPTCHA response recieved:');
        console.log(response);
    }
}
```

<br>

### Resetting a reCAPTCHA

If you require the user to redo the reCAPTCHA, you can call `resetRecaptcha` which will reload the reCAPTCHA and call the `onCaptchaComplete` callback with a null token allowing it to be reset.

```TypeScript
@Component({
  // ...
})
export class BasicComponent {

  // How you get hold of the reCAPTCHA instance is up to you
  @ViewChild(CreateRecaptchaComponent)
  private recaptchaInstance: CreateRecaptchaComponent;

  // Function called after we have used the reCAPTCHA token
  private serverResponse() {
    // ...

    // If we received an error requiring the reCAPTCH to be done again,
    // reset the element causing the previous token to be reset
    recaptchaInstance.resetRecaptcha();

    // ...
  }

}
```

<br>

### Building and Running the Sample Application
Check out the repository, browse to the './samples' folder and run `npm install` to install all the required dependancies.

**Note**: Running `npm install` on the sample project requires that Python 2.7.x is available on the command line as it runs a couple of Python scripts to correctly set up the npm_modules folder.

ng2-google-recaptcha is developed in [Visual Studio Code](https://code.visualstudio.com/) so once `npm install` has finished you should be able to open the './samples' folder in VS Code and it will run out of the box (by default it uses lite-server which is installed as part of `npm install`).

If you are not using Visual Studio Code, browse to the './samples' folder and run `tsc` to build the application.  Then open your local server of choice pointing to ./samples as the root directory.

<br>

## Change Log

### 5.0.0
* Updated to Angular 5.2.3

### 4.0.0
* Removed dependency on typings
* Updated to Typescript ^2.6.2

### 1.2.0
* Updated to Angular ^4.1.3 and Typescript ^2.3.2
* [Bug Fix] Changed moduleId from using module.id to __filename [#2](https://github.com/leewinder/ng2-google-recaptcha/pull/2)
* [Bug Fix] Delay added before Google reCAPTCHA library is loaded [#5](https://github.com/leewinder/ng2-google-recaptcha/pull/5)

### 1.1.0
* Added ability to reset the reCAPTCH using CreateRecaptchaComponent:resetRecaptcha

### 1.0.0
* Initial release
