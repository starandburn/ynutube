'use strict';

// アプリケーションのメインクラス
class Application {

    // 公開定数
    get ASPECT_RATIO_HD() { return (-9 / 16) };
    get ASPECT_RATIO_SD() { return (-3 / 4) };

    // 公開プロパティ
    get isDebugMode() { return this._debugMode; }

    // 内部フィールド
    _promises = [];
    _images = new Map();
    _debugMode = false;

    // コンストラクタ―
    constructor(debugMode = false) {
        this._debugMode = debugMode;
        this._debugMode = getParam('debug') ? true : debugMode;
        this._self = this;
    }

    // 公開メソッド
    // getRandom(min, max) { return Math.floor(Math.random() * (max + 1 - min)) + min; }
    // getRandomSelect(...theArgs) {
    //     return arguments[this.getRandom(0, arguments.length - 1)];
    // }
    // log(...theArgs) {
    //     console.log(...arguments);
    // }

    // overrideConsoleLog(logArea) {
    //     if (!(logArea instanceof HTMLElement)) return;
    //     const origin = console.log;
    //     console.log = function (...args) {
    //         // _originConsoleLog(...args);
    //         // var callerName = null;
    //         // try { throw new Error(); }
    //         // catch (e) {
    //         //     var callerName = 'global';
    //         //     var re = /(\w+)@|at (\w+) \(/g, st = e.stack, m;
    //         //     while (m = re.exec(st)) {
    //         //         callerName = (m != null) ? m[1] || m[2] : 'global';
    //         //     }
    //         // }
    //         origin(...args);
    //         const p = document.createElement('p');
    //         const h = document.createElement('span');
    //         h.classList.add('title');
    //         h.textContent = args[0];
    //         // p.textContent = `[${callerName}]${args.join(' ')}`;

    //         p.appendChild(h)
    //         p.appendChild(document.createTextNode(args.slice(1).join(' ')));

    //         // p.textContent = args.slice(1).join(' ');
    //         logArea.prepend(p);
    //     };
    // }
    

    // getParam(name, url) {
    //     if (!url) url = window.location.href;
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    //     const results = regex.exec(url);

    //     let param;
    //     if (!results) {
    //         param = null;
    //     } else if (!results[2]) {
    //         param = '';
    //     } else {
    //         param = decodeURIComponent(results[2].replace(/\+/g, ' '));
    //     }

    //     console.log('パラメータ取得:', `${name} = ${param ?? ''}`);
    //     return param;
    // }


    debugOn() { this.setDebugMode(true); }
    debugOff() { this.setDebugMode(false); }
    debugToggle() { this.setDebugMode(!this.isDebugMode); }

    onChangeDebugMode = (d) => { };
    setDebugMode(value) {
        console.log('デバッグモード切替:', value ? 'on' : 'off');
        this._debugMode = value;
        this.onChangeDebugMode(value);
    }

    prepareImage(id, url) {
        const image = new Image();
        const promise = new Promise((resolve) => {
            image.addEventListener('load', (e) => {
                this._images.set(id, image);
                resolve(`画像ファイル${url}'をロードしました。`);
            });
            image.addEventListener('error', (e) => {
                this._images.set(id, null);
                resolve(`画像ファイル'${url}'のロードに失敗しました。`);
            });
        });
        image.src = url;
        this._promises.push(promise);
    }

    async loadImage(id, url) {
        console.log(id, url);
        const image = new Image();
        image.src = url;
        await new Promise((resolve, reject) => {
            image.addEventListener('load', (e) => {
                resolve(`画像ファイル'${url}'をロードしました。`);
            });
            image.addEventListener('error', (e_1) => {
                image = null;
                reject(`画像ファイル'${url}'のロードに失敗しました。`);
            });
        });
        this._images.set(id, image);
    }

    getImage(id) {
        return this._images.get(id) || null;
    }

    run() {
        const loadWindowPromise = new Promise((resolve) => {
            addEventListener('load', (e) => {
                resolve('画面をロードしました。');
            });
        });
        return Promise.all([loadWindowPromise, ...this._promises]).then(((resolves) => [resolves]).bind(this));
    }
}

class ActiveCanvas extends Canvas {

    // 公開プロパティ
    sprites = [];
    maxFps;
    isDebugMode;

    // 内部フィールド
    _running = false;
    _paused = false;
    _prevTime = 0;
    _totalFrame = 0;
    _totalTime = 0;
    _skipFrame;

    // コンストラクタ―
    constructor(element, width, height, backgroundColor, maxFps, skipFrame, isDebugMode = false) {
        const DEFAULT_MAX_FPS = 60;
        const DEFAULT_SKIP_FRAME = -1;

        super(element, width, height, backgroundColor, true);

        this.isDebugMode = isDebugMode;
        this.maxFps = Math.max(1, parseInt(maxFps) || DEFAULT_MAX_FPS);
        this._skipFrame = parseInt(skipFrame) ?? DEFAULT_SKIP_FRAME;
        this._fpsText = new TextTile(16, 32, '', 'white', null, '16px Arial', true);

        this.start();
    }

