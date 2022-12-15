'use strict';

function equals(str1, str2, normalize1 = true, normalize2 = true) {
    if (normalize1) str1 = normalizeText(str1);
    if (normalize2) str2 = normalizeText(str2);
    return (!isNone(str1) && !isNone(str2) && str1 == str2);
}

function isNone(obj) { return (obj == null || obj == undefined || obj == NaN); }
function isBlank(str) { return isNone(str) || str.toString().trim().length == 0; }

function normalizeText(text, toLower = true, log = true) {
    let result = new StringTranslator(text).compressSpace().toKatakanaFromHiragana().toNarrowFromWideAscii().toNarrowFromWideKatakana().text;
    if (toLower) result = result.toLocaleLowerCase();
    if (log && !isBlank(text) && text != result) console.log('文字列正規化', `${text} -> ${result}`);
    return result;
}

function toSplitedArray(text, separator = ' ', log = true) {
    const result = new StringTranslator(text).split(separator);
    if (log && result != text) console.log('文字列分割:', text, '->', result);
    return result;
}

function openWindow(url, name, width = 800, height = 600) {
    window.open(url, name, `width=${width},height=${height}`);
}

function getParam(name, url, ifBlankNoLog = true) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);

    let param;
    if (!results) {
        param = null;
    } else if (!results[2]) {
        param = '';
    } else {
        param = decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    if (!ifBlankNoLog || !isBlank(param)) console.log('パラメータ取得', `${name} = ${param ?? ''}`);
    return param;
}


function getRandom(min, max) { return Math.floor(Math.random() * (max + 1 - min)) + min; }
function getRandomSelect(...theArgs) {
    return arguments[getRandom(0, arguments.length - 1)];
}
function log(...theArgs) {
    console.log(...arguments);
}

function overrideConsoleLog(logArea) {
    if (!(logArea instanceof HTMLElement)) return;
    const origin = console.log;
    console.log = function (...args) {

        // var callerName = null;
        // try { throw new Error(); }
        // catch (e) {
        //     var callerName = 'global';
        //     var re = /(\w+)@|at (\w+) \(/g, st = e.stack, m;
        //     while (m = re.exec(st)) {
        //         callerName = (m != null) ? m[1] || m[2] : 'global';
        //     }
        // }

        origin(...args);
        const p = document.createElement('p');
        const h = document.createElement('span');
        h.classList.add('title');
        h.textContent = args[0];

        // p.textContent = `[${callerName}]${args.join(' ')}`;

        p.appendChild(h)
        p.appendChild(document.createTextNode(args.slice(1).join(' ')));

        // p.textContent = args.slice(1).join(' ');

        logArea.prepend(p);
    };
}
