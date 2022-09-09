import { Directive, EventEmitter, Output, Input, OnInit } from '@angular/core';

//
// Main recpatcha object
//
declare var grecaptcha: any;

//
// Directive used to render and respond to the recaptcha
//
@Directive({
    selector: '[ng2GoogleRecaptchaRender]',
})
export class RenderRecaptchaDirective implements OnInit {

    @Output('onCaptchaComplete') onCaptchaComplete: EventEmitter<any> = new EventEmitter();

    @Input('siteKey') siteKey: string = null;
    @Input('captchaStyle') captchaStyle: any = null;

    @Input('renderDelay') renderDelay: number = 0;

    @Input('recaptchaId') recaptchaId: string = null;

    private recaptchaRenderElement: any = null;

    //
    // Element has been initialised
    //
    ngOnInit() {

        // We can't render the recaptcha straight away
        setTimeout(() => {

            // Build up the style of the recaptcha and render
            let recaptchaStyle = this.buildRecaptchaProperties();
            let recaptchaElement = document.getElementById(this.recaptchaId);

            let script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            let self = this;
            script.onload = function(){
                setTimeout(function(){
                    self.recaptchaRenderElement = grecaptcha.render(recaptchaElement, recaptchaStyle);
                }, 1000);
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        }, this.renderDelay);

    };

    //
    // Resets the reCAPTCHA instance and requires the user to revalidate
    //
    resetRecaptcha() {
        // Expire the current instance
        this.onRecaptchaExpired();
    }

    //
    // Builds up the style of the recaptcha
    //
    private buildRecaptchaProperties() {

        let recaptchaProperties: any = {};

        // Know properties
        recaptchaProperties['sitekey'] = this.siteKey;
        recaptchaProperties['callback'] = (data: string) => this.onCaptchaComplete.emit(data);
        recaptchaProperties['expired-callback'] = () => this.onRecaptchaExpired();

        // Build up the optional properties
        if (this.captchaStyle !== null) {

            if (this.captchaStyle.theme != null) {
                recaptchaProperties['theme'] = this.captchaStyle.theme;
            }
            if (this.captchaStyle.type != null) {
                recaptchaProperties['type'] = this.captchaStyle.type;
            }
            if (this.captchaStyle.size != null) {
                recaptchaProperties['size'] = this.captchaStyle.size;
            }
            if (this.captchaStyle.tabindex != null) {
                recaptchaProperties['tabindex'] = this.captchaStyle.tabindex;
            }
        }

        return recaptchaProperties;
    }

    //
    // Called when a recaptcha has expired
    //
    private onRecaptchaExpired() {

        // Check we have an element
        if (this.recaptchaRenderElement === null) {
            return;
        }

        // Reset the recaptcha
        grecaptcha.reset(this.recaptchaRenderElement);
        this.onCaptchaComplete.emit(null);
    }
}
