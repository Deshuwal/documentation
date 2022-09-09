"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interval_1 = require("./interval");
var interval_2 = require("./interval");
var Transition;
(function (Transition) {
    Transition[Transition["EaseOut"] = 0] = "EaseOut";
    Transition[Transition["EaseIn"] = 1] = "EaseIn";
    Transition[Transition["EaseInOut"] = 2] = "EaseInOut";
})(Transition = exports.Transition || (exports.Transition = {}));
var Style;
(function (Style) {
    Style[Style["Linear"] = 0] = "Linear";
    Style[Style["Quadratic"] = 1] = "Quadratic";
    Style[Style["Sine"] = 2] = "Sine";
    Style[Style["Exponential"] = 3] = "Exponential";
    Style[Style["Cubic"] = 4] = "Cubic";
})(Style = exports.Style || (exports.Style = {}));
var Lerp = (function () {
    function Lerp() {
        this.currentTime = 0;
        this.lerpValues = [[0, 0]];
        this.duration = 0;
        this.lerpFunctions = {};
        this.lerpIntervals = new interval_1.Intervals();
        this.clientCallback = null;
        this.transition = Transition.EaseOut;
        this.style = Style.Quadratic;
        this.constructLerpFunctions();
    }
    Lerp.prototype.define = function (lerpValues, duration, transition, style) {
        if (transition === void 0) { transition = Transition.EaseOut; }
        if (style === void 0) { style = Style.Quadratic; }
        this.lerpValues = lerpValues;
        this.duration = duration;
        this.currentTime = 0;
        this.transition = transition;
        this.style = style;
        this.clientCallback = null;
    };
    Lerp.prototype.lerp = function (clientCallback) {
        var _this = this;
        if (this.duration === 0) {
            return;
        }
        if (this.clientCallback !== null) {
            return;
        }
        this.clientCallback = clientCallback;
        this.lerpIntervals.start(function (timeDelta) {
            return _this.intervalCallback(timeDelta);
        });
    };
    Lerp.prototype.pause = function (paused) {
        this.lerpIntervals.pause(paused);
    };
    Lerp.prototype.stop = function (paused) {
        this.lerpIntervals.stop();
        this.clientCallback = null;
    };
    Lerp.prototype.intervalCallback = function (timeDelta) {
        if (this.clientCallback === null) {
            return interval_2.Continuation.Cancel;
        }
        this.currentTime += timeDelta;
        this.currentTime = Math.min(this.currentTime, this.duration);
        var lerpResults = [];
        for (var index = 0; index < this.lerpValues.length; ++index) {
            var currentLerpValues = this.lerpValues[index];
            var functionToCall = this.calculateLerpFunction();
            var lerpDistance = currentLerpValues[1] - currentLerpValues[0];
            var lerpedValue = functionToCall(currentLerpValues[0], lerpDistance, this.duration, this.currentTime);
            lerpResults.push(lerpedValue);
        }
        var currentTime = this.currentTime / this.duration;
        this.clientCallback(lerpResults, currentTime);
        var finished = (currentTime === 1);
        return finished === true ? interval_2.Continuation.Cancel : interval_2.Continuation.Continue;
    };
    Lerp.prototype.calculateLerpFunction = function () {
        var transition = Transition[this.transition];
        var style = Style[this.style];
        var functionName = 'lerpStyle' + transition + style;
        var functionToCall = this.lerpFunctions[functionName];
        return functionToCall;
    };
    Lerp.prototype.constructLerpFunctions = function () {
        var _this = this;
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Quadratic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseOutQuadratic(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Quadratic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInQuadratic(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Quadratic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInOutQuadratic(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Linear]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Linear]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Linear]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleLinear(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Sine]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseOutSine(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Sine]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInSine(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Sine]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInOutSine(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Exponential]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseOutExponential(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Exponential]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInExponential(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Exponential]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInOutExponential(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseOut] + Style[Style.Cubic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseOutCubic(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseIn] + Style[Style.Cubic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInCubic(initial, lerpDistance, duration, currentTime);
            };
        this.lerpFunctions['lerpStyle' + Transition[Transition.EaseInOut] + Style[Style.Cubic]] =
            function (initial, lerpDistance, duration, currentTime) {
                return _this.lerpStyleEaseInOutCubic(initial, lerpDistance, duration, currentTime);
            };
    };
    Lerp.prototype.lerpStyleLinear = function (initial, lerpDistance, duration, currentTime) {
        return ((lerpDistance * currentTime) / duration) + initial;
    };
    Lerp.prototype.lerpStyleEaseOutQuadratic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration;
        return -lerpDistance * currentTime * (currentTime - 2) + initial;
    };
    Lerp.prototype.lerpStyleEaseInQuadratic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration;
        return lerpDistance * currentTime * currentTime + initial;
    };
    Lerp.prototype.lerpStyleEaseInOutQuadratic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return (lerpDistance / 2) * currentTime * currentTime + initial;
        }
        currentTime--;
        return -lerpDistance / 2 * (currentTime * (currentTime - 2) - 1) + initial;
    };
    Lerp.prototype.lerpStyleEaseOutSine = function (initial, lerpDistance, duration, currentTime) {
        return lerpDistance * Math.sin(currentTime / duration * (Math.PI / 2)) + initial;
    };
    Lerp.prototype.lerpStyleEaseInSine = function (initial, lerpDistance, duration, currentTime) {
        return -lerpDistance * Math.cos(currentTime / duration * (Math.PI / 2)) + lerpDistance + initial;
    };
    Lerp.prototype.lerpStyleEaseInOutSine = function (initial, lerpDistance, duration, currentTime) {
        return -lerpDistance / 2 * (Math.cos(Math.PI * currentTime / duration) - 1) + initial;
    };
    Lerp.prototype.lerpStyleEaseOutExponential = function (initial, lerpDistance, duration, currentTime) {
        return lerpDistance * (-Math.pow(2, -10 * currentTime / duration) + 1) + initial;
    };
    Lerp.prototype.lerpStyleEaseInExponential = function (initial, lerpDistance, duration, currentTime) {
        return lerpDistance * Math.pow(2, 10 * (currentTime / duration - 1)) + initial;
    };
    Lerp.prototype.lerpStyleEaseInOutExponential = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return lerpDistance / 2 * Math.pow(2, 10 * (currentTime - 1)) + initial;
        }
        currentTime--;
        return lerpDistance / 2 * (-Math.pow(2, -10 * currentTime) + 2) + initial;
    };
    Lerp.prototype.lerpStyleEaseOutCubic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration;
        currentTime--;
        return lerpDistance * (currentTime * currentTime * currentTime + 1) + initial;
    };
    Lerp.prototype.lerpStyleEaseInCubic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration;
        return lerpDistance * currentTime * currentTime * currentTime + initial;
    };
    Lerp.prototype.lerpStyleEaseInOutCubic = function (initial, lerpDistance, duration, currentTime) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return lerpDistance / 2 * currentTime * currentTime * currentTime + initial;
        }
        currentTime -= 2;
        return lerpDistance / 2 * (currentTime * currentTime * currentTime + 2) + initial;
    };
    return Lerp;
}());
exports.Lerp = Lerp;
//# sourceMappingURL=lerp.js.map