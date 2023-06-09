'use strict';

// 各フィールドに設定される値
const Dog = Object.freeze({
    RandomValue: Number.MIN_SAFE_INTEGER,
    PatternCount: 20,
    Direction: {
        Left: 1,
        Right: 2,
    },
    Size: {
        Normal: 0,
        Small: 1,
        Big: 2,
        SuperSmall: 3,
        SuperBig: 4,
    },
    Speed: {
        Range: 10,
        Slow: -1,
        Fast: -2,
        Normal: 0,
    },
});

// 登場する犬を表すDogクラス（変化スプライトを継承）
class DogSprite extends TransitionSprite {

    constructor(areaCanvas, srcTiles, kind, x, y, direction, size, speed, startPattern) {

        const tile = srcTiles.get(kind);
        super(tile, x, y, 0, 0, 1, 1, 1, Dog.PatternCount, 1, startPattern, true, false, 0, false);

        this._areaCanvas = areaCanvas ?? null;
        this._srcTiles = srcTiles ?? null;

        this.direction = direction;
        this.size = size;
        this.speed = speed;
        this.kind = kind;

        this.setBaseBottomCenter();
        this.actualScaleY = this.scaleY;

        this.debugInfo = new TextTile(0, 0, null, '#ffffff', null, this._areaCanvas.createFont(16), true);
    }

    get actualHeight() { return this.srcHeight * this.actualScaleY; }

    get areaWidth() { return ((this._areaCanvas?.width) ?? 0); }
    get areaHeight() { return ((this._areaCanvas?.height) ?? 0); }

    #size;
    set size(value) {
        this.#size = value;
        this.height = this.getDrawHeight();
        this.actualScaleY = this.scaleY;
        this.scaleX = this.scaleY;
    }
    get size() { return this.#size; }

    #direction;
    set direction(value) {
        this.#direction = value;
        this.hMirror = (value != Dog.Direction.Left);
    }
    get direction() { return this.#direction; }

    render(ctx, debug = false) {
        this.scaleY = this.actualScaleY - (this._currentPattern / 1000);
        super.render(ctx, debug);
        this.scaleY = this.actualScaleY;
    }

    kindTranslate = (k) => k;
    directionTranslate = (d) => d;
    sizeTranslate = (s) => s;
    speedTranslate = (s) => s;

    _drawDebugInfo(ctx) {
        super._drawDebugInfo(ctx);
        let text = `種類:${this.kindTranslate(this.kind)}\n`;
        text += `向き:${this.directionTranslate(this.direction)}\n`;
        text += `サイズ:${this.sizeTranslate(this.size)}\n`;
        text += `スピード:${this.speedTranslate(this.speed)}\n`;

        this.debugInfo.text = text;
        this.debugInfo.draw(ctx, this.right, this.bottom - this.actualHeight);
    }

    getDrawHeight() {
        const height = this.areaHeight / 5;
        switch (this.size) {
            case Dog.Size.Normal:
                return height;
            case Dog.Size.Small:
                return height / 2;
            case Dog.Size.Big:
                return height * 2;
            case Dog.Size.SuperSmall:
                return height / 4;
            case Dog.Size.SuperBig:
                return this.areaHeight;
            default:
                return height;
        }
    }

    refreshTile() {
        this.tile = this._srcTiles.get(this.kind);
    }

    update(stepFrame = 1) {
        super.update(stepFrame);

        if (!this.visible) return;

        this.vMirror = false;
        const dx = this.distanceX * stepFrame;

        let isOut = false;
        switch (this.direction) {
            case Dog.Direction.Left:
                this.x -= dx;
                isOut = (this.right < 0);
                break;
            case Dog.Direction.Right:
                this.x += dx;
                isOut = (this.left > this._areaCanvas.right);
                break;
        }

        if (isOut) this.onOutOfCanvas(this);

    }
    onOutOfCanvas = (dog) => { };

    get distanceX() {
        let value = this.speed;
        if (value < 1) {
            switch (value) {
                case Dog.Speed.Slow:
                    value = 1;
                    break;
                case Dog.Speed.Fast:
                    value = Dog.Speed.Range;
                    break;
                default:
                    value = Dog.Speed.Range / 2;
            }
        }
        return (this.width / (Dog.Speed.Range || 1)) * (value / 8);
    }

}
