'use strict';

const application = new Application();

const SKIP_FRAME_AUTO = -1; // オートフレームスキップの値
const DEFAULT_SKIP_FRAME = SKIP_FRAME_AUTO; // フレームスキップのデフォルト値 
const DEFAULT_MAX_FPS = 60; // 最大FPS

const DOG_IMAGE_NO_MIN = 1;
const DOG_IMAGE_NO_MAX = 10;

// HTML 要素ID
const HTML_ID_LAYOUT = '#layout';
const HTML_ID_COMMAND_BOX = '#commandBox';
const HTML_ID_BUTTON_AREA = '#buttonArea';
const HTML_ID_MODE_TEXT = '#modeText';
const HTML_ID_MODE_DESCRIPTION = '#modeDescription';
const HTML_ID_LOG_AREA = '#logArea';
const HTML_ID_DEBUG_AREA = '#debugArea';
const HTML_ID_OVERLAY = '#windowOverlay';
const HTML_ID_CONTROL_AREA = '#controlArea';
const HTML_ID_SCREEN = '#screen';
const HTML_ID_CONTENT = '#content';

const HTML_ID_BUTTON_COMMAND = 'buttonCommand';

const STYLE_VALUE_NONE = 'none';
const STYLE_VALUE_BLOCK = 'block';
const STYLE_VALUE_FLEX = 'flex';
const STYLE_VALUE_100PERCENT = '100%';

const KEY_CODE_ENTER = 13;

// ユーザーが入力できるフィールド項目
const FIELD_DIRECTION = 'direction';    // 向き
const FIELD_SIZE = 'size';              // 大きさ
const FIELD_SPEED = 'speed';            // 速度
const FIELD_KIND = 'kind';              // 種類

// テキストで入力する場合のコマンド文字列
const COMMAND_DIRECTION_LEFT = 'left';      // 左向き
const COMMAND_DIRECTION_RIGHT = 'right';    // 右向き

const COMMAND_SPEED_SLOW = 'slow';      // 遅い
const COMMAND_SPEED_NORMAL = 'normal';  // 普通の速度
const COMMAND_SPEED_FAST = 'fast';      // 速い

const COMMAND_SIZE_NORMAL = 'normal';           // 普通の大きさ
const COMMAND_SIZE_SMALL = 'small';             // 小さい
const COMMAND_SIZE_BIG = 'big';                 // 大きい   
const COMMAND_SIZE_SUPERSMALL = 'supersmall';   // とても大きい
const COMMAND_SIZE_SUPERBIG = 'superbig';       // とても小さい

const COMMAND_RANDOM = 'random';                // ランダム
const COMMAND_AUTO = 'auto';    // 自動
const COMMAND_STOP = 'stop';

const COMMAND_BUTTON = 'button';
const COMMAND_DOG = 'dog';
const COMMAND_BAT = 'bat';
const COMMAND_RUN = 'run';
const COMMAND_GO = 'go';

const COMMAND_PLAY = 'play';
const COMMAND_EDIT = 'edit';
const COMMAND_DEBUG = 'debug';
const COMMAND_CLEAR = 'clear';
const COMMAND_RESET = 'reset';
const COMMAND_MODE = 'mode';

const COMMAND_EVERY = 'every';
const COMMAND_ALL = 'all';
const COMMAND_CLICK = 'click';
const COMMAND_RESET_BUTTONS = '-buttons';
const COMMAND_RESET_CONTROLS = '-controls';

const COMMAND_CONTROLS = 'controls';
const COMMAND_BUTTONS = 'buttons';

const PARAM_NAME_MODE = 'm';
const PARAM_NAME_EDIT_MODE = 'e';
const PARAM_NAME_RUN_MODE = 'r';
const PARAM_NAME_DEBUG = 'g';
const PARAM_NAME_CONTROLS = 'c';
const PARAM_NAME_BG = 'b';
const PARAM_NAME_SKIP_FRAME = 'p';
const PARAM_NAME_FPS = 'f';
const PARAM_NAME_CLICK = 'k';
const PARAM_NAME_BUTTONS = 't';
const PARAM_NAME_FLAGS = 'n';
const PARAM_SEPARATOR_BUTTON = '.';
const PARAM_NAME_CONTROLS_ENABLED = 'u';

// 動作モード
const MODE_PLAY = 0;            // 実行モード
const MODE_EDIT = 1;            // 編集モード
const MODE_DEFAULT = MODE_PLAY; // 初期状態

const CONTROL_FIX = 'fix';
const CONTROL_TEXT = 'text';
const CONTROL_CHECK = 'check';
const CONTORL_RADIO = 'radio';
const CONTROL_DROPDOWN = 'dropdown';
const CONTROL_SLIDER = 'slider';
const CONTROL_LIST = 'list';
const CONTORL_IMAGELIST = 'imagelist';

const controlItems = [
    // { id: CONTROL_FIX, text: '📍固定' },
    { id: CONTROL_TEXT, text: '📝テキストボックス' },
    { id: CONTROL_CHECK, text: '✅チェックボックス' },
    { id: CONTORL_RADIO, text: '🔘ラジオボタン' },
    { id: CONTROL_DROPDOWN, text: '🔽ドロップダウン' },
    { id: CONTROL_LIST, text: '🚦リストボックス' },
    { id: CONTROL_SLIDER, text: '🎚スライダー' },
    { id: CONTORL_IMAGELIST, text: '🖼イメージリスト', control: [FIELD_KIND] },
];

// 選択肢項目
const directionItems = [    // 向き
    { id: DIRECTION_LEFT, text: '左向き', command: COMMAND_DIRECTION_LEFT, useOption: true, useList: true, useRandom: true, default: true },
    { id: DIRECTION_RIGHT, text: '右向き', command: COMMAND_DIRECTION_RIGHT, useOption: true, useList: true, useRandom: true, useCheck: true },
];
const sizeItems = [ // 大きさ
    { id: SIZE_SUPERSMALL, text: '超小さい', command: COMMAND_SIZE_SUPERSMALL, useOption: false, useList: true, useRandom: false },
    { id: SIZE_SMALL, text: '小さい', command: COMMAND_SIZE_SMALL, useOption: true, useList: true, useRandom: true },
    { id: SIZE_NORMAL, text: '普通', command: COMMAND_SIZE_NORMAL, useOption: true, useList: true, useRandom: true, default: true },
    { id: SIZE_BIG, text: '大きい', command: COMMAND_SIZE_BIG, useOption: true, useList: true, useRandom: true, useCheck: true },
    { id: SIZE_SUPERBIG, text: '超大きい', command: COMMAND_SIZE_SUPERBIG, useOption: false, useList: true, useRandom: false },
]
const speedItems = [ // 速度（initializeSpeedItemsメソッドで段階指定用の要素を追加）
    { id: SPEED_SLOW, text: '遅い', command: COMMAND_SPEED_SLOW, useOption: true, useList: false, useRandom: true },
    { id: SPEED_NORMAL, text: '普通', command: COMMAND_SPEED_NORMAL, useOption: true, useList: false, useRandom: true, default: true },
    { id: SPEED_FAST, text: '速い', command: COMMAND_SPEED_FAST, useOption: true, useList: false, useRandom: true, useCheck: true },
]
const kindItems = [];   // 種類（initializeKindItemsメソッドで全要素を生成）
const extraKinds = ['hotdog', 'mame', 'siro', 'wanwan'];