    // 公開デリゲート
    onUpdate = (stepFrame) => { };   // 更新処理
    onDraw = (ctx, target, debug) => { };           // 描画処理 
    drawOrders = [];                // 描画順

    // 公開メソッド
    addSprite(sprite, layer) {
        if (layer != undefined || layer != null) sprite.layer = layer;
        this.sprites.push(sprite);
    }
    removeSprite(sprite) {
        const index = this.sprites.indexOf(sprite);
        this.sprites.splice(index, 1);
    }
    clearSprites() {
        this.sprites = [];
    }

    sortByDrawOrder(reverse = false, nonDestructive = false, ignoreLayer = false) {

        const sprites = nonDestructive ? this.sprites.slice() : this.sprites;
        sprites.sort((s1, s2) => {
            for (let order of [(s) => ignoreLayer ? 0 : -s.layer, ...this.drawOrders, (s) => s.serialNo]) {
                if (order) {
                    const v1 = Math.floor(order(s1));
                    const v2 = Math.floor(order(s2));
                    if (v1 > v2) return 1 * (reverse ? -1 : 1);
                    if (v1 < v2) return -1 * (reverse ? -1 : 1);
                }
            }
            return 0;
        });
        return sprites;
    }

    getPointedSprite(x, y, strict = false, ...theArgs) {

        const sprites = this.sortByDrawOrder(true, true);

        for (let sprite of sprites) {

            if (!sprite.visible) continue;
            if (theArgs.includes(sprite)) continue;
            if (strict && sprite.alpha <= 0) continue;

            const rect = new Rectangle();
            rect.fromArray(sprite.getRectangle());

            if (rect.contains(x, y)) {
                if (!strict || !this.useDoubleBuffer) return sprite;

                const ctx = this.getTemporary();
                sprite.render(ctx, false)
                const alpha = ctx.getImageData(x, y, 1, 1).data[3];

                if (alpha > 0) {
                    return sprite;
                    break;
                }
            }
        }
        return null;
    }

    render() {

        this.sortByDrawOrder();
        const ctx = this.beginRender(this.isDebugMode, false);
        this.onDraw(ctx, this, this.isDebugMode);
        if (this.isDebugMode) this._fpsText.draw(ctx, 0, 0);
        this.endRender();

    }

    start() {
        this.stop();

        while (this.clientWidth != this.width) {
            this.beginRender(false, false);
        }

        this._running = true;
        requestAnimationFrame(this._frameLoop.bind(this));
    }

    pause() {
        if (this._running && !this._paused) {
            console.log('pause');
            this._paused = true;
            requestAnimationFrame(this._frameLoop.bind(this));
        }
    }

    resume() {
        if (this._running && this._paused) {
            console.log('resume');
            this._paused = false;
            this._prevTime = -1;
            requestAnimationFrame(this._frameLoop.bind(this));
        } else {
            this.restart();
        }
    }

    stop() {
        this._prevTime = 0;
        this._totalFrame = 0;
        this._totalTime = 0;
        this._running = false;
        this._paused = false;
        this.sprites = [];

    }

    // 内部メソッド
    _frameLoop(currentTime) {

        if (this._paused) {
            this._fpsText.text = 'PAUSE';
            this.render(this.isDebugMode);
            return;
        }

        let elapsedSec = (currentTime - this._prevTime) / 1000;

        this._totalFrame++;
        if (this._totalFrame == Number.MAX_SAFE_INTEGER) this._totalFrame = 0;

        let stepFrame = this._skipFrame >= 0 ? this._skipFrame + 1 : Math.round(elapsedSec * this.maxFps);

        if (this._prevTime < 0) {
            this._prevTime = currentTime;
            stepFrame = 1;
            elapsedSec = 1;
        } else if (elapsedSec >= (1 / this.maxFps)) {
            this._totalTime += (currentTime - this._prevTime) / 1000;
            if (this._totalTime >= Number.MAX_SAFE_INTEGER) this.totalTime = 0;
            this._prevTime = currentTime;
        } else {
            stepFrame = 0;
        }

        if (stepFrame > 0) {

            const fps = Math.round(1 / elapsedSec);

            this.onUpdate(stepFrame);

            for (let sprite of this.sprites) {

                if (sprite.disposed) {
                    this.removeSprite(sprite);
                    continue;
                }

                if (sprite instanceof TransitionSprite) {
                    sprite.update(stepFrame);
                }
            }

            this._fpsText.text = `${fps.toFixed(2)}/${this.maxFps.toFixed(0)}fps(${stepFrame - 1} frame skip)`;
            this.render(this.isDebugMode);

        }

        if (this._running) requestAnimationFrame(this._frameLoop.bind(this));
    }

}


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