'use strict';

// 読み込むスクリプトファイル(先頭から順番に読み込み)
const scripts =
    [
        'common.js',
        'html.js',
        'timer.js',
        'figure.js',
        'component.js',
        'canvas.js',
        'activecanvas.js',
        'sprite.js',
        'dog.js',
        'bat.js',
        'application.js',
        'ynutube.js',
    ];

// １件ずつ同期しながら読み込み    
let promise = Promise.resolve();
for (let src of scripts) {
    promise = promise.then(loadScript.bind(this, src));
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.head.insertAdjacentElement('beforeend', script);
            script.onload = () => {
            console.log('スクリプト読み込み完了', src);
            resolve(`スクリプト'${src}'読み込み完了`);
        }
        script.onerror = () => {
            console.log('スクリプト読み込み失敗', src);
            reject(`スクリプト'${src}'読み込み失敗`);
        }
    });
}