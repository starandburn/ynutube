'use strict';

// １点の座標を表すクラス
class Point {

    x;  // X座標
    y;  // Y座標

    // コンストラクタ（座標を受け取る）
    constructor(x = 0, y = 0) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    fromArray(ary) {
        this.x = ary[0];
        this.y = ary[1];
    }
    ToArray() {
        return [this.x, this.y];
    }

    // 座標移動
    moveVertical(distance) { this.y += distance; }          // 垂直方向
    moveUp(distance) { this.moveVertical(-distance); }      // 上方向
    moveDown(distance) { this.moveVertical(distance); }     // 下方向

    moveHorizontal(distance) { this.x += distance; }          // 水平方向
    moveLeft(distance) { this.moveHorizontal(-distance); }    // 左方向
    moveRight(distance) { this.moveHorizontal(distance); }    // 右方向

    // 衝突判定（２点が等しいか）
    hitTest(x, y) { return (this.x === x) && (this.y === y); }

    getAroundRectangle(size) {
        const x = this.x - size / 2;
        const y = this.y - size / 2;
        return new Rectangle(x, y, size, size);
    }
}

// 幅と高さのサイズを表すクラス
class Size {
    width;      // 幅
    height;     // 高さ

    // コンストラクタ（幅と高さを受け取る）
    constructor(width = 0, height = 0) {
        this.resize(width, height);
    }

    clone() {
        return new Size(this.width, this.height);
    }

    fromArray(ary) {
        this.width = ary[0];
        this.height = ary[1];
    }
    ToArray() {
        return [this.width, this.height];
    }

    // アスペクト比（幅を1とした場合の高さ比率）
    get aspectRatio() {
        return this.width /  this.height;
    }

    // 縦横比による判定
    get isSquare() { return (this.width == this.height); }      // 正方形
    get isLandscape() { return (this.width >= this.height); }   // 横長（正方形も含む）
    get isPortrait() { return (this.height >= this.width); }    // 縦長（正方形も含む）

    // 拡大率を指定した伸張
    expand(scale) {
        this.resize(this.width * scale, this.height * scale);
    }

    // アスペクト比を保ったまま幅を指定してリサイズ
    resizeWidth(width) {
        this.resize(width, width / this.aspectRatio);
    }

    // アスペクト比を保ったまま高さを指定してリサイズ
    resizeHeight(height) {
        this.resize(height * this.aspectRatio, height);
    }

    // 任意の幅と高さを指定してリサイズ（小数点以下は四捨五入）
    resize(width, height) {
        this.width = Math.round(width);
        this.height = Math.round(height);
    }

    // 現在のアスペクト比を保ったまま指定のサイズを最大値とするサイズに調整
    adjust(width, height) {
        let w = width;
        let h = height;
        if (this.isLandscape) {
            w = height * this.aspectRatio;
            if (w > width){
                w = width;
                h = width / this.aspectRatio;
            }
        } else {
            h = width / this.aspectRatio;
            if (h > height);
            {
                h = height;
                w = height * this.aspectRatio;
            }
        }
        this.resize(w, h);
    }

    adjustSquare(){ 
        const size = Math.max(this.width, this.height);
        this.resize(size, size);
    }

    isLeargeOrSame(width, height) {
        return !this.isSmall(width, height);
    }
    isSmall(width, height) {
        return this.width < width || this.height < height;
    }

    getRectangle() {
        return new Rectangle(0, 0, this.width, this.height);
    }

}

class Rectangle {

    x = 0;
    y = 0;
    width = 0;
    height = 0;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.setXY(x, y);
        this.setWH(width, height);
    }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    fromArray(ary) {
        this.setXY(ary[0], ary[1]);
        this.setWH(ary[2], ary[3]);
    }
    ToArray() {
        return [this.x, this.y, this.width, this.height];
    }

    get left() { return this.x; }
    get top() { return this.y; }
    get right() { return this.left + this.width - 1; }
    get bottom() { return this.top + this.height - 1; }

    get topLeft() { return new Point(this.left, this.top) }
    get topRight() { return new Point(this.right, this.top) }
    get bottomLeft() { return new Point(this.left, this.bottom) }
    get bottomRight() { return new Point(this.right, this.bottom) }

    get size() { return new Size(this.width, this.height); }
    get point() { return new Point(this.x, this.y); }

    contains(x, y) {
        return (x >= this.left && x <= this.right) && (y >= this.top && y <= this.bottom);
    }

    containsPoint(point) {
        return this.contains(point.x, point.y);
    }

    containsRect(rect){
        return ( this.containsPoint(rect.topLeft) &&
                 this.containsPoint(rect.topRight) &&
                 this.containsPoint(rect.bottomLeft) &&
                 this.containsPoint(rect.bottomRight)
        );
    }

    hitTest(rect) {
        return ( this.containsPoint(rect.topLeft) ||
                 this.containsPoint(rect.topRight) ||
                 this.containsPoint(rect.bottomLeft) ||
                 this.containsPoint(rect.bottomRight)
        );
    }

    offset(distanceX, distanceY) {
        this.x += distanceX;
        this.y += distanceY;
    }

    getOffsetedRect(distanceX, distanceY) {
        const rect = this.clone();
        rect.offset(distanceX, distanceY);
        return rect;
    }

    getCenterPoint()
    {
        const x = this.width / 2 + this.left;
        const y = this.height / 2 + this.top;
        return new Point(x, y);
    }

    setWH(width, height) {
        this.width = Math.round(width);
        this.height = Math.round(height);
    }

    setXY(x, y) {
        this.x = Math.round(x);
        this.y = Math.round(y);
    }

    setSize(size) {
        this.setWH(size.width, size.height);
    }

    setPoint(point) {
        this.setXY(point.x, point.y);
    }

    resize(width, height, fromCenter = false) {
        const size = this.size;
        if (fromCenter) {
            const offsetX = (size.width - width) / 2;
            const offsetY = (size.height - height) / 2;
            this.offset(offsetX, offsetY);
        }
        size.resize(width, height);
        this.setSize(size);
    }

    getResizedRect(width, height, fromCenter = false) {
        const rect = this.clone();
        rect.resize(width, height, fromCenter);
        return rect;
    }

    expand(scale, fromCenter = false) {
        const size = this.size;
        size.expand(scale);
        this.resize(size, fromCenter);
    }

    getExpandedRect(scale, fromCenter = false) {
        const rect = this.close();
        rect.expand(scale, fromCenter);
        return rect;
    }

    adjust(width, height, fromCenter = false) {
        const size = this.size;
        size.adjust(width, height);
        this.resize(size, fromCenter);
    }

    getAdjustedRect(width, height, fromCenter = false) {
        const rect = this.clone();
        rect.adjust(width, height, fromCenter);
        return rect;
    }

    adjustSquare(fromCenter = false) {
        const size = this.size;
        size.adjustSquare();
        this.resize(size.width, size.height, fromCenter);
    }

    arrangeCenter(outRect) {
        const left = (outRect.width - this.width) / 2 + outRect.left;
        const top = (outRect.height - this.height) / 2 + outRect.top;
        this.setXY(left, top);
    }

    getArrangedCenterRect(outRect) {
        const rect = this.clone();
        rect.arrangeCenter(outRect);
        return rect;
    }

}
