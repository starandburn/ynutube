'use strict';

[
    'figure.js',
    'canvas.js',
    'sprite.js',
    'component.js',
    'dog.js',
    'bat.js',
    'stringtranslator.js',
    'application.js',

].forEach((s) => {
    const tag = `<script src="${s}"></script> `;
    console.log('スクリプト読み込み', `'${s}'`);
    document.write(tag);
});
