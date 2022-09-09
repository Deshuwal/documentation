# App component module 
this is the main (root) entry-point into the whole application where all other component reach before been access within the app. thus this very component content's the bootstrap for the template rendering and the app-component route which is the root routing path for the all other sub-child route.
this module consist of one component which is the bootstrap component, two modules which is the app module and the shared module and other dependencies injected. furthermore, this module consist of different ngmodules which include:
    1. provider
    2. bootstrap
    3. imports


## 1. provider: 
This ngmodule is used for injection of dependencies within the application, that is to say any dependencies that is not declare into the provider ngmodule cannot be injected into the program. here we have two providers which include:
    1. ManageUserServices
    2.UnauthorizedErrorInterceptor

## 2. bootstrap:
this ngmodule is design as an entry-point into any angular application which handles template rendering. the bootstrap component is located within the app-Component module

## 3. import:
this ngmodule handles the importation of dependencies and other angular  modules/component that is required for the application to function effectively.
here we have two modules that are imported which include:
    1. appRoute Module
    2. shared Module

# Breakdown of the  modules/components and services
## App component modules:
this component content the logic enable access to the login, testing connectivity with user and the application most so deals with rendering of template and logic to the browser and main.ts respectively which content the following:
1. metadata => app-root: This is what is been enbeded in the main.ts and index.html that enablel the rendering of both logic and template of the system.
2. has properties with several parameters
3. it also has one method that as a return value or type of void