const fields = [
    { id: FIELD_DIRECTION, text: '向き', items: directionItems, checkText: '反対を向く', code: 'd' },
    { id: FIELD_SIZE, text: 'サイズ', items: sizeItems, checkText: '大きくする', code: 'z' },
    { id: FIELD_SPEED, text: 'スピード', items: speedItems, checkText: '速くする', code: 'p' },
    { id: FIELD_KIND, text: '種類', items: kindItems, checkText: '違う種類', code: 'k' },
];

// const fieldAttributes = new Map([
//     [FIELD_DIRECTION, {
//         text: '向き',
//         items: directionItems,
//         checkText: '反対を向く',
//         code: 'd',
//     }],

//     [FIELD_SIZE, {
//         text: 'サイズ',
//         items: sizeItems,
//         checkText: '大きくする',
//         code: 'z',
//     }],

//     [FIELD_SPEED, {
//         text: 'スピード',
//         items: speedItems,
//         checkText: '速くする',
//         code: 'p',
//     }],

//     [FIELD_KIND, {
//         text: '種類',
//         items: kindItems,
//         checkText: '種類を変える',
//         code: 'k',
//     }],

// ]);

const backGroundIds = [
    'field',
    'sea',
    'fantasy',
    'night',
    'out',
];

const buttonCodes = [
    { command: COMMAND_DOG, code: 'D' },
    { command: COMMAND_BAT, code: 'B' },
    { command: COMMAND_RANDOM, code: 'A' },
    { command: COMMAND_RESET, code: 'C' },
    { command: COMMAND_SIZE_BIG, code: 'G' },
    { command: COMMAND_SIZE_SMALL, code: 'S' },
    { command: COMMAND_DIRECTION_LEFT, code: 'L' },
    { command: COMMAND_DIRECTION_RIGHT, code: 'R' },
    { command: COMMAND_SPEED_FAST, code: 'F' },
    { command: COMMAND_SPEED_SLOW, code: 'W' },
];

const translateTable = [
    [FIELD_DIRECTION, 'dir', 'muki', '向き', 'むき', 'houkou', '方向', 'ほうこう'],
    [FIELD_SIZE, 'サイズ', '大きさ', 'おおきさ', 'saizu', 'ookisa'],
    [FIELD_SPEED, 'スピード', '速さ', '早さ', 'はやさ', 'hayasa', 'supido'],
    [FIELD_KIND, 'type', 'タイプ', '種類', 'しゅるい', '画像', 'がぞう', '犬種', 'けんしゅ', 'shurui', 'syurui', 'keshu', 'kensyu'],
    [COMMAND_PLAY, 'playmode', COMMAND_RUN, COMMAND_GO, '再生', '再生モード', '実行', '始め', 'はじめ', '動け', 'うごけ'],
    [COMMAND_EDIT, 'editmode', '編集', '編集モード', 'make', '作る', '直す', 'つくる', 'なおす'],
    [COMMAND_DEBUG, 'デバッグ'],
    [COMMAND_DOG, '犬', 'いぬ', '走れ', 'はしれ'],
    [CONTROL_TEXT, 'textbox', 'input', 'テキストボックス'],
    [CONTROL_CHECK, 'checkbox', 'チェックボックス', 'チェック'],
    [CONTORL_RADIO, 'radiobutton', 'option', 'optionbox', 'ラジオボタン', 'ラジオ', 'オプション'],
    [CONTROL_DROPDOWN, 'drop', 'ドロップ', 'dropdownbox', 'dropdownlist', 'combobox', 'combo', 'ドロップダウン', 'ドロップダウンリスト'],
    [CONTROL_LIST, 'listbox', 'リストボックス', '一覧', 'リスト'],
    [CONTROL_SLIDER, 'srider', 'trackbar', 'スライダー', 'トラックバー'],
    [CONTORL_IMAGELIST, 'image', 'イメージリスト', '画像リスト', '画像一覧', 'イメージ'],
    [COMMAND_BUTTON, 'ボタン', 'botan', 'btn', 'buton', 'buttn', 'buttan'],
    [COMMAND_RESET, COMMAND_CLEAR],
    [COMMAND_CLICK, 'クリック', 'mouse', 'マウス', 'touch', 'タッチ'],
    [COMMAND_RANDOM, 'ランダム', 'rand', 'rnd', '？', '?'],
    [COMMAND_DIRECTION_RIGHT, '右', '右向き', 'みぎむき', '逆', 'みぎ', 'ぎゃく', 'migi'],
    [COMMAND_DIRECTION_LEFT, '左', 'ひだり', '左向き', 'ひだりむき', 'hidari'],
    [COMMAND_SPEED_FAST, '速い', '早い', 'はやい', 'hayai'],
    [COMMAND_SPEED_SLOW, '遅い', 'おそい', 'のろい', 'osoi'],
    [COMMAND_SIZE_SMALL, '小さい', 'ちいさい', 'スモール', 'chisai', 'tisai', 'chiisai', 'tiisai'],
    [COMMAND_SIZE_BIG, '大きい', 'おおきい', 'でかい', 'ビッグ', 'ビック', 'ookii', 'oki', 'okii', 'dekai'],
    [COMMAND_CLICK, 'クリック', 'touch', 'タッチ', 'マウス', 'mouse', 'tap', 'タップ'],
];


const controls = [];
const buttonTexts = [];

const shadowTile = new ShadowTile();
const dogTiles = new Map();

let components = new Map();

let batTile = null;
let backGroundTile = null;

let mainScreen = null;
let controlArea = null;
let contentArea = null;
let buttonArea = null;
let debugArea = null;
let commandBox = null;

let totalDogCount = 0;
let visibleDogCount = 0;

let currentMode = MODE_DEFAULT;

let canClickScreen = false;
let isAutoMode = false;
let isPausing = false;
let existsExtraKinds = false;

