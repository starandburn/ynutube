'use strict';

class DrawingTile {

    _width;
    _height;
    _tag;

    get width() { return this._width; }
    set width(value) { this._width = value; }
    get height() { return this._height; }
    set height(value) { this._height = value; }

    get tag() { return this._tag; }
    set tag(value) { this._tag = value; }

    getTagString() { return this._tag?.toString().trim(); }

    constructor(width, height, tag) {
        this.width = Math.max(0, width ?? 0);
        this.height = Math.max(0, height ?? 0);
        this.tag = tag ?? null;
    }

    clone() {
        return new DrawingTile(this.width, this.height);
    }

    drawTexts(ctx, text, left, top, color) {
        const lines = text?.split('\n');
        ctx.fillStyle = color;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const measure = ctx.measureText(line);
            const lineHeight = Math.floor((measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent) * 1.1);
            ctx.fillText(line, left, top + lineHeight * i);
        }
    };

    draw(ctx, left, top, width, height, hMirror = false, vMirror = false, alpha = 1.0, offsetX = 0, offsetY = 0) {

        if (width == 0 || height == 0) return;

        let destLeft = left ?? 0;
        let destTop = top ?? 0;

        const destWidth = width || this.width;
        const destHeight = height || this.height;
        const srcLeft = offsetX;
        const srcTop = offsetY;
        const srcWidth = this.width;
        const srcHeight = this.height;

        if (hMirror) destLeft = -destLeft - destWidth;
        if (vMirror) destTop = -destTop - destHeight;

        ctx.save();
        ctx.scale(hMirror ? -1 : 1, vMirror ? -1 : 1);
        ctx.globalAlpha = alpha;

        this.onDraw(ctx, srcLeft, srcTop, srcWidth, srcHeight, destLeft, destTop, destWidth, destHeight);

        ctx.restore();
    }
    onDraw = (ctx, srcLeft, srcTop, srcWidth, srcHeight, destLeft, destTop, destWidth, destHeight) => {};

    trim() {
    }
}

class ShapeTile extends DrawingTile {

    backgroundColor;
    borderColor;
    borderWidth;

    constructor(width, height, backgroundColor, borderColor, borderWidth, tag) {
        super(width, height, tag);
        this.backgroundColor = backgroundColor ?? null;
        this.borderColor = borderColor ?? null;
        this.borderWidth = borderWidth ?? 1;
    }

    clone() {
        return new ShapeTile(this.width, this.height, this.backgroundColor, this.borderColor, this.borderWidth);
    }

    onDraw = (ctx, srcLeft, srcTop, srcWidth, srcHeight, destLeft, destTop, destWidth, destHeight) => {

        ctx.beginPath();
        ctx.rect(destLeft, destTop, destWidth, destHeight);
        if (this.backgroundColor != null) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
        }
        if (this.borderWidth > 0 && this.borderColor != null) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.stroke();
        }
    };
}

class ShadowTile extends DrawingTile {

    scaleX;
    scaleY;
    color;
    alpha;

    constructor(scaleX = 1.0, scaleY = 0.25, color = 'black', alpha = 0.5, tag) {
        super(0, 0, tag);
        this.scaleX = Math.max(0, scaleX);
        this.scaleY = Math.max(0, scaleY);
        this.color = color;
        this.alpha = alpha;
    }

    clone() {
        return  new ShadowTile(this.scaleX, this.scaleY, this.color, this.alpha);
    }

    draw(ctx, sprite, offsetX = 0, offsetY = 0) {
        if (!sprite.visible) return;
        const width = Math.floor(sprite.width * this.scaleX);
        const height = Math.floor(sprite.height * this.scaleY);
        const left = Math.floor((sprite.width - width) / 2 + sprite.left) + offsetX;
        const top = Math.floor(sprite.bottom - height) + (height / 4) + offsetY;
        super.draw(ctx, left, top, width, height, false, false, this.alpha);
    }

