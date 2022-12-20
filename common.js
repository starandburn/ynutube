'use strict';

const Text = Object.freeze({
    Empty: '',
    isBlank: (str) => (str == null && str == undefined || str?.toString().trim().length == 0),
    compressSpace: (str) => ((str?.toString() ?? Text.Empty)?.replace(/[　\t]/g, ' ')?.trim().split(' ').filter(x => x?.trim().length > 0)?.join(' ')),
    split: (str, separator) => ((str?.toString() ?? Text.Empty)?.replace(/[　\t]/g, ' ')?.split(separator || ' ').map(x => x?.trim()).filter(x => x?.length > 0)),
    toNarrowFromAscii: (str) => ((str?.toString() ?? Text.Empty).replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))),
    toKatakana: (str) => ((str?.toString() ?? Text.Empty).replace(/[\u3041-\u3096]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60))),
    toNarrowFromKatakana: (str) => {
        const kanaMap = {
            "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ", "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
            "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ", "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
            "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ", "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
            "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ", "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
            "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ", "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
            "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ", "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
            "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ", "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
            "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ", "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
            "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ", "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
            "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･"
        };
        const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
        return ((str?.toString() ?? Text.Empty).replace(reg, s => kanaMap[s]).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ'));
    },

    normalize:(str, toLower = true) => {
        const result = Text.toNarrowFromKatakana(Text.toNarrowFromAscii(Text.toKatakana(Text.compressSpace(str))));  
        if (toLower) return result?.toLocaleLowerCase();
        return result;
    }
    
});

const Random = Object.freeze({
    get: (min, max) => (Math.floor(Math.random() * (max + 1 - min)) + min),
    select: function (...theArgs) { return arguments[Random.get(0, arguments.length - 1)] },
});

const Param = Object.freeze({
    url : window.location.href,
    get : (name) => {
        name = name?.replace(/[\[\]]/g, '\\$&');
        const result = (new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')).exec(Param.url);
        if (!result || !result[2]) return null;
        return decodeURIComponent(result[2]?.replace(/\+/g, ' '));
    }
});


function equals(str1, str2, normalize1 = true, normalize2 = true) {
    if (normalize1) str1 = Text.normalize(str1);
    if (normalize2) str2 = Text.normalize(str2);
    return (!isNone(str1) && !isNone(str2) && str1 == str2);
}

function isNone(obj) { return (obj == null || obj == undefined || obj == NaN); }

function openWindow(url, name, width = 800, height = 600) {
    window.open(url, name, `width=${width},height=${height}`);
}


function overrideConsoleLog(logArea) {
    if (!(logArea instanceof HTMLElement)) return;
    const origin = console.log;
    console.log = function (...args) {
        origin(...args);
        const p = document.createElement('p');
        const h = document.createElement('span');
        h.classList.add('title');
        h.textContent = args[0];
        p.appendChild(h)
        p.appendChild(document.createTextNode(args.slice(1).join(' ')));
        logArea.prepend(p);
    };
}
