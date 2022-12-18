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