function equals(str1, str2, normalize1 = true, normalize2 = true) {
    if (normalize1) str1 = normalizeText(str1);
    if (normalize2) str2 = normalizeText(str2);
    const result = (!isNone(str1) && !isNone(str2) && str1 == str2);
    return result;
}
function isNone(obj) { return (obj == null || obj == undefined || obj == NaN); }
function isBlank(str) { return isNone(str) || str.trim().length == 0; }

function initializeItemTables() {

    console.log('項目テーブル初期化');
    initializeSpeedItems();
    initializeKindItems();
    // for (let field of fieldAttributes.keys()) {
    //     for (let i in getFieldAttribute(field).items) {
    //         getFieldAttribute(field).items[i].command = normalizeText(getFieldAttribute(field).items[i].command);
    //     }
    // }

    for (let field of fields) {
        for (let item of field.items) {
            item.command = normalizeText(item.command);
        }
    }

    // for (let field of fieldAttributes.keys()) {
    //     for (let i in getFieldAttribute(field).items) {
    //         console.log(getFieldAttribute(field).items[i].command);
    //     }
    // }

}

function initializeTranslateTable() {
    console.log('コマンド変換テーブル初期化');
    for (let i = 0; i < translateTable.length; i++) {
        for (let j = 0; j < translateTable[i].length; j++) {
            translateTable[i][j] = normalizeText(translateTable[i][j]);
        }
    }
}

function getFieldByCode(code) {

    // for (let key of fieldAttributes.keys()) {
    //     if (equals(code, fieldAttributes.get(key)?.code)) return key;
    // }
    // return null;
    console.log('フィールド', code);
    return fields.find(f => equals(f.code, code))?.id;
}

function getControlByCode(code) {
    code = normalizeText(code);
    return controlItems.find(x => equals(x.code, code))?.id || null;
}

function toStringFromItems(items) {
    return items?.map(x => `${x?.command ?? 'none'}[${x?.id}]:${x?.text}`)?.join(', ');
}

function initializeSpeedItems() {

    const names = getCommandItems(FIELD_SPEED);
    for (let i = SPEED_MIN; i <= SPEED_MAX; i++) {
        let listText = `速度${i}`;
        let description = getItemText(names, i);
        if (!isNone(description)) listText += `(${description})`;
        speedItems.push({ id: i, text: listText, command: null, useOption: false, useList: true, useRandom: true });
    }
    console.log('速度テーブル初期化:', toStringFromItems(speedItems));
}

