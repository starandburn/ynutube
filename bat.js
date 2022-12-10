'use strict';

const BAT_MIN_SCALE = 0.1;
const BAT_MAX_SCALE = 1.5

class Bat extends TransitionSprite {

    constructor(tile, x, y) {

        super(tile, x, y, 0, 0, 1, 1, 1, 20, 1, 10, true, false, 0, false);

        this.setBaseCenter();
        this.scale = BAT_MIN_SCALE;

        this._isFowarding = true;
        this.visible = true;

        this._originX = x;
        this._originY = y;

        this._directionX = 1;

    }

    refreshTile(tile) {
        this.tile = tile;
    }

    update(stepFrame = 1) {
        super.update(stepFrame);
        if (!this.visible) return;

        let scale = this.scaleX * (this._isFowarding ? 1.1 : 0.9);
        if (scale >= BAT_MAX_SCALE) {
            this._isFowarding = false;
            scale = BAT_MAX_SCALE;
        } else if (scale <= BAT_MIN_SCALE) {
            scale = 0
            this.visible = false;
            this.dispose();
            return;
        }
        if (!this._isFowarding) this.alpha *= scale;
        this.y = this._originY + this._currentPattern * scale * 2;

        if (Math.random() * 100 < 10) this._directionX *= -1;
        this.x += this._directionX * scale * Math.random() * 10;

        this.scale = scale;
        // this.scale = 1.0;
    }
}