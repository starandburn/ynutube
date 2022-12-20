'use strict';

class ActiveCanvas extends Canvas {

    SKIP_FRAME_AUTO = -1; // オートフレームスキップの値
    DEFAULT_MAX_FPS = 60; // 最大FPS
    DEFAULT_SKIP_FRAME = this.SKIP_FRAME_AUTO; // フレームスキップのデフォルト値 

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

        super(element, width, height, backgroundColor, true);

        this.isDebugMode = isDebugMode;
        this.maxFps = Math.max(1, parseInt(maxFps) || this.DEFAULT_MAX_FPS);
        this._skipFrame = parseInt(skipFrame) ?? this.DEFAULT_SKIP_FRAME;
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