    onDraw = (ctx, sl, st, sw, sh, destLeft, destTop, destWidth, destHeight) => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(destLeft + destWidth / 2, destTop + destHeight / 2, destWidth / 2, destHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };
}

class TextTile extends DrawingTile {

    text;
    color;
    backgroundColor;
    font;
    shadow;
    shadowColor;

    constructor(width, height, text, color, backgroundColor, font, shadow, shadowColor) {
        super(width, height);
        this.text = text;
        this.color = color;
        this.backgroundColor = backgroundColor;
        this.font = font;
        this.shadow = shadow || false;
        this.shadowColor = shadowColor || 'black';
    }

    onDraw = (ctx, sl, st, sw, sh, destLeft, destTop, destWidth, destHeight) => {
        ctx.save();
        ctx.beginPath();

        ctx.textBaseline = 'top';
        if (this.font != null && this.font != undefined) ctx.font = this.font;

        if (this.shadow) {
            this.drawTexts(ctx, this.text, destLeft + 1, destTop + 1, this.shadowColor);
        }

        this.drawTexts(ctx, this.text, destLeft, destTop, this.color);

        ctx.closePath();
        ctx.restore();
    };


}

class ImageTile extends DrawingTile {

    left;
    top;
    smoothing;
    #image;
    #trimed;

