'use strict';

const DOG_PATTERN_COUNT = 20;

// 各フィールドに設定される値
const VALUE_RANDOM = Number.MIN_SAFE_INTEGER;   // ランダム指定の数値

// 向き
const DogDirection = Object.freeze({
    Left : 1,
    Right : 2,
});

// サイズ
const DogSize = Object.freeze({
    Normal : 0,
    Small : 1,
    Big : 2,
    SuperSmall : 3,
    SuperBig : 4,
});


// 速度
const SPEED_MIN = 1;
const SPEED_MAX = 10;
const SPEED_RANGE = (SPEED_MAX - SPEED_MIN + 1);

const DogSpeed = Object.freeze({
    Slow : SPEED_MIN,
    Fast : SPEED_MAX,
    Normal : Math.floor(SPEED_RANGE / 2),
});

// 登場する犬を表すDogクラス（変化スプライトを継承）
class Dog extends TransitionSprite {

    constructor(areaCanvas, srcTiles, kind, x, y, direction, size, speed, startPattern) {

        const tile = srcTiles.get(kind);
        super(tile, x, y, 0, 0, 1, 1, 1, DOG_PATTERN_COUNT, 1, startPattern, true, false, 0, false);

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

    _size;
    set size(value) {
        this._size = value;
        this.height = this.getDrawHeight();
        this.actualScaleY = this.scaleY;
        this.scaleX = this.scaleY;
    }
    get size() { return this._size; }

    _direction;
    set direction(value) {
        this._direction = value;
        // this.hMirror = (value != DIRECTION_LEFT);
        this.hMirror = (value != DogDirection.Left);
    }
    get direction() { return this._direction; }

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
            // case SIZE_NORMAL:
            case DogSize.Normal:
                return height;
            // case SIZE_SMALL:
            case DogSize.Small:
                return height / 2;
            // case SIZE_BIG:
            case DogSize.Big:
                return height * 2;
            // case SIZE_SUPERSMALL:
            case DogSize.SuperSmall:
                return height / 4;
            // case SIZE_SUPERBIG:
            case DogSize.SuperBig:
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
            // case DIRECTION_LEFT:
            case DogDirection.Left:
                this.x -= dx;
                isOut = (this.right < 0);
                break;
            // case DIRECTION_RIGHT:
            case DogDirection.Right:
                this.x += dx;
                isOut = (this.left > this._areaCanvas.right);
                break;
        }

        if (isOut) this.onOutOfCanvas(this);

    }
    onOutOfCanvas = (dog) => { };

    get distanceX() {
        const MIN_DISTANCE = 0.5;
        const MAX_DISTANCE = this.width / 7;
        const tick = (MAX_DISTANCE - MIN_DISTANCE) / SPEED_RANGE;
        let dst = tick * (this.speed - SPEED_MIN) + MIN_DISTANCE;
        return dst;
    }

}
