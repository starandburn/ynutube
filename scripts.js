'use strict';

[
    'figure.js',
    'canvas.js',
    'activecanvas.js',
    'sprite.js',
    'component.js',
    'common.js',
    'dog.js',
    'bat.js',
    'stringtranslator.js',
    'timer.js',
    'application.js',
    'ynutube.js',

].forEach((s) => {
    const tag = `<script src="${s}"></script> `;
    console.log('スクリプト読み込み', `'${s}'`);
    document.write(tag);
});
