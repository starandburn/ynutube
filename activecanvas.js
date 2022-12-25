'use strict';

class ActiveCanvas extends Canvas {

    #SKIP_FRAME_AUTO = -1; // オートフレームスキップの値

    #Default = Object.freeze({
        MaxFps : 60,
        SkipFrame: this.#SKIP_FRAME_AUTO,
    });

    // 公開プロパティ
    sprites = [];
    maxFps;
    isDebugMode;

    // 内部フィールド
    #running = false;
    #paused = false;
    #prevTime = 0;
    #totalFrame = 0;
    #totalTime = 0;
    #skipFrame;
    #fpsText = null;

    // コンストラクタ―
    constructor(element, width, height, backgroundColor, maxFps, skipFrame, isDebugMode = false) {

        super(element, width, height, backgroundColor, true);

        this.isDebugMode = isDebugMode;
        this.maxFps = Math.max(1, parseInt(maxFps) || this.#Default.MaxFps);
        this.#skipFrame = parseInt(skipFrame) ?? this.#Default.SkipFrame;
        this.#fpsText = new TextTile(16, 32, '', 'white', null, '16px Arial', true);

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
        this.sprites.splice(0);
    }

    getPointedSprite(x, y, strict = false, ...theArgs) {

        const sprites = this.#sortByDrawOrder(true, true);

        for (let sprite of sprites) {

            if (!sprite.visible) continue;
            if (theArgs.includes(sprite)) continue;
            if (strict && sprite.alpha <= 0) continue;

            const rect = new Rectangle();
            rect.fromArray(sprite.getRectangle());

            if (rect.contains(x, y)) {
                if (!strict || !this.hasDoubleBuffer) return sprite;

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

        this.#sortByDrawOrder();
        const ctx = this.beginRender(this.isDebugMode, false);
        this.onDraw(ctx, this, this.isDebugMode);
        if (this.isDebugMode) this.#fpsText.draw(ctx, 0, 0);
        this.endRender();

    }

    start() {
        this.stop();

        while (this.clientWidth != this.width) {
            this.beginRender(false, false);
        }

        this.#running = true;
        requestAnimationFrame(this.#frameLoop.bind(this));
    }

    pause() {
        if (this.#running && !this.#paused) {
            console.log('pause');
            this.#paused = true;
            requestAnimationFrame(this.#frameLoop.bind(this));
        }
    }

    resume() {
        if (this.#running && this.#paused) {
            console.log('resume');
            this.#paused = false;
            this.#prevTime = -1;
            requestAnimationFrame(this.#frameLoop.bind(this));
        } else {
            this.restart();
        }
    }

    stop() {
        this.#prevTime = 0;
        this.#totalFrame = 0;
        this.#totalTime = 0;
        this.#running = false;
        this.#paused = false;
        this.sprites = [];

    }

    // 内部メソッド
    #sortByDrawOrder(reverse = false, nonDestructive = false, ignoreLayer = false) {

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

    #frameLoop(currentTime) {

        if (this.#paused) {
            this.#fpsText.text = 'PAUSE';
            this.render(this.isDebugMode);
            return;
        }

        let elapsedSec = (currentTime - this.#prevTime) / 1000;

        this.#totalFrame++;
        if (this.#totalFrame == Number.MAX_SAFE_INTEGER) this.#totalFrame = 0;

        let stepFrame = this.#skipFrame >= 0 ? this.#skipFrame + 1 : Math.round(elapsedSec * this.maxFps);

        if (this.#prevTime < 0) {
            this.#prevTime = currentTime;
            stepFrame = 1;
            elapsedSec = 1;
        } else if (elapsedSec >= (1 / this.maxFps)) {
            this.#totalTime += (currentTime - this.#prevTime) / 1000;
            if (this.#totalTime >= Number.MAX_SAFE_INTEGER) this.totalTime = 0;
            this.#prevTime = currentTime;
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

            this.#fpsText.text = `${fps.toFixed(2)}/${this.maxFps.toFixed(0)}fps(${stepFrame - 1} frame skip)`;
            this.render(this.isDebugMode);

        }

        if (this.#running) requestAnimationFrame(this.#frameLoop.bind(this));
    }

}
