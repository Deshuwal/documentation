export declare enum Transition {
    EaseOut = 0,
    EaseIn = 1,
    EaseInOut = 2,
}
export declare enum Style {
    Linear = 0,
    Quadratic = 1,
    Sine = 2,
    Exponential = 3,
    Cubic = 4,
}
export declare class Lerp {
    private currentTime;
    private lerpValues;
    private duration;
    private lerpFunctions;
    private lerpIntervals;
    private clientCallback;
    private transition;
    private style;
    constructor();
    define(lerpValues: number[][], duration: number, transition?: Transition, style?: Style): void;
    lerp(clientCallback: (results: number[], time: number) => void): void;
    pause(paused: boolean): void;
    stop(paused: boolean): void;
    private intervalCallback(timeDelta);
    private calculateLerpFunction();
    private constructLerpFunctions();
    private lerpStyleLinear(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseOutQuadratic(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInQuadratic(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInOutQuadratic(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseOutSine(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInSine(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInOutSine(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseOutExponential(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInExponential(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInOutExponential(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseOutCubic(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInCubic(initial, lerpDistance, duration, currentTime);
    private lerpStyleEaseInOutCubic(initial, lerpDistance, duration, currentTime);
}
