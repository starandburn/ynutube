'use strict';

// 描画処理を行うキャンバスクラス（HTML5のCanvas要素のラッパー）
class Canvas {

    #backgroundColor;
    #primaryScreen;
    #workBuffer
    #aspectRatio;
    #mouseX;
    #mouseY;
    #hasDoubleBuffer;

    constructor(element, width, height, backgroundColor, hasDoubleBuffer = false)
    {
        element = (element instanceof HTMLElement) ? element : null;
        width = Math.floor(Math.max(1, (width ?? 0) <= 0 ? element?.clientWidth ?? 0 : width));
        height = Math.floor(Math.max(1, (height ?? 0) == 0 ? element?.clientHeight ?? 0 : (height > 0) ? height : width * (-height)));
        backgroundColor = (backgroundColor ?? element?.style.backgroundColor) || null; 

        if (element instanceof HTMLCanvasElement) {
            // canvas要素が直接指定された場合、それを流用する
            this.#primaryScreen = element;

        } else {
            // canvas要素以外の場合、新規でcanvas要素を生成する
            this.#primaryScreen = this.#createCanvasElement();
            this.appendTo(element);
        }

        this.#primaryScreen.width = width;
        this.#primaryScreen.height = height;
        this.#aspectRatio = (width != 0) ? (height / width) : 0;

        this.#backgroundColor = backgroundColor;
        if (element != null) this.setEvents();

        this.#hasDoubleBuffer = hasDoubleBuffer;
        if (hasDoubleBuffer) {
            this.#workBuffer = this.#createCanvasElement();
        } else {
            this.#workBuffer = this.#primaryScreen;
        }

        this.#mouseX = 0;
        this.#mouseY = 0;

        this.clear();
        this.endRender();

    }

    #createCanvasElement() {
        return document.createElement('canvas')
    }

    createFont(sizePx, bold, italic, family) {
        const font = [bold ? 'bold' : null,  italic ? 'italic' : null, `${sizePx ?? 12}px`, family ?? 'sans-serif'].filter(s => s?.length > 0).join(' ');
        return font;
    }

    // イベント
    onClick = (x, y, b, tgt) => {};
    onDoubleClick = (x, y, b, tgt) => {};
    onMouseMove = (x, y, b, tgt) => {};
    onMouseDown = (x, y, b, tgt) => {};
    onMouseUp = (x, y, b, tgt) => {};

    // イベントハンドラテーブル
    #eventHandlers = [
        'click', (e, x, y, b) => { this.onClick(x, y, b, this); },
        'contextmenu', (e, x, y, b) => { this.onClick(x, y, b, this); e.preventDefault(); },
        'dblclick', (e, x, y, b) => { this.onDoubleClick(x, y, b, this); },
        'mousemove', (e, x, y, b) => { this.onMouseMove(x, y, b, this); },
        'mousedown', (e, x, y, b) => { this.onMouseDown(x, y, b, this); },
        'mouseup', (e, x, y, b) => { this.onMouseUp(x, y, b, this); },
    ];

    // 共通マウスイベントハンドラ
    mouseEventHandler(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const button = e.button;
        const type = e.type;

        this.#mouseX = x;
        this.#mouseY = y;

        for (let i = 0; i < this.#eventHandlers.length; i += 2)
        {
            if (this.#eventHandlers[i] == type) {
                this.#eventHandlers[i + 1](e, x, y, button);
                return;
            }
        }
    }

    setEvents()
    {
        for (let i = 0; i < this.#eventHandlers.length; i += 2)
        {
            const type = this.#eventHandlers[i];
            this.#primaryScreen.addEventListener(type, this.mouseEventHandler.bind(this), false);
        }
    }

    // 指定要素の子要素としてキャンバスを追加する
    appendTo(element) {
        if (element instanceof HTMLElement) {
            element.appendChild(this.#primaryScreen);
        }
    }

    get bufferWidth() { return this.#workBuffer.width; }
    get bufferHeight() { return this.#workBuffer.height; }

    get clientWidth() { return this.#primaryScreen.clientWidth; }
    get clientHeight() { return this.#primaryScreen.clientHeight; }

    get offsetWidth() { return this.#primaryScreen.offsetWidth; }
    get offsetHeight() { return this.#primaryScreen.offsetHeight; }

    get width() { return this.#primaryScreen.width; }
    get height() { return this.#primaryScreen.height; }

    get right() { return this.width - 1; }
    get bottom() { return this.height- 1; }

    resetCursor() { this.cursor = 'default'; }
    get cursor() { return this.#primaryScreen.style.cursor; }
    set cursor(value) { return this.#primaryScreen.style.cursor = value; }

    get mousePosition() {
        return [this.#mouseX, this.#mouseY];
    }

    get hasDoubleBuffer() {
        return this.#hasDoubleBuffer;
    }

    updateBackbuffer() {
        if (!this.#hasDoubleBuffer) return; 
        this.#workBuffer.width = this.width;
        this.#workBuffer.height = this.height;
    }


    beginRender(isDebugMode = false, erase = true) {
        if (this.clientWidth != this.Width || this.clientHeight != this.Height) {
            this.#primaryScreen.width = this.clientWidth;
            this.#primaryScreen.height = this.#primaryScreen.width * this.#aspectRatio;     
        }
        if (erase) this.clear(isDebugMode);
        return this.getContext();
    }

    endRender(erase = true) {

        if (!this.#hasDoubleBuffer) return;

        const ctx = this.getContext(this.#primaryScreen);
        if (erase) ctx.clearRect(0, 0, this.width, this.height);

        if (this.#workBuffer.width == 0 || this.#workBuffer.height == 0) return;
        ctx.drawImage(this.#workBuffer, 0, 0);
    }

    getTemporary() {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, this.width, this.height);
        return ctx;
    }

    getContext(target = null) {
        if (target == null) {
            this.updateBackbuffer();
            target = this.#workBuffer;
        }        
        return target.getContext('2d');
    }

    clear(isDebugMode = false){
        const ctx = this.getContext();
        ctx.save();
        if (this.#backgroundColor == null || this.#backgroundColor == undefined) {
            // if (!isDebugMode) {
            //     ctx.clearRect(0, 0, this.width, this.height);
            // } else {
                const tileSize = 12;
                ctx.beginPath();

                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.fillStyle = 'lightgray';
                for (let i = 0; i < this.height / tileSize; i++) {
                    for (let j = 0; j < this.width / tileSize; j++) {
                        if (j % 2 == i % 2) ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                    }
                }
                ctx.closePath();
            // }
        } else {
            ctx.fillStyle = this.#backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }
        ctx.restore();
    }
}