function initializeKindItems() {
    kindItems.splice(0);
    for (let tileNo = DOG_IMAGE_NO_MIN; tileNo <= DOG_IMAGE_NO_MAX; tileNo++) {
        const imageId = `dog${tileNo}`;
        kindItems.push({ id: tileNo, text: `犬${tileNo}`, src: `img/${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true, default: (tileNo == DOG_IMAGE_NO_MIN), useCheck: (tileNo == DOG_IMAGE_NO_MAX) });
    }
    console.log('種類テーブル初期化:', toStringFromItems(kindItems));
}

function appendExtraKinds() {

    if (existsExtraKinds) return;
    let tileNo = DOG_IMAGE_NO_MAX;
    for (let imageId of extraKinds) {
        if (kindItems.map((x) => x.imageId).includes(imageId)) continue;
        tileNo++;
        kindItems.push({ id: tileNo, text: `特殊犬${imageId}`, src: `img/@dog${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
    }
    console.log('種類テーブル特殊犬追加', toStringFromItems(kindItems));
    createAllItemTables();
    existsExtraKinds = true;

}

// function createAllItemTables() {
//     allItems = [].concat(...Array.from(fieldAttributes.values()).map(x => x.items));
//     console.log('全項目テーブル作成', toStringFromItems(allItems));
// }

function getAllItems() {
    // const result = Array.from(fieldAttributes?.values())?.map(x => x.items)?.flat();
    const result = fields.map(f => f.items).flat();
    // console.log('全項目テーブル', result);
    return result;
}
function getTextFromCommand(command) {
    getAllItems().find(x => x.command)?.text;
}

function getItemText(items, key, getKey = (x) => x?.id, log = false) {
    const result = items?.find((item) => equals(getKey(item), key))?.text ?? null;
    if (log) console.log('項目名取得', `[${key}]`, result);
    return result;
}

function toSplitedArray(text, separator = ' ', log = true) {
    const result = new StringTranslator(text).split(separator);
    if (log && result != text) console.log('文字列分割:', text, '->', result);
    return result;
}

function normalizeText(text, toLower = true) {
    const result = new StringTranslator(text).compressSpace().toKatakanaFromHiragana().toNarrowFromWideAscii().toNarrowFromWideKatakana().text;
    if (toLower) return result.toLocaleLowerCase();
    return result;
}

function translateCommand(source, log = true) {

    if (isNone(source)) return '';
    const command = normalizeText(source);
    const blnMinus = command.startsWith('-');
    let result;

    try {
        for (let group of translateTable) {
            result = group[0];
            for (let i = 0; i < group.length; i++) {
                if (equals(group[i], command.replace(/^\-/g, ''), false, false)) return `${blnMinus ? '-' : ''}${result}`;
            }
        }
        result = command;
        return result;
    } finally {
        if (log && source != result) console.log('コマンド変換:', source, '->', result);
    }
}

function resetButtons() {
    console.log('ボタン情報リセット');
    buttonTexts.splice(0);
    buildButtons(currentMode);
}


// -----------------------------------------
//  コマンド実行
// -----------------------------------------

// [一時停止]コマンド
function doPauseCommand() {
    console.log('コマンド実行:', '一時停止');
    if (isPausing) {
        isPausing = false;
        mainScreen.resume();
    } else {
        if (visibleDogCount > 0) {
            isPausing = true;
            mainScreen.pause();
        }
    }
}

// [デバッグ]コマンド
function doDebugCommand() {
    console.log('コマンド実行:', 'デバッグモード切替');
    application.debugToggle();
}

// [リセット]コマンド
function doResetCommand(mode) {
    console.log('コマンド実行', isPlayMode(mode) ? '実行状態リセット' : '設計内容リセット');
    if (isEditMode(mode)) {
        resetControls();
        buildControls(mode);
        resetButtons();
        setAutoMode(false);
        setClickable(false);
    } else {
        resetSprites();
    }
}

// [ランダム表示]コマンド
function doRandomCommand() {
    console.log('コマンド実行', 'ランダム表示');
    appearDogByCommand(COMMAND_RANDOM);
}

// ボタン追加コマンド
function doButtonCommand(text = '', rebuild = true) {
    if (!isBlank(text) && buttonTexts?.includes(x => equals(x.value, text))) return;
    console.log('ボタン追加', text);

    const textBox = new TextBox(`${HTML_ID_BUTTON_COMMAND}${buttonTexts.length + 1}`, text);
    textBox.placeholder = '未使用';
    buttonTexts.push(textBox);
    if (rebuild) buildButtons(currentMode);
}


// 汎用コマンド実行
function doCommand(text) {

    const command = translateCommand(text);
    if (isBlank(command)) return;

    console.log('コマンド実行:', command);

    try {

        // 両モード共通コマンド
        switch (command) {
            case COMMAND_DEBUG:
                doDebugCommand();
                return;
            case COMMAND_MODE:
                changeMode(isPlayMode(currentMode));
                return;
            case COMMAND_RESET:
                doResetCommand(currentMode);
                return;
            case COMMAND_CLICK:
                setClickable(true);
                return;
        }

        // 編集モード中のコマンド
        if (isEditMode(currentMode)) {
            switch (command) {
                case COMMAND_PLAY:
                    changeMode(false);
                    return;
                case COMMAND_EVERY:
                    controlItems.forEach(x => x.available = true);
                    buildControls(currentMode, true);
                    return;
                case COMMAND_ALL:
                    doCommand(COMMAND_CONTROLS);
                    doCommand(COMMAND_BUTTONS);
                    return;
                case COMMAND_CONTROLS:
                    resetControls(false);
                    // Array.from(fieldAttributes.keys()).forEach(x => appendControl(x, false));
                    fields.forEach(f => appendControl(f.id, false));
                    buildControls(currentMode);
                    return;
                case COMMAND_RESET_CONTROLS:
                    resetControls(false);
                    buildControls(currentMode)
                    return;
                case COMMAND_RESET_BUTTONS:
                    resetButtons();
                    return;
                case COMMAND_BUTTONS:
                    for (let i = 0; i < 4; i++) doButtonCommand();
                    return;
                case COMMAND_BUTTON:
                    doButtonCommand();
                    return;
                case `-${COMMAND_BUTTON}`:
                    removeButton();
                    return;
                case COMMAND_DOG:
                case COMMAND_BAT:
                case COMMAND_RANDOM:
                    doButtonCommand(command);
                    return;
                default:

                    // コマンドボタンの直接配置(xxxxbuttonでボタン追加)
                    if (command.endsWith('button')) {
                        doButtonCommand(command.replace(/button$/g, ''));
                        return;
                    }

                    // 設定可能フィールドの追加と除外（-xxxxxxx)で除外
                    // for (let field of fieldAttributes.keys()) {
                    for (let fieldId of fields.map(f => f.id)) {
                        if (equals(fieldId, command, true, false)) {
                            appendControl(fieldId);
                            return;
                        }
                        if (command.startsWith('-') && equals(command.slice(1), fieldId)) {
                            removeControl(fieldId);
                            return;
                        }
                    }

                    // コントロールの有効化
                    for (let item of controlItems) {
                        if (equals(item.id, command, false, false)) {
                            item.available = true;
                            buildControls(currentMode, true);
                            return;
                        }
                    }

                    // if (allItems.find(x => equals(x.command, command, false, false))) 
                    if (getAllItems().some(x => equals(x.command, command, false, false))) {
                        doButtonCommand(command);
                        return;
                    }

                    break;
            }
        } else {
            // 実行モード中のコマンド

            switch (command) {
                case COMMAND_EDIT:
                    changeMode(true);
                    return;
                case COMMAND_AUTO:
                    setAutoMode(true);
                    return;
                case COMMAND_STOP:
                    setAutoMode(false);
                    return;
                case COMMAND_BAT:
                    appearBat();
                    return;
                default:
                    if (appearDogByCommand(command)) return;
            }
        }

        console.log('無効なコマンド:', command);

    } finally {
        clearCommandBox();
    }
}


function loadBatTile(id) {

    if (batTile != null) return;
    let img = application.getImage(id);
    new Promise((resolve) => {
        if (img != null) resolve();
        const url = `img/${id}.png`;
        application.loadImage(id, url).then((msg) => {
            console.log('蝙蝠画像読込完了:', `[${id}]`, url);
            img = application.getImage(id);
        }).catch((msg) => {
            console.log('エラー:', '蝙蝠画像読込失敗', msg);
            img = null;
        }).finally(() => {
            resolve();
        });
    }).then(() => {
        // 読み込みが完了した段階ですでに使用中のスプライトの画像を更新する
        batTile = new ImageTile(img);
        for (let bat of mainScreen.sprites.filter((x) => x instanceof Bat)) {
            bat.refreshTile(batTile);
            console.log('蝙蝠画像更新');
        }
    });
}


function setBackground(id) {

    if (isNone(id)) return;
    let img = application.getImage(id);
    new Promise((resolve) => {
        if (img != null) resolve();
        const url = `img/${id}.png`;
        application.loadImage(id, url).then((msg) => {
            console.log('背景画像変更:', `[${id}]`, url);
            img = application.getImage(id);
        }).catch((msg) => {
            console.log('エラー:', '背景画像読込失敗', msg);
            img = null;
        }).finally(() => {
            resolve();
        });
    }).then(() => {
        backGroundTile = new ImageTile(img);
        mainScreen?.render();
    });
}

function loadDogTile(tileNo) {

    if (dogTiles.has(tileNo)) return;

    const item = kindItems.find((k) => equals(k.id, tileNo));
    const src = item?.src;
    const id = item?.imageId;

    dogTiles.set(tileNo, new DrawingTile(256, 256));
    application.loadImage(id, src).then((msg) => {
        const tile = new ImageTile(application.getImage(id), 0, 0, 0, 0, true, true);
        dogTiles.set(tileNo, tile);
        // 読み込みが完了した段階ですでに使用中のスプライトの画像を更新する
        for (let dog of mainScreen.sprites.filter((x) => x instanceof Dog)) {
            if (dog.kind == tileNo) {
                dog.refreshTile();
                console.log('犬画像読込', `[${tileNo}]`, id);
            }
        }
    });
}



// 1体の犬を表示する
function appearDog(x, y, kind, direction, size, speed) {

    kind = getFieldValue(FIELD_KIND, kind);
    loadDogTile(kind);

    const dog = new Dog(mainScreen, dogTiles, kind, 0, 0, 0, 0, 0, application.getRandom(0, DOG_PATTERN_COUNT - 1));

    dog.directionTranslate = (d) => getItemText(directionItems, d);
    dog.sizeTranslate = (s) => getItemText(sizeItems, s);
    dog.speedTranslate = (s) => getItemText(speedItems, s);
    dog.kindTranslate = (k) => getItemText(kindItems, k);

    totalDogCount++;
    dog.tag = `DOG_${totalDogCount.toString().padStart(4, '0')}`;

    dog.direction = getFieldValue(FIELD_DIRECTION, direction);
    dog.size = getFieldValue(FIELD_SIZE, size);
    dog.speed = getFieldValue(FIELD_SPEED, speed);

    x = Math.round(x ?? (equals(dog.direction, DIRECTION_LEFT, false, true) ? mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
    y = Math.round(y ?? (application.getRandom(0, mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);

    dog.moveAt(x, y);
    dog.resetTransition();

    mainScreen.addSprite(dog, 1);
    visibleDogCount++;

    dog.onOutOfCanvas = (dog) => {
        console.log('イベント:', `[${dog.tag}]`, '画面外離脱')
        dog.dispose();
        visibleDogCount--;
    }

    updateDogCount();

    console.log('犬を表示:', `[${dog.tag}]`, `座標:(${dog.x}, ${dog.y})`, `種類:${getItemText(kindItems, dog.kind)}`, getItemText(directionItems, dog.direction), getItemText(sizeItems, dog.size), getItemText(speedItems, dog.speed));

    return dog;

}

function updateDogCount() {
    console.log('総数表示:', totalDogCount, `(表示中:${visibleDogCount})`);
    const CLASS_DOG_COUNT = '.dog-count';
    for (let countLabel of document.querySelectorAll(CLASS_DOG_COUNT)) {
        if (countLabel == undefined || countLabel == null) continue;
        countLabel.textContent = totalDogCount;
    }
}


// 各フィールドの値をコントロールに設定
function setFieldValue(field, value) {
    console.log('コントロール値設定:', `[${field}]`, value);
    getComponent(field)?.setValue(value);
}

function getFieldValue(field, value) {

    const defaultValue = (isNone(value) || value == VALUE_RANDOM) ? getDefaultValue(field) : value;
    const component = getComponent(field);
    if (component == null && value != VALUE_RANDOM) return defaultValue;

    let items;
    switch (controls.find((c) => equals(c.field, field))?.type) {
        case CONTROL_TEXT:
            items = getCommandItems(field);
            break;
        case CONTORL_RADIO:
            items = getOptionItems(field);
            break;
        case CONTROL_CHECK:
            items = getCheckItems(field);
            break;
        default:
            items = getListItems(field);
    }

    value = value ?? component?.number ?? items?.find((x) => equals(x.command, translateCommand(component?.text), true, false))?.id ?? defaultValue;
    if (component?.text == COMMAND_RANDOM || value == VALUE_RANDOM) {
        items = items.filter((x) => x.useRandom);
        value = application.getRandomSelect(...getIdList(items));
    }

    if (!getIdList(items)?.includes(value)) {
        console.log('getFieldValue', field, '不正な値')
        value = defaultValue;
    }

    return value;
}

function getIdList(item) {
    return item?.map((x) => x.id);
}

function getComponent(field) {
    return components.get(field) ?? null;
}

function addComponent(component) {
    if (component != null) {
        components.set(component.id, component);
    }
}

function getFieldById(fieldId) {
    // return fieldAttributes.get(field) ?? null;
    return fields.find(f=>equals(f.id, fieldId));
}

function getItems(fieldId) {
    return getFieldById(fieldId)?.items;
}
function getDefaultValue(fieldId, translateCommand = false) {
    const defaultItem = getFieldById(fieldId)?.items?.find((x) => x?.default);
    return (translateCommand ? defaultItem.command : null) ?? defaultItem.id ?? null;
}
function getCheckedValue(fieldId) {
    return getFieldById(fieldId)?.items?.find((x) => x?.useCheck)?.id;
}
function getOptionItems(fieldId) {
    return getFieldById(fieldId)?.items?.filter((x) => x.useOption);
}
function getCheckItems(fieldId) {
    return getFieldById(fieldId)?.items?.filter((x) => x?.default || x?.useCheck);
}
function getListItems(fieldId) {
    return getFieldById(fieldId)?.items?.filter((x) => x.useList);
}
function getCommandItems(fieldId) {
    // return getFieldAttribute(field)?.items?.filter((x) => ((x.command?.toString().trim() ?? '') != ''));
    return getFieldById(fieldId)?.items?.filter((x) => !isBlank(x.command));
}
function getRandomItems(fieldId) {
    return getFieldById(fieldId)?.items?.filter((x) => x.useRandom);
}

// 入力コンポーネントのHTMLエレメントを作成
function createComponent(field, type, mode = MODE_PLAY) {

    const CLASS_SIMPLE = 'simple-component';
    const CLASS_COMPOSITE = 'composite-component';
    const CLASS_DISABLED = 'disabled-component';
    const CLASS_IMAGELIST = 'imagelist-component';

    let component = null;

    if (isPlayMode(mode)) {
        switch (type) {
            case CONTROL_TEXT:
                component = new TextBox(field, getDefaultValue(field, true), getCommandItems(field), CLASS_SIMPLE);
                break;
            case CONTORL_RADIO:
                component = new RadioButtons(field, getOptionItems(field), getDefaultValue(field), CLASS_COMPOSITE);
                break;
            case CONTROL_CHECK:
                component = new CheckBox(field, getFieldById(field)?.checkText, getDefaultValue(field), getCheckedValue(field), CLASS_COMPOSITE);
                break;
            case CONTROL_DROPDOWN:
                component = new DropDown(field, getListItems(field), getDefaultValue(field), CLASS_SIMPLE);
                break;
            case CONTROL_LIST:
                component = new ListBox(field, getListItems(field), getDefaultValue(field), CLASS_SIMPLE, null, () => { doCommand(COMMAND_DOG); });
                break;
            case CONTROL_SLIDER:
                component = new Slider(field, getListItems(field), getDefaultValue(field), CLASS_COMPOSITE);
                break;
            case CONTORL_IMAGELIST:
                component = new ImageList(field, getListItems(field), getDefaultValue(field), CLASS_IMAGELIST, () => { doCommand(COMMAND_DOG); });
                break;
            case CONTROL_FIX:
                component = new FixedLabel(field, getDefaultValue(field), getFieldById(field)?.items, CLASS_DISABLED);
                break;
            default:
                break;
        }
    } else {

        // 編集モードの場合はドロップダウンリスト固定
        let items = controlItems.filter(item => { return ((item.control?.includes(field) ?? true) && (equals(item.id, type) || item.available)); });
        component = new DropDown(field, items, type, CLASS_SIMPLE);

    }
    return component;

}

// コントロールを構成するHTMLエレメントを生成して取得する
function getControlElement(component, mode = MODE_PLAY, showLabel = true) {

    const CLASS_CONTROL_DESCRIPTION = 'control-description';
    const CLASS_CONTROL = 'control';
    const fieldId = component.id;
    const element = document.createElement('div');
    element.classList.add(CLASS_CONTROL);
    element.id = `${fieldId}Control`;

    if (showLabel) {
        // let description = fieldAttributes.get(id)?.text;
        let description = fields.find(f => equals(f.id, fieldId, true, false))?.text;
        if (isEditMode(mode)) description += 'を決めるコントロール';
        const label = new FixedLabel(`${fieldId}Label`, description, null, CLASS_CONTROL_DESCRIPTION);
        label.appendTo(element);
    }
    component.appendTo(element);

    return element;
}

// 指定要素の子ノードをすべて削除する
function clearChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function clearControlArea() {
    console.log('コントロールエリア消去');
    clearChildElements(controlArea);
    components.clear();
}

function InitializeControls(code, hex) {
    console.log('コントロール情報初期化', code, hex);
    initializeControlCode();
    resetControls();
    restoreControls(code, hex);
    logControls();
}

function resetControls(setEnabled = true) {
    console.log('コントロール情報リセット');
    controls.splice(0);
    clearControlArea();
    if (setEnabled) resetControlEnabled();
}

function initializeControlCode() {
    for (let idx in controlItems) {
        const item = controlItems[idx];
        controlItems[idx].code = '';
        controlItems[idx].id = normalizeText(item.id);
        for (let pos = 0; pos < item.id.length; pos++) {
            const c = item.id.charAt(pos).toLocaleLowerCase();
            if (getControlByCode(c) == null) {
                controlItems[idx].code = c;
                break;
            }
        }
    }
    console.log('コントロールコード初期化', controlItems.map(x => `${x.code}:${x.id}`).join());
}

function resetControlEnabled() {
    console.log('コントロール使用状況初期化')
    controlItems.forEach(item => item.available = equals(item.id, CONTROL_TEXT, false, true));
}

function restoreControls(code, hex) {
    code = normalizeText(code);
    hex = normalizeText(hex);

    if (isBlank(code) && isBlank(hex)) return;
    console.log('コントロール配置復元', code, `0x${hex}`);


    if (!isBlank(code)) {
        let field = null;
        for (let i = 0; i < code.length; i++) {
            const c = code.charAt(i);
            if (i % 2 == 0) {
                field = getFieldByCode(c);
            } else if (field != null) {
                if (controls.find(x => equals(x.field, field)) != null) continue;
                const type = getControlByCode(c) ?? CONTROL_TEXT;
                const index = controlItems?.findIndex(x => equals(x.id, type));
                if (index >= 0) controlItems[index].available = true;
                controls.push({ field: field, type: type });
                console.log(field, type);
            }
        }
    }
    if (!isBlank(hex)) setControlsAvailability(hex);
}

function restoreButtons(code) {
    code = normalizeText(code, false);
    if (isBlank(code)) return;

    console.log('ボタン配置復元', code);

    buttonTexts.splice(0);

    const codes = code.split(PARAM_SEPARATOR_BUTTON);
    if (codes?.filter(x => !isBlank(x)).length == 0) codes.pop();

    for (let text of codes) {
        doButtonCommand(text);
    }

}

function getControlsCode() {

    let code = '';
    for (let c of controls) {
        const fieldCode = getFieldById(c.field).code;
        const typeCode = controlItems.find(x => equals(x.id, c.type))?.code;
        code += normalizeText(`${fieldCode}${typeCode}`);
    }
    return code;
}

function logControls() {

    for (let item of controlItems) {
        console.log(`[${item.id}]${item.text}(${item.code}):`, item.available ? '使用可' : '使用不可');
    }
    for (let item of controls) {
        const attr = getFieldById(item.field)
        console.log(attr.text, getItemText(controlItems, item.type));
    }
    console.log("コントロールコード:", getControlsCode());

}

function getControlsAvailabilityAsHexCode() {
    let result = 0;
    for (let e of controlItems.map(x => x.available)) {
        result = result << 1;
        if (e) result |= 0x1;
    }
    return result;
}
function setControlsAvailability(hexCode) {

    let num = Number.parseInt(`0x${hexCode}`);
    if (num == NaN) return;

    for (let i = controlItems.length - 1; i >= 0; i--) {
        controlItems[i].available = ((num & 0x1) != 0);
        num = num >> 1;
    }

}

function UpdateControlTypes() {
    controls.splice(0);
    components.forEach((component) => {
        const field = component.id;
        const type = component.value ?? CONTROL_FIX;
        controls.push({ field: field, type: type });
    });
    console.log("コントロール種類更新:", getControlsCode());
}

function buildControls(mode = MODE_PLAY, updateType = false) {

    console.log('コントロールエリア構築:');

    if (updateType) UpdateControlTypes();

    clearControlArea();
    for (let control of controls) {

        // console.log('コントロール配置:', `[${fieldAttributes.get(control.field).text}]`, getItemText(controlItems, control.type));
        console.log('コントロール配置:', `[${fields.find(f => equals(f.id, control.field))?.text}]`, getItemText(controlItems, control.type));

        if (equals(control.field, FIELD_KIND) && equals(control.type, CONTORL_IMAGELIST)) {
            appendExtraKinds();
        }
        let component = createComponent(control.field, control.type, mode);

        // テキストボックスの場合はEnterキーで発動できるように
        if (isPlayMode(mode) && equals(control.type, CONTROL_TEXT) && component instanceof TextBox) {
            component.textBox.setAttribute('onKeyPress', 'onTextBox_KeyPress(event);');
        }

        addComponent(component);
        controlArea.appendChild(getControlElement(component, mode));
    }

    console.log('コントロールコード:', getControlsCode());

}

// -----------------------------------------------
// イベントハンドラー
// -----------------------------------------------
function onMainScreenClick(x, y, button, target) {
    if (isEditMode()) return;
    if (isPausing) return;
    if (!canClickScreen) return;

    console.log('イベント:', '[スクリーン]マウスクリック');
    switch (button) {
        case 0:
            appearDog(x, y + application.getRandom(-8, 8));
            break;
        case 2:
            updateFieldValue(appearDog(x, y, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM));
            break;

        case 1:
            const hited = target.getPointedSprite(x, y, true);
            if (hited instanceof Dog) {
                target.removeSprite(hited);
                visibleDogCount--;
                updateDogCount();
            }
    }

}

function onMenubutton_Click() {
    console.log('イベント:', '[メニューボタン]マウスクリック');
    doDebugCommand();
}

// [一時停止]ボタン
function onPauseButton_Click() {
    console.log('イベント:', '[一時停止ボタン]マウスクリック')
    doPauseCommand();
}

function onCommandButton_Click() {
    console.log('イベント:', '[コマンドボタン]マウスクリック');
    doCommand(getCommandBoxText());
}

function onModeChangeButton_Click() {
    console.log('イベント:', '[モード変更ボタン]マウスクリック');
    changeMode(isPlayMode(currentMode))
}

function onCommandText_KeyPress(event) {
    if (event.keyCode == KEY_CODE_ENTER) {
        console.log('イベント:', '[コマンドテキストボックス]Enterキー押下');
        event.preventDefault();
        doCommand(getCommandBoxText());
    }
}

function onTextBox_KeyPress(event) {
    if (event.keyCode == KEY_CODE_ENTER) {
        console.log('イベント:', '[項目テキストボックス]Enterキー入力');
        doCommand(COMMAND_DOG);
        event.preventDefault();
    }
}

function onActButton_Click(command, caption) {
    console.log('イベント:', `[${caption}]ボタンクリック`);
    doCommand(command);
}


function isPlayMode(mode = null) { return ((mode ?? currentMode) == MODE_PLAY); }
function isEditMode(mode = null) { return !isPlayMode(mode); }

function UpdateDebugArea(visible) {
    if (isNone(debugArea)) return;
    debugArea.style.display = visible ? STYLE_VALUE_FLEX : STYLE_VALUE_NONE;
}

function UpdateMainScreen(isDebugMode) {
    mainScreen.isDebugMode = isDebugMode
    mainScreen.render(isDebugMode);
}

function prepareHtmlElements() {
    contentArea = document.querySelector(HTML_ID_CONTENT);
    controlArea = document.querySelector(HTML_ID_CONTROL_AREA);
    buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);
    debugArea = document.querySelector(HTML_ID_DEBUG_AREA);
    commandBox = document.querySelector(HTML_ID_COMMAND_BOX);
    if (commandBox instanceof HTMLInputElement && commandBox.type != 'text') commandBox = null;
}

function appendControl(fieldId, rebuild = true) {
    const index = controls.findIndex((c) => equals(c.field, fieldId))
    if (index == -1) {
        controls.push({ field: fieldId, type: CONTROL_TEXT });
        if (rebuild) buildControls(currentMode);
    }
}

function removeControl(field, rebuild = true) {
    console.log('コントロール除外', field);
    const index = controls.findIndex((c) => equals(c.field, field))
    if (index == -1 || index >= controls.length) return;
    controls.splice(index, 1);
    if (rebuild) buildControls(currentMode);
}


function getCommandBoxText() {
    return commandBox?.value ?? '';
}



function appearBat() {

    if (batTile == null) loadBatTile('bat');
    const bat = new Bat(batTile, application.getRandom(mainScreen.width / 8, mainScreen.width / 8 * 7), application.getRandom(mainScreen.height / 8, mainScreen.height / 8 * 7));
    mainScreen.addSprite(bat, 0);
}


function setAutoMode(value) {
    if (isAutoMode) resetSprites();
    isAutoMode = value;
}
function setClickable(value) {
    canClickScreen = value;
}


function appearDogByCommand(command) {

    let commands = toSplitedArray(command);

    let appear = false;
    let direction = null;
    let speed = null;
    let size = null;
    let kind = null;
    let random = false;

    for (let command of commands) {
        command = translateCommand(command);
        switch (command) {
            case COMMAND_RANDOM:
                if (direction == null) direction = VALUE_RANDOM;
                if (speed == null) speed = VALUE_RANDOM;
                if (size == null) size = VALUE_RANDOM;
                if (kind == null) kind = VALUE_RANDOM;
                random = true;
                appear = true;
                break;
            case COMMAND_DIRECTION_LEFT:
            case COMMAND_DIRECTION_RIGHT:
                if (direction != null) break;
                direction = directionItems.find(x => equals(x.command, command, false, false))?.id;
                appear = true;
                break;
            case COMMAND_SPEED_FAST:
            case COMMAND_SPEED_SLOW:
                if (speed != null) break;
                speed = speedItems.find(x => equals(x.command, command, false, false))?.id;
                appear = true;
                break;
            case COMMAND_SIZE_BIG:
            case COMMAND_SIZE_SMALL:
            case COMMAND_SIZE_SUPERSMALL:
            case COMMAND_SIZE_SUPERBIG:
                if (size != null) break;
                size = sizeItems.find(x => equals(x.command, command, false, false))?.id;
                appear = true;
                break;
            case 'normal':
                appear = true;
                break;
            case COMMAND_DOG:
            case COMMAND_PLAY:
                appear = true;
                break;
            default:

                if (extraKinds.includes(command)) appendExtraKinds();
                const kindId = kindItems.find(x => equals(x.command, command, false, false))?.id;
                if (!isNone(kindId) && isNone(kind)) {
                    kind = kindId;
                    appear = true;
                }
        }
    }
    if (appear) {
        const dog = appearDog(null, null, kind, direction, size, speed);
        if (random) updateFieldValue(dog);
    }

    return appear;
}

function updateFieldValue(dog) {

    if (!(dog instanceof Dog)) return;

    setFieldValue(FIELD_DIRECTION, dog.direction);
    setFieldValue(FIELD_SIZE, dog.size);
    setFieldValue(FIELD_SPEED, dog.speed);
    setFieldValue(FIELD_KIND, dog.kind);

}


function removeButton() {
    if (isPlayMode(currentMode)) return;
    if (buttonTexts.length > 0) buttonTexts.pop();
    buildButtons(currentMode);
}

function buildButtons(mode = MODE_PLAY) {

    if (buttonArea == null) return;

    console.log('ボタンインターフェース構築:', isPlayMode(mode) ? '実行モード' : '編集モード');

    clearChildElements(buttonArea);
    if (isEditMode(mode)) {
        clearChildElements(buttonArea);
        for (let component of buttonTexts) {
            buttonArea.appendChild(component.htmlElement);
        }

    } else {
        let beforeButton = null;
        for (let component of buttonTexts) {
            const command = translateCommand(component?.value);
            if (command == '') continue;
            let caption = '';
            let optionNode = null;
            console.log('コマンド', command);
            switch (command) {
                case COMMAND_DOG:
                    caption = '🐕';
                    optionNode = document.createElement('span');
                    optionNode.id = 'dogCount';
                    optionNode.classList.add('dog-count');
                    optionNode.appendChild(document.createTextNode('0'));
                    break;
                case COMMAND_BAT:
                    caption = '🦇';
                    break;
                case COMMAND_RANDOM:
                    caption = '❓';
                    break;
                case COMMAND_RESET:
                    caption = '✖';
                    break;
                default:
                    caption = getItemText(getAllItems(), command, (x) => x.command) ?? command;
                    break;
            }
            let onClick = `onActButton_Click('${command}', '${caption}');`;
            const button = new Button(`${command}Button`, caption, onClick);
            if (optionNode != null) button.button.appendChild(optionNode);
            if (equals(beforeButton?.id, `${COMMAND_DOG}Button`) && !isBlank(command)) {
                beforeButton.button.classList.add('concat-button-left');
                button.button.classList.add('concat-button-right');
            }
            buttonArea.appendChild(button?.htmlElement);
            if (button != null) beforeButton = button;
        }
    }
}

function resetSprites() {
    mainScreen.clearSprites();
    totalDogCount = 0;
    visibleDogCount = 0;
    isAutoMode = false;
    updateDogCount();
}

function clearCommandBox() {
    if (commandBox == null) return;
    commandBox.value = '';
}

// [編集][再生]モード変更
function changeMode(editMode = false, first = false) {

    const MODE_TEXT_EDIT = 'いぬちゅーぶ＠設計モード';
    const MODE_DESCRIPTION_EDIT = '自分で画面を作ってみよう！'

    const MODE_TEXT_PLAY = 'いぬちゅーぶ＠実行モード';
    const MODE_DESCRIPTION_PLAY = '作ったものを動かしてみよう！'

    const CLASS_EDIT_MODE = 'edit-mode';

    const CLASS_LIGHT_THEME = 'light-theme';
    const CLASS_DARK_THEME = 'dark-theme';

    mainScreen?.stop();
    clearCommandBox();

    const body = document.body;
    const layout = document.querySelector(HTML_ID_LAYOUT);
    const modeText = document.querySelector(HTML_ID_MODE_TEXT);
    const modeDescription = document.querySelector(HTML_ID_MODE_DESCRIPTION);

    resetSprites();

    if (editMode) {

        currentMode = MODE_EDIT;
        layout?.classList.add(CLASS_EDIT_MODE);

        body?.classList.add(CLASS_DARK_THEME);
        body?.classList.remove(CLASS_LIGHT_THEME);

        if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_EDIT;
        if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_EDIT;

    } else {

        currentMode = MODE_PLAY;
        layout?.classList.remove(CLASS_EDIT_MODE);

        body?.classList.add(CLASS_LIGHT_THEME);
        body?.classList.remove(CLASS_DARK_THEME);

        if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_PLAY;
        if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_PLAY;

    }

    console.log('モード変更:', editMode ? `編集モード(${currentMode})` : '再生モード');

    buildControls(currentMode, !first && !editMode);
    buildButtons(currentMode);

    commandBox?.focus();

    if (isPlayMode(currentMode)) mainScreen?.start();

}

function getBackGroundId(code) {
    if (code > 0 && code <= backGroundIds.length) {
        const index = Number.parseInt(code) - 1;
        return backGroundIds[index];
    }
    return backGroundIds.find(x => equals(x, code));
}

application.run().then((runInfo) => {

    const thisApp = runInfo[0];

    thisApp.overrideConsoleLog(document.querySelector(HTML_ID_LOG_AREA));
    console.log('アプリケーション開始', runInfo.slice(1));

    const flags = normalizeText(thisApp.getParam(PARAM_NAME_FLAGS));

    const skipFrame = thisApp.getParam(PARAM_NAME_SKIP_FRAME) ?? DEFAULT_SKIP_FRAME;
    const maxFps = thisApp.getParam(PARAM_NAME_FPS) ?? DEFAULT_MAX_FPS;
    const backGround = thisApp.getParam(PARAM_NAME_BG) || flags?.match(/[0-9]/);

    const isDebug = (thisApp.getParam(PARAM_NAME_DEBUG) || flags?.includes(PARAM_NAME_DEBUG)) != 0;
    const controlsCode = thisApp.getParam(PARAM_NAME_CONTROLS);
    const buttonCode = thisApp.getParam(PARAM_NAME_BUTTONS);

    const controlsEnabled = thisApp.getParam(PARAM_NAME_CONTROLS_ENABLED);

    currentMode = thisApp.getParam(PARAM_NAME_MODE) ?? (flags?.includes(PARAM_NAME_EDIT_MODE) ? MODE_EDIT : flags?.includes(PARAM_NAME_RUN_MODE) ? MODE_PLAY : MODE_DEFAULT);
    canClickScreen = (thisApp.getParam(PARAM_NAME_CLICK) || flags?.includes(PARAM_NAME_CLICK)) != 0;

    thisApp.onChangeDebugMode = (isDebugMode) => {
        UpdateMainScreen(isDebugMode);
        UpdateDebugArea(isDebugMode);
    };

    prepareHtmlElements();
    initializeItemTables();
    initializeTranslateTable();

    InitializeControls(controlsCode, controlsEnabled);
    restoreButtons(buttonCode);

    const element = document.querySelector(HTML_ID_SCREEN);
    if (!(element instanceof HTMLCanvasElement)) return;

    element.style.width = STYLE_VALUE_100PERCENT;
    element.style.height = STYLE_VALUE_100PERCENT;

    mainScreen = new ActiveCanvas(element, 0, 0, null, maxFps, skipFrame, isDebug);
    mainScreen.drawOrders.push((s) => s.bottom);

    setBackground(getBackGroundId(backGround));

    changeMode(isEditMode(), true);

    thisApp.setDebugMode(isDebug);

    mainScreen.onClick = onMainScreenClick;

    mainScreen.onUpdate = () => {

        if (isAutoMode && isPlayMode() && Math.random() * 100 < 5) {
            doRandomCommand();
        }

    };


    mainScreen.onDraw = (ctx, target, debug) => {

        if (backGroundTile == null || backGroundTile?.image == null) {
            target.clear(debug);
        } else {
            backGroundTile.draw(ctx, 0, 0, target.width, target.height);
        }

        target.sprites.filter(x => x instanceof Dog).forEach(sprite => {
            shadowTile.draw(ctx, sprite, 0, 0);
        });

        target.sprites.forEach(sprite => {
            sprite.render(ctx, debug);
        });
    };

    document.querySelector(HTML_ID_OVERLAY).style.display = STYLE_VALUE_NONE;

});
