"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Continuation;
(function (Continuation) {
    Continuation[Continuation["Continue"] = 0] = "Continue";
    Continuation[Continuation["Cancel"] = 1] = "Cancel";
})(Continuation = exports.Continuation || (exports.Continuation = {}));
var Intervals = (function () {
    function Intervals() {
        this.setIntervalHandle = null;
        this.setIntervalLastTime = 0;
        this.paused = false;
        this.clientCallbacks = [];
    }
    Object.defineProperty(Intervals, "DEFAULT_MILLISECOND_INTERVAL", {
        get: function () { return 33; },
        enumerable: true,
        configurable: true
    });
    Intervals.prototype.start = function (clientCallback) {
        var _this = this;
        this.clientCallbacks.push(clientCallback);
        if (this.setIntervalHandle !== null) {
            return;
        }
        this.setIntervalLastTime = (new Date()).getTime();
        this.setIntervalHandle = setInterval(function () { return _this.setIntervalCallback(); }, Intervals.DEFAULT_MILLISECOND_INTERVAL);
    };
    Intervals.prototype.stop = function () {
        this.clientCallbacks = [];
        this.paused = false;
        if (this.setIntervalHandle === null) {
            return;
        }
        clearInterval(this.setIntervalHandle);
        this.setIntervalHandle = null;
    };
    Intervals.prototype.pause = function (pause) {
        this.paused = pause;
    };
    Intervals.prototype.setIntervalCallback = function () {
        if (this.setIntervalHandle === null) {
            return;
        }
        var currentTime = (new Date()).getTime();
        var timeDelta = (currentTime - this.setIntervalLastTime) / 1000;
        if (this.paused === false) {
            var currentCallbacks = [];
            for (var i = 0; i < this.clientCallbacks.length; ++i) {
                currentCallbacks.push(this.clientCallbacks[i]);
            }
            for (var i = 0; i < currentCallbacks.length; i++) {
                var thisCallback = currentCallbacks[i];
                var continueWithInterval = thisCallback(timeDelta);
                if (continueWithInterval === Continuation.Cancel) {
                    var callbackIndex = this.clientCallbacks.indexOf(thisCallback);
                    if (callbackIndex !== -1) {
                        this.clientCallbacks.splice(callbackIndex, 1);
                    }
                }
            }
        }
        this.setIntervalLastTime = currentTime;
        if (this.clientCallbacks.length === 0) {
            this.stop();
        }
    };
    return Intervals;
}());
exports.Intervals = Intervals;
//# sourceMappingURL=interval.js.map