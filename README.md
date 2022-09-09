# PSIRS PLATFORM FRONTEND DOCUMENTATION
## PSIRS FRONTEND DESIGN: 
is built with angular framework theme (gull here is the documentation url http://demos.ui-lib.com/gull-doc/) which as sass as its formatting style sheet and has some files and folders structure as a normal angular framework, thus; 
let take a look at some of the files and folders structures and their important to the project implementation:

# At the root of our project we have this important files and folders:
this files and folder help in the smooth execution of our angular application, hence below are some this files and folders:

## 1) node_modules:     
this is an npm packages installed in the project with the npm install command. thus is houses all the  requirement needed for the project to run smoothly

## 2) e2e (end to end):
This folder is where our end to end tests will live. if which the project uses it to conduction e2e test. 

## 3) src (source):
The most important folder. Here we have all the files that make our Angular app and is the location where we will spend most of our time coding.

## 4) angular.json:
It provides workspace-wide and project-specific configuration defaults for build and development tools provided by the Angular CLI. 

## 5) .gitignore:  
Specifies intentionally untracked files that Git should ignore.

## 6) package.json: 
As every modern web application, we need a package system and package manager to handle all the third-party libraries and modules used by our app. Inside this file you will find all the dependencies and some other handy stuff like the npm scripts that will help us a lot to orchestrate the development (bundling/compiling) workflow.

## 7) package-lock.json:  
Provides version information for all packages installed into node_modules by the npm client.

## 8) tsconfig.json:  
Default Typescript configuration file. It needs to be in the root path as it’s where the typescript compiler will look for it.

# So let take a look at the SRC (sources) folder in detail where our code base is:

## /src (source folder):
Inside of the /src directory we find our raw, uncompiled code. This is where most of the work for your Angular app will take place.
When we start the scripts that handle the bundling/compilation workflow, our code inside of /src gets bundled and transpiled into the correct Javascript version that the browser understands (currently, ES5). That means we can work at a higher level using TypeScript, but compile down to the older form of Javascript the browser needs. Under this folder, you will find the following important folders and files:

## 1) /app: 
Has all the components, modules, pages, services and styles you will use to build your app.

## 2) /assets:   
In this folder you will find images, sample-data json’s, and any other asset you may require in your app.

## 3) /environments: 
Under this folder are configuration files used by the Angular CLI to manage the different environment variables. For example we could have a local database for our development environment and a product database for production environment.
When we run ng serve it will use by default the dev environment.

## 4) /main: 
Has the files needed to bootstrap the app. which is the entrypoint into the application via bootstraping (more so i will like to called it the entrypoint for the .ts scripted which is the main angular logic)

## 5) index.html: 
this is the entrypoint of the template, which get displayed on your browser; so you won’t be modifying this file often, as in our case it only serves as a placeholder. All the scripts and styles needed to make the app work are injected automatically by the webpack bundling process, so you don’t have to do this manually.

## 6) tsconfig.app.json: 
This file extends tsconfig.json main file and adds some specific configuration for the app. It’s then used in angular.json

## 7) tsconfig.server.json: 
This file extends tsconfig.json main file and adds some specific configuration for the server. It’s then used in angular.json
# Looking at the sources app (/src/app) folder:
## /src/app: 
This is the core of the project. Let’s have a look at the structure of this folder so you get an idea where to find things and where to add your own modules to adapt this project to your particular needs.
We designed this project with a modular approach. We strive to showcase an advanced app module architecture so you get a better idea on how to structure and scale your project. Again, modules are great to achieve scalability.

1) app.component.html: 
    
    • This serves as the skeleton of the app. Typically has a <router-outlet> to render the routes and their content. It can also be wrapped with content that you want to be in every page (for example a footer).

2) app.component.ts:
    
    • It’s the Angular component that provides functionality to the html file I just mentioned about.

3) app.module.ts:
    
    • This is the main module of the project.

4) app.routes.ts:
    
    • Here we define the main routes. Child routes of other lazy modules are defined inside those modules. These routes are registered to the Angular RouterModule in the AppModule.
## /src/app/views
This folder contains the CoreModule.This module gather all single-use classes and components their details inside a CoreModule.In the /views folder of this project you will find these components folders:
1. asssessment
2. audit
3. auth
5. calender
6. intelligence
7. mda-admin
8. others
9. payments
10. register
11. reporting
12. revenue-return
13. risk-based-audit
14. taxpayer
15. tcc
## /src/app/shared
The SharedModule that lives in this folder exists to hold the common components, directives, and pipes and share them with the modules that need them. It imports the Angular CommonModule because the components inside this folder use common Angular directives. You will notice that it also re-exports other modules.
If you review the application structure, you may notice that many components requiring SharedModule directives also use NgIf and NgFor from Angular'sCommonModule and bind to component properties with [(ngModel)], a directive in the Angular's FormsModule. 
In the /shared folder of this Angular project you will find these components and directives:
1. animations
2. components
3. constants
4. directives
5. inmemory-db
6. interceptors
7. models
8. pipes
9. services
10. types
