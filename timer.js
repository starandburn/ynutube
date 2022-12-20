'use strict';

class Timer {

    _timerId;
    _interval;
    _count;
    _remain;
    _tick;

    _enabled;
    _paused;

    _action = () => { };

    constructor(interval, count, action) {

        this._interval = interval;
        this._count = Math.max(0, count ?? 0);
        this._action = action;
        this._paused = true;
        this._enabled = false;
        this._tick = 0;

    }

    stop() {
        this._enabled = false;
        this._remain = this._count;
        if (this._timerId != null) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
        this.resetTick();
        this.resume();
    }

    pause() {
        if (this._enabled) {
            this._paused = true;
        } else {
            this.stop();
        }
    }

    resume() {
        this._paused = false;
    }

    start() {
        this.stop();
        this._timerId = setInterval(this._timerHandler.bind(this), this._interval);
        this._enabled = true;
    }

    resetTick() {
        this._tick = 0;
    }

    _timerHandler() {
        if (!this._enabled || this._paused) return;
        if (this._tick >= Number.MAX_SAFE_INTEGER) this.resetTick();
        this?._action(++this._tick, this._remain - 1);
        if (this._count > 0) {
            this._remain--;
            if (this._remain <= 0) {
                this.stop();
            }
        }
    }

}