    get width() { 
        return (this._width || this.#image?.width) ?? 0;
    }
    set width(value) {
        this._width = value ?? null;
    }
    get height() {
        return (this._height || this.#image?.height) ?? 0;
    }
    set height(value) {
        this._height = value ?? null;
    }
    get image() { return this.#image; }

    constructor(image, left, top, width, height, smoothing = true, triming = false) {
        super(width, height);
        this.#image = image || null;
        this.left = left || 0;
        this.top = top || 0;
        this.smoothing = smoothing;
        this.#trimed = false;

        if (triming) this.trim();
    }

    clone(image) {
        return new ImageTile(image || this.#image, this.left, this.top, this._width, this._height, this.smoothing);
    }

    onDraw = (ctx, srcLeft, srcTop, srcWidth, srcHeight, destLeft, destTop, destWidth, destHeight) => {

        if (!(this.#image instanceof Image)) return;

//        ctx.mozImageSmoothingEnabled = this.smoothing;
        ctx.webkitImageSmoothingEnabled = this.smoothing;
        ctx.msImageSmoothingEnabled = this.smoothing;
        ctx.imageSmoothingEnabled = this.smoothing;

        ctx.drawImage(this.#image,
            this.left + srcLeft,
            this.top + srcTop,
            srcWidth,
            srcHeight,
            destLeft, 
            destTop,
            destWidth, 
            destHeight,
        );
    };

    trim() {

        if (this.#trimed) return;

        let newLeft = this.left;
        let newTop = this.top;
        let newRight = this.left + this.width - 1;
        let newBottom = this.top + this.height - 1;

        const promise = new Promise((resolve) => {

            const width = this.width;
            const height = this.height;
            const cvs = document.createElement('canvas');
            cvs.width = width;
            cvs.height = height;

            const ctx = cvs.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(this.#image, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height).data;
            const get = (x, y) => {
                return imageData[(y * width + x) * 4 + 3];
            };
    
            // 左
            newLeft = width - 1;
            for (let x = 0; x < newLeft; x++) {
                for (let y = 0; y < height; y++) {
                    const alpha = get(x, y);
                    if (alpha > 0) {
                        newLeft = x;
                        break;
                    }
                }
            }

            // 右
            newRight = newLeft;
            for (let x = width - 1; x > newRight; x--) {
                for (let y = 0; y < height; y++) {
                    const alpha = get(x, y);
                    if (alpha > 0) {
                        newRight = x;
                        break;
                    }
                }
            }

            // 上
            newTop = height - 1;
            for (let y = 0; y < newTop; y++) {
                for (let x = newLeft; x <= newRight; x++) {
                    const alpha = get(x, y);
                    if (alpha > 0) {
                        newTop = y;
                        break;
                    }
                }
            }
            
            // 下
            newBottom = newTop;
            for (let y = height - 1; y > newBottom; y--) {
                for (let x = newLeft; x <= newRight; x++) {
                    const alpha = get(x, y);
                    if (alpha > 0) {
                        newBottom = y;
                        break;
                    }
                }
            }

            resolve();
        });

        promise.then(() => {

            this.left = newLeft;
            this.top = newTop;
            this.width =  newRight - newLeft + 1;
            this.height = newBottom - newTop + 1;

            this.#trimed = true;

        });

    }

}

let _spriteSerialNo_ = 0;

class Sprite {

    _tile = null;
    x;
    y;
    baseX;
    baseY;
    row;
    col;
    alpha;
    serialNo
    scaleX;
    scaleY;
    hMirror;
    vMirror;
    transparent;
    backgroundColor;
    visible;
    tag;
    _disposed = false;

    set tile(value) {
        if (value instanceof DrawingTile) this._tile = value;
    }
    get tile() { return this._tile; }

    set image(value) {
        if (value instanceof Image) this._tile = new ImageTile(value);
    }
    get image() { return this.tile.image; }

    setSource(tileOrImage) {
        if (tileOrImage instanceof Image) {
            this.image = tileOrImage;
        } else if (tileOrImage instanceof DrawingTile) {
            this.tile = tileOrImage;
        } else {
            this._tile = null;
        }
    }

    constructor(tileOrImage, x = 0, y = 0, baseX = 0, baseY = 0, row = 1,  col = 1, alpha = 1.0) {
        this.setSource(tileOrImage);
        this.moveAt(x, y);
        this.setBasePoint(baseX, baseY);
        this.setRowCol(row, col);
        this.setScale(1.0);
        this.setMirror(false, false);
        this.setVisible(true);
        this.setAlpha(alpha);
        this.setBackground(true, 'black');
        this.setLayer();
        this.clearTag();
        this._disposed = false;
    }

    dispose() {
        this._disposed = true;
        this._tile = null;
        this.hide();
        this.moveAt();
        this.setBasePoint();
        this.setRowCol();
        this.setScale();
        this.setMirror();
        this.setAlpha();
        this.setBackground();
        this.setLayer();
    }

    get enabled() { return !this._disposed; }
    get disposed() { return this._disposed; }

    generateNewSerialNo() {
        if (_spriteSerialNo_ >= Number.MAX_SAFE_INTEGER) _spriteSerialNo_ = 0;
        _spriteSerialNo_++;
        this.serialNo = _spriteSerialNo_;
    }

    clone(newTileOrImage, newX, newY, newTag) {

        const newOne = new Sprite(
            newTileOrImage || this._tile,
            (newX == undefined) ? this.x : newX, 
            (newY == undefined) ? this.y : newY, 
            this.baseX, 
            this.baseY, 
            this.row, 
            this.col,
            this.alpha, 
        );

        newOne.setScale(this.scaleX, this.scaleY);
        newOne.setMirror(this.hMirror, this.vMirror);
        newOne.setBackground(this.transparent, this.backgroundColor);
        newOne.setVisible(this.visible);
        newOne.setTag(newTag);

        return newOne;
    }

    getRectangle() { return [this.left, this.top, this.width, this.height]; }
    getSize() { return [this.width, this.height]; }
    getLeftTop() { return [this.left, this.top]; }
    getLocation() { return [this.x, this.y]; }

    moveAt(x, y) {
        this.x = (x ?? 0);
        this.y = (y ?? 0);
        return this;
    }

    move(dx, dy) {
        this.x += (dx ?? 0);
        this.y += (dy ?? 0);
        return this;
    }

    moveRight(dx) { return this.move(dx); }
    moveLeft(dx) { return this.move(-dx); }
    moveUp(dy) { return this.move(0, -dy); }
    moveDown(dy) { return this.move(0, dy); }

    setBasePoint(x, y) {
        this.baseX = x ?? 0;
        this.baseY = y ?? 0;
        return this;
    }

    setRowCol(row, col) {
        this.row = Math.max(1, row ?? 0);
        this.col = Math.max(1, col ?? 0);
        return this;
    }

    setMirror(horizontal = false, vertical = false) {
        this.hMirror = horizontal;
        this.vMirror = vertical;
        return this;
    }

    invertHMirror() { 
        this.hMirror = !this.hMirror;
        return this;
    }

    invertVMirror() {
        this.vMirror = !this.vMirror;
        return this;
    }

    setScale(x = 1.0, y) {
        this.scaleX = Math.max(0, Math.abs(x));
        this.scaleY = Math.max(0, Math.abs((y == undefined) ? x : y));
        return this;
    }

    setAlpha(alpha) { 
        this.alpha = Math.max(0.0, Math.min(1.0, alpha)); 
        return this;
    }

    setBackground(transparent = true, bgcolor = 'black') {
        this.transparent = transparent;
        this.backgroundColor = bgcolor;
        return this;
    }

    setVisible(visible = true) {
         this.visible = visible; 
         return this;
    }

    setTag(tag) { 
        this.tag = tag ?? null; 
        return this;
    }

    clearTag() { 
        this.tag = null; 
        return this;
    }

    getTagText() { return this.tag?.toString().trim() ?? ''; }

    show() { return this.setVisible(true); }
    hide() { return this.setVisible(false); }

    get hasImage() { return this._tile instanceof DrawingTile; }

    get srcWidth() { return (this.hasImage ? this._tile.width : 0); }
    get srcHeight() { return (this.hasImage ? this._tile.height : 0); }

    get width() { return this.srcWidth * this.scaleX; }
    set width(value) { this.scaleX = value / (this.hasImage ? this.srcWidth : 1); }

    get height() { return this.srcHeight * this.scaleY; }
    set height(value) { this.scaleY = value / (this.hasImage ? this.srcHeight : 1); }    

    get halfWidth() { return Math.round(this.width / 2); }
    get halfHeight() { return Math.round(this.height / 2); }

    set scale(value) {
        this.setScale(value, value);
    }

    get left() { return this.x - this.originX; }
    get top() {  return this.y - this.originY; }
    get right() { return this.left + this.width - 1; }
    get bottom() { return this.top + this.height - 1; }

    get centerX() { return this.left + this.width / 2; }
    get centerY() { return this.top + this.height / 2; }

    get originX() { return this.baseX * this.scaleX; }
    get originY() { return this.baseY * this.scaleY; }

    setBaseTop() { this.baseY = 0; }
    setBaseLeft() { this.baseX = 0; }
    setBaseBottom() { this.baseY = this.srcHeight - 1; }
    setBaseRight() { this.baseX = this.srcWidth - 1; }
    setBaseHCenter() { this.baseX = this.srcWidth / 2; }
    setBaseVCenter() { this.baseY = this.srcHeight / 2; }
    setBaseTopLeft() {
        this.setBaseTop();
        this.setBaseLeft();
    } 
    setBaseBottomRight() {
        this.setBaseBottom();
        this.setBaseRight();
    }
    setBaseCenter() {
        this.setBaseHCenter();
        this.setBaseVCenter();
    }
    setBaseBottomCenter() {
        this.setBaseBottom();
        this.setBaseHCenter();
    }

    _fillBackground(ctx) {
        ctx.save();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.restore();
    }

    _drawDebugInfo(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#999999';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(this.left, this.top, this.width, this.height);

        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([]);
        ctx.moveTo(this.left + this.baseX * this.scaleX - 4, this.top + this.baseY * this.scaleY);
        ctx.lineTo(this.left + this.baseX * this.scaleX + 4, this.top + this.baseY * this.scaleY);
        ctx.moveTo(this.left + this.baseX * this.scaleX, this.top + this.baseY * this.scaleY - 4);
        ctx.lineTo(this.left + this.baseX * this.scaleX, this.top + this.baseY * this.scaleY + 4);
        ctx.stroke();

        // ctx.font = '12px Arial';
        let text = '';
        if (this.row > 1) text = `r${this.row}`;
        if (this.col > 1) text += `c${this.col}`;

        const rcText = new TextTile(0, 0, text, '#0000ff', null, '12px Arial', true);
        rcText.draw(ctx, this.left, this.top + 12);

        text = `${this.getTagText()}(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`;
        const inofoText = new TextTile(0, 0, text, '#00ff00', null, '12px Arial', true);
        inofoText.draw(ctx, this.left, this.bottom);

        ctx.closePath();
        ctx.restore();
    }

    render(ctx, debug = false) {

        if (this.isNoNeedRender(ctx)) return;
        if (!this.transparent) this._fillBackground(ctx);

        if (this.hasImage) {
            this._tile.draw(ctx, 
                this.left, 
                this.top, 
                this.width, 
                this.height, 
                this.hMirror, 
                this.vMirror,
                this.alpha,
                this.srcWidth * (this.getSrcCol() - 1),
                this.srcHeight * (this.getSrcRow() - 1),
            );
        }

        if (debug) this._drawDebugInfo(ctx);
    }

    setLayer(value = 0) { this.layer = value; }
    bringToFront() { this.layer = Number.MIN_SAFE_INTEGER; }
    sendToBack() { this.layer = Number.MAX_SAFE_INTEGER; }

    getSrcCol() { return this.col; }
    getSrcRow() { return this.row; }

    isOutOfBounds(width, height) {
        return (this.right < 0 || this.bottom < 0 || this.left >= width || this.top >= height);
    }
    isNoNeedRender(ctx) {
        if (!this.visible || this.alpha <= 0 || this._disposed) return true;
        if (this.isOutOfBounds(ctx.canvas.width, ctx.canvas.height)) return true; 
        return false;
    }

}


// パターン遷移を行うスプライト
class TransitionSprite extends Sprite {

    patternCount;
    delayFrame;
    startPattern;
    roundTrip;
    reverse;
    repeat;
    hideWhenFinish;

    _currentPattern;
    _currentFrame;
    _cycleCount;
    _patternDistance;
    _paused = false;

    constructor(
                tileOrImage, 
                x = 0, 
                y = 0, 
                baseX = 0, 
                baseY = 0, 
                row = 1, 
                col = 1,
                alpha = 1.0, 
                patternCount = 1, 
                delayFrame = 1, 
                startPattern = 0, 
                roundTrip = false, 
                reverse = false, 
                repeat = 0, 
                hideWhenFinish = false
               ) {
        super(tileOrImage, x, y, baseX, baseY, row, col, alpha);

        this.patternCount = Math.max(1, patternCount);
        this.delayFrame = Math.max(1, delayFrame);
        this.startPattern = Math.max(0, Math.min(startPattern, this.maxPattern));
        this.roundTrip = roundTrip;
        this.reverse = reverse;
        this.repeat = repeat;
        this.hideWhenFinish = hideWhenFinish;
        this.resetTransition();
    }

    clone(newTileOrImage, newX, newY, newTag) {

        const newOne = new TransitionSprite(
            newTileOrImage || this._tile,
            (newX == undefined) ? this.x : newX, 
            (newY == undefined) ? this.y : newY, 
            this.baseX, 
            this.baseY, 
            this.row, 
            this.col,
            this.alpha, 
            this.patternCount, 
            this.delayFrame, 
            this.startPattern, 
            this.roundTrip, 
            this.reverse, 
            this.repeat, 
            this.hideWhenFinish
        );

        newOne.setScale(this.scaleX, this.scaleY);
        newOne.setMirror(this.hMirror, this.vMirror);
        newOne.setBackground(this.transparent, this.backgroundColor);
        newOne.setVisible(this.visible);
        newOne.setLayer(this.layer);
        newOne.setTag(newTag);

        return newOne;
    }

    get maxPattern() { return this.patternCount - 1; }

    setPattern(pattern) {
        if (pattern == undefined || pattern == null) return;
        this._currentPattern = Math.max(0, Math.min(this.maxPattern , pattern));
    }

    pause(pattern) {
        this._paused = true;
        this.setPattern(pattern);
    }

    restart(pattern) {
        this._paused = false;
        this.setPattern(pattern);
    }

    update(stepFrame = 1)
    {
        if (this._paused) return;
        for (let i = 0; i < stepFrame; i++){
            this._currentFrame++;
            if (this._currentFrame % this.delayFrame == 0){
                this.changeNextPattern();
                this._currentFrame = 0;
            }
        }
    }

    changeNextPattern(){
        if (this._patternDistance == 0) return;
        const prevPattern = this._currentPattern;
        this._currentPattern += this._patternDistance;
        if (this._currentPattern >= this.patternCount || this._currentPattern < 0) {
            if (this.roundTrip) {
                this._patternDistance *= -1;
                this._currentPattern += this._patternDistance * 2;
            } else {
                this._currentPattern = (this.reverse ? this.patternCount - 1 : 0);
            }
        }
        if (this.repeat > 0 && this._currentPattern == this.startPattern && this._patternDistance == (this.reverse ? -1 : 1)) {
            this._cycleCount++;
            if (this._cycleCount >= this.repeat) {
                this._patternDistance = 0;
                if (!this.roundTrip) this._currentPattern = prevPattern;
                if (this.hideWhenFinish) this.visible = false;
            }
        }
    }

    resetTransition() {
        this.setPattern(this.startPattern);
        this._currentPattern = this.startPattern;
        this._currentFrame = 0;
        this._cycleCount = 0;
        this._patternDistance = (this.reverse ? -1 : 1);
        this._paused = false;
    }
    
    _drawDebugInfo(ctx) {
        super._drawDebugInfo(ctx);
        ctx.save();
        if (this.patternCount > 1) {
            ctx.font = '12px Arial';
            const text = `${this._currentPattern}`;
            const patternText =  new TextTile(0, 0, text, '#00ffff', null, '12px Arial', true);
            patternText.draw(ctx, this.left, this.top);
        }
        ctx.restore();
    }

}

class AnimationSprite extends TransitionSprite {
    constructor(
        tileOrImage, 
        x = 0, 
        y = 0, 
        baseX = 0, 
        baseY = 0, 
        row = 1, 
        col = 1,
        alpha = 1.0, 
        patternCount = 1, 
        delayFrame = 1, 
        startPattern = 0, 
        roundTrip = false, 
        reverse = false, 
        repeat = 0, 
        hideWhenFinish = false
       ) {
        super(tileOrImage, x, y, baseX, baseY, row, col, alpha, patternCount, delayFrame, startPattern, roundTrip, reverse, repeat, hideWhenFinish);
    }

    clone(newTileOrImage, newX, newY, newTag) {

        const newOne = new AnimationSprite(
            newTileOrImage || this._tile,
            (newX == undefined) ? this.x : newX, 
            (newY == undefined) ? this.y : newY, 
            this.baseX, 
            this.baseY, 
            this.row, 
            this.col,
            this.alpha, 
            this.patternCount, 
            this.delayFrame, 
            this.startPattern, 
            this.roundTrip, 
            this.reverse, 
            this.repeat, 
            this.hideWhenFinish
        );

        newOne.setScale(this.scaleX, this.scaleY);
        newOne.setMirror(this.hMirror, this.vMirror);
        newOne.setBackground(this.transparent, this.backgroundColor);
        newOne.setVisible(this.visible);
        newOne.setLayer(this.layer);
        newOne.setTag(newTag);

        return newOne;
    }

    getSrcCol() { return this.col + this._currentPattern; }
}
