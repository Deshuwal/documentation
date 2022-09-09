# The AuthModule (Authenitication Module)
this module deals with the user access validation into the system which include both the superuser and the ordinary user, thus testing the validity of the information supplied by user. Thus; this module consist of two module (i.e. shareDirective Module and AuthRouting Module) and five component of which each component consist of a various dependencies 

# breakdown of the modules and components

## auth Routing Module:
this is the entry-point of the auth module that indicate the various path to each component of the module resource, which is a child route path.

    const routes: Routes = [
        {
            path: "signin",
            component: SigninComponent,
        },
        {
            path: "forgot",
            component: ForgotComponent,
        },
        {
            path: "password/:ref",
            component: PasswordComponent,
        },
        .
        .
        .
        //this is the path that a user first land upon loadding the sign in auth
        {
            path: "",
            redirectTo: "signin",
            pathMatch: "full",
        },
    ];
    /**
    * @param  {[RouterModule.forChild(routes)]}
    * @returns RouterModule
    */
    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })

# shared Directive Module:
this is a entry-point to the customized directive module which houses the sub-directive module

    //this are the directive 
    const directives = [
    DropdownAnchorDirective,
    DropdownLinkDirective,
    AppDropdownDirective,
    ScrollToDirective,
    SidebarDirective,
    SidebarContainerDirective,
    SidebarContentDirective,
    SidebarTogglerDirective,
    HighlightjsDirective,
    FullScreenWindowDirective];
    /**
    * @param  {[CommonModule]} import
    * @param  {directives} declarations
    * @param  {directives}} exports
    */
    @NgModule({
        imports: [
            CommonModule
        ],
        declarations: directives,
        exports: directives
    })

## From shared Directive => comfirm Equal Validator Directive:
this is a dependency that is injected from the share directive module folder that, aid in validation of content which has a method validate that return literal type with a null and inputs of valueEqualto injectables method:

    export class ConfirmEqualValidatorDirective implements Validator {
    @Input() valueEqualTo: string;
    validate(control: AbstractControl):{[key:string]: any} |null {
        const controlToCompare = control.parent.get(this.valueEqualTo);
        if(controlToCompare && controlToCompare.value !==control.value){
        return { 'notEqual': true}
        }
        return null;
        }
    }

## 1. Forgot Component: 
this component consist of public properties constructors which help in dependency injection two method:

    // ngoinit() this method initialized the form binding on the template: 
    ngOnInit() {
        this.forgotForm = this.fb.group(
            {phone: [""],
            code: [], 
            password: [], 
            confirm_password: [],});
    }

    //sendResetRequest() this get data from db and return a void: 
    sendResetRequest() {
        this.loading = true;
        const phoneNumber = this.forgotForm.value.phone.trim();
        if (!phoneNumber.length) {
            this.loading = false;
            this.toastService.error("Valid phone number is required.");
            return;
                }
        this.httpService.doGet(`auth/reset_password/${phoneNumber}`).subscribe((res: any) => {this.loading = false;
        this.forgotForm.patchValue({ phone: "" });
        this.toastService.success(res.message, "Successful", {
            timeOut: 60000,
            closeButton: true,
            progressBar: true,
        }); },
        (error) => { this.loading = false;
            let message = error.status == 0
            ? "Connection failed. Please retry!"
            : error.error.message;
        if (error.status == 200) {
            message = "Unexpected error occured. Please retry!";
            }
            this.toastService.error(message, "Error!");
            });
        } 

## 2. forgot Email Component:
this component content the following:
    1. metadata which shows the template and styling and selector
    2. public properties defined
    3. construct that indicate the various injection with it's instances. 
    4. parameters like formbuilder that help to group angular form module, etc
    5. methods with void return type and this method include the ngOnInit() and sendResetRequest()
it has the same method as the one above (forgot component)

## 3. forgot Tin Component:
this component content the following:
    1. metadata which shows the template and styling and selector
    2. public properties defined
    3. construct that indicate the various injection with it's instances. 
    4. parameters like formbuilder that help to group angular form module, etc
    5. methods with void return type and this method include the ngOnInit() and sendResetRequest()
it has the same method as the forgot component

## 4. password Component:
this handles the password check of the application, which has public properties with some methods which include ngOnInit() with an accessor within it that return form control, and also a submitRequest() 
    
    //ngOnInit Method
    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
        this.ref = params.get('ref');
        });

        this.passwordForm = this.formBuilder.group({
        password: ['', Validators.required],
        new_password: ['', Validators.required],
        confirm_new_password: ['', Validators.required],
        });
    }
        // this is the accessor
        get fval() {
        return this.passwordForm.controls;
    }

    //submit method to the server
    submitRequest() {
        this.submitted = true;
        if (this.passwordForm.valid) {
        this.loading = true;
        const data: any = this.passwordForm.value;
        this.httpService
            .doPost(`auth/complete_reset_password/${this.ref}`, data)
            .subscribe(
            (res: any) => {
                this.loading = false;
                this.submitted = false;
                this.passwordForm.patchValue({ password: '', new_password: '', confirm_new_password: '' });
                this.toastService.success(res.message, 'Successful');
                
                setTimeout(() => {
                this.router.navigateByUrl(RoleHome.default);
                }, 5000);
                
            },
            (error: any) => {
                this.loading = false;
                let message =
                error.status == 0
                    ? 'Connection failed. Please retry!'
                    : error.error.message;
                if (error.status == 200) {
                message = 'Unexpected error occured. Please retry!';
                }
                this.toastService.error(message, 'Error!');
            });}
        }
    }

## 5 signin Component:
this component consist of a private property of acceptTermsModal and other properties and also one private method getDisMissReason which return a string and other methods. for more info check it's readme