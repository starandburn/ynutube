'use strict';

const application = new Application();
const _originConsoleLog = console.log;

const SKIP_FRAME_AUTO = -1; // オートフレームスキップの値
const DEFAULT_SKIP_FRAME = SKIP_FRAME_AUTO; // フレームスキップのデフォルト値 
const DEFAULT_MAX_FPS = 60; // 最大FPS

const DOG_IMAGE_NO_MIN = 1;
const DOG_IMAGE_NO_MAX = 10;

// HTML 要素ID
const HTML_ID_LAYOUT = '#layout';
const HTML_ID_COMMAND_TEXT = '#commandText';
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
const STYLE_VALUE_100PERCENT = '100%';

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
const PARAM_NAME_DEBUG = 'g';
const PARAM_NAME_CONTROLS = 'c';
const PARAM_NAME_BG = 'b';
const PARAM_NAME_SKIP_FRAME = 'p';
const PARAM_NAME_FPS = 'f';
const PARAM_NAME_CLICK = 'k';
const PARAM_NAME_BUTTON = 't';

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

const fieldAttributes = new Map([
    [FIELD_DIRECTION, {
        text: '向き',
        items: directionItems,
        checkText: '反対を向く',
        code: 'd',
    }],

    [FIELD_SIZE, {
        text: 'サイズ',
        items: sizeItems,
        checkText: '大きくする',
        code: 'z',
    }],

    [FIELD_SPEED, {
        text: 'スピード',
        items: speedItems,
        checkText: '速くする',
        code: 'p',
    }],

    [FIELD_KIND, {
        text: '種類',
        items: kindItems,
        checkText: '種類を変える',
        code: 'k',
    }],

]);


const tlanslateTable = [
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
const buttons = [];

const shadowTile = new ShadowTile();
const dogTiles = new Map();

let components = new Map();
let allItems = [];

let batTile = null;
let backGroundTile = null;

let mainScreen;
let controlArea = null;
let contentArea = null;
let buttonArea = null;
let commandBox = null;

let totalDogCount = 0;
let visibleDogCount = 0;

let currentMode;

let canClickScreen = false;
let isAutoMode = false;
let isPausing = false;

function isMuch(str1, str2, log = false) {
    const result = (str1 != null && str2 != null) && (normalizeText(str1, false) == normalizeText(str2, false));
    if (log) console.log('比較', str1, str2, result);
    return result;
}

function initializeItemTables() {
    console.log('項目テーブル初期化');
    initializeSpeedItems();
    initializeKindItems();
    createAllItemTables();
}

function getFieldFromCode(code) {

    for (let key of fieldAttributes.keys()) {
        // if (code?.toString().trim().toLocaleLowerCase() == fieldAttributes.get(key)?.code) return key;
        if (isMuch(code, fieldAttributes.get(key)?.code)) return key;
    }
    return null;
}
function getControlFromCode(code) {
    code = normalizeText(code, false);
    // return controlItems.find(x => x.code == code)?.id || null;
    return controlItems.find(x => isMuch(x.code, code))?.id || null;
}

function toStringFromItems(items) {
    return items?.map(x => `${x?.command ?? 'none'}[${x?.id}]:${x?.text}`)?.join(', ');
}

function initializeSpeedItems() {

    const names = getCommandItems(FIELD_SPEED);
    for (let i = SPEED_MIN; i <= SPEED_MAX; i++) {
        let listText = `速度${i}`;
        let description = getItemText(names, i);
        if (description != null) listText += `(${description})`;
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

    let tileNo = DOG_IMAGE_NO_MAX;
    for (let imageId of extraKinds) {
        if (kindItems.map((x) => x.imageId).includes(imageId)) continue;
        tileNo++;
        kindItems.push({ id: tileNo, text: `特殊犬${imageId}`, src: `img/@dog${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
    }
    console.log('種類テーブル特殊犬追加', toStringFromItems(kindItems));
    createAllItemTables();
}

function createAllItemTables() {
    allItems = [].concat(...Array.from(fieldAttributes.values()).map(x => x.items));
    console.log('全項目テーブル作成', toStringFromItems(allItems));
}

function getItemText(items, key, getKey = (x) => x?.id, log = false) {
    // const result = items?.find((item) => getKey(item) == key)?.text ?? null;
    const result = items?.find((item) => isMuch(getKey(item), key, false))?.text ?? null;
    if (log) console.log('項目名取得', `[${key}]`, result);
    return result;
}


function toSplitedArray(text, log = true) {
    const result = new StringTranslator(text).split(' ');
    if (log && result != text) console.log('文字列分割:', text, '->', result);
    return result;
}

function normalizeText(text, log = true) {
    const result = new StringTranslator(text).compressSpace().toKatakanaFromHiragana().toNarrowFromWideAscii().toNarrowFromWideKatakana().text.toLocaleLowerCase();
    if (log && result != text) console.log('文字列正規化:', text, '->', result);
    return result;
}

function translateCommand(source, log = true) {

    if (source == null || source == undefined) return '';
    const command = normalizeText(source, false);
    const blnMinus = command.startsWith('-');
    let result;

    try {
        for (let group of tlanslateTable) {
            result = normalizeText(group[0]);
            for (let i = 0; i < group.length; i++) {
                // if (normalizeText(group[i], false) == command.replace(/^\-/g, '')) return `${blnMinus ? '-' : ''}${result}`;
                if (isMuch(group[i], command.replace(/^\-/g, ''))) return `${blnMinus ? '-' : ''}${result}`;
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
    buttons.splice(0);
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
        resetDogs();
    }
}

// [ランダム表示]コマンド
function doRandomCommand() {
    console.log('コマンド実行', 'ランダム表示');
    appearDogByCommand(COMMAND_RANDOM);
}

// ボタン追加コマンド
function doButtonCommand(text = '') {
    if (isPlayMode(currentMode)) return;
    if ((text ?? '') != '' && buttons.includes(text)) return;
    UpdateButtonInfo();
    console.log('ボタン追加', text);

    buttons.push(text);
    buildButtons(currentMode);
}


// 汎用コマンド実行
function doCommand(text) {

    const command = translateCommand(text);
    if (command.length == 0) return;

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
        if (isEditMode()) {
            switch (command) {
                case COMMAND_PLAY:
                    changeMode(false);
                    return;
                case COMMAND_EVERY:
                    controlItems.forEach(x => x.enabled = true);
                    buildControls(currentMode, true);
                    return;
                case COMMAND_ALL:
                    doCommand(COMMAND_CONTROLS);
                    doCommand(COMMAND_BUTTONS);
                    return;
                case COMMAND_CONTROLS:
                    resetControls(false);
                    Array.from(fieldAttributes.keys()).forEach(x => appendControl(x, false));
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
                    for (let field of fieldAttributes.keys()) {
                        // if (field == command) {
                        if (isMuch(field, command)) {
                            appendControl(field);
                            return;
                        }
                        // if (command.startsWith('-') && command.slice(1) == field) {
                        if (command.startsWith('-') && isMuch(command.slice(1), field)) {
                            removeControl(field);
                            return;
                        }
                    }

                    // コントロールの有効化
                    for (let item of controlItems) {
                        // if (item.id == command) {
                        if (isMuch(item.id, command)) {
                            item.enabled = true;
                            buildControls(currentMode, true);
                            return;
                        }
                    }

                    // if (allItems.find(x => x.command == command)) {
                    if (allItems.find(x => isMuch(x.command, command))) {
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

    if (id == null || id == undefined) return;
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

    // const item = kindItems.find((k) => k.id == tileNo);
    const item = kindItems.find((k) => isMuch(k.id, tileNo));
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

    // x = Math.round(x ?? (dog.direction == DIRECTION_LEFT ? mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
    x = Math.round(x ?? (isMuch(dog.direction, DIRECTION_LEFT) ? mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
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

    const defaultValue = (value == null || value == undefined || value == VALUE_RANDOM) ? getDefaultValue(field) : value;
    const component = getComponent(field);
    if (component == null && value != VALUE_RANDOM) return defaultValue;

    let items;
    // switch (controls.find((c) => c.field == field)?.type) {
    switch (controls.find((c) => isMuch(c.field, field))?.type) {
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

    // value = value ?? component?.number ?? items?.find((x) => x.command?.toString().toLocaleLowerCase() == translateCommand(component?.text))?.id ?? defaultValue;
    value = value ?? component?.number ?? items?.find((x) => isMuch(x.command, translateCommand(component?.text)))?.id ?? defaultValue;
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

function getFieldAttribute(field) {
    return fieldAttributes.get(field) ?? null;
}

function getItems(field) {
    return getFieldAttribute(field)?.items;
}
function getDefaultValue(field, translateCommand = false) {
    const defaultItem = getFieldAttribute(field)?.items?.find((x) => x?.default);
    return (translateCommand ? defaultItem.command : null) ?? defaultItem.id ?? null;
}
function getCheckedValue(field) {
    return getFieldAttribute(field)?.items?.find((x) => x?.useCheck)?.id;
}
function getOptionItems(field) {
    return getFieldAttribute(field)?.items?.filter((x) => x.useOption);
}
function getCheckItems(field) {
    return getFieldAttribute(field)?.items?.filter((x) => x?.default || x?.useCheck);
}
function getListItems(field) {
    return getFieldAttribute(field)?.items?.filter((x) => x.useList);
}
function getCommandItems(field) {
    return getFieldAttribute(field)?.items?.filter((x) => ((x.command?.toString().trim() ?? '') != ''));
}
function getRandomItems(field) {
    return getFieldAttribute(field)?.items?.filter((x) => x.useRandom);
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
                component = new CheckBox(field, getFieldAttribute(field)?.checkText, getDefaultValue(field), getCheckedValue(field), CLASS_COMPOSITE);
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
                component = new FixedLabel(field, getDefaultValue(field), getFieldAttribute(field)?.items, CLASS_DISABLED);
                break;
            default:
                break;
        }
    } else {

        // 編集モードの場合はドロップダウンリスト固定
        // let items = controlItems.filter(item => { return ((item.control?.includes(field) ?? true) && ((item.id == type) || item.enabled)); });
        let items = controlItems.filter(item => { return ((item.control?.includes(field) ?? true) && (isMuch(item.id, type) || item.enabled)); });
        component = new DropDown(field, items, type, CLASS_SIMPLE);

    }
    return component;

}

// コントロールエリアにコンポーネントを配置してコントロールを作る
function makeControl(component, mode = MODE_PLAY, showLabel = true) {

    const CLASS_CONTROL_DESCRIPTION = 'control-description';
    const CLASS_CONTROL = 'control';
    const id = component.id;
    const control = document.createElement('div');
    control.classList.add(CLASS_CONTROL);
    control.id = `${id}Control`;

    if (showLabel) {
        let description = fieldAttributes.get(id)?.text;
        if (isEditMode(mode)) description += 'を決めるコントロール';
        const label = new FixedLabel(`${id}Label`, description, null, CLASS_CONTROL_DESCRIPTION);
        label.appendTo(control);
    }

    component.appendTo(control);

    return control;
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

function InitializeControls(code) {
    console.log('コントロール情報初期化');
    initializeControlCode();
    resetControls();
    restoreControls(code);
    logControls();
}

function resetControls(setEnabled = true) {
    console.log('コントロール情報リセット');
    controls.splice(0);
    clearControlArea();
    if (setEnabled) resetControlEnabled();
}

function initializeControlCode() {
    for (let item of controlItems) {
        item.code = '';
        for (let i = 0; i < item.id.length; i++) {
            const c = item.id.charAt(i).toLocaleLowerCase();
            if (getControlFromCode(c) == null) {
                item.code = c;
                break;
            }
        }
    }
    console.log('コントロールコード初期化', controlItems.map(x => `${x.code}:${x.id}`).join());
}

function resetControlEnabled() {
    console.log('コントロール使用状況初期化')
    controlItems.forEach(item => item.enabled = isMuch(item.id, CONTROL_TEXT));
}

function restoreControls(code) {
    code = normalizeText(code, false);
    if (code.length == 0) return;

    console.log('コントロール配置復元', code);

    let field = null;
    for (let i = 0; i < code.length; i++) {

        const c = code.charAt(i);

        if (i % 2 == 0) {
            field = getFieldFromCode(c);
        } else if (field != null) {
            if (controls.find(x => isMuch(x.field, field)) != null) continue;
            const type = getControlFromCode(c) ?? CONTROL_TEXT;
            const index = controlItems?.findIndex(x => isMuch(x.id, type));
            if (index >= 0) controlItems[index].enabled = true;
            controls.push({ field: field, type: type });
        }
    }
}

function getControlsCode() {

    let code = '';
    for (let c of controls) {
        const fieldCode = getFieldAttribute(c.field).code;
        const typeCode = controlItems.find(x => isMuch(x.id, c.type))?.code;
        code += normalizeText(`${fieldCode}${typeCode}`, false);
    }
    return code;
}

function logControls() {
    for (let item of controlItems) {
        console.log(`[${item.id}]${item.text}(${item.code}):`, item.enabled ? '使用可' : '使用不可');
    }
    for (let item of controls) {
        const attr = getFieldAttribute(item.field)
        console.log(attr.text, getItemText(controlItems, item.type));
    }
    console.log("コントロールコード:", getControlsCode());
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

        console.log('コントロール配置:', `[${fieldAttributes.get(control.field).text}]`, getItemText(controlItems, control.type));

        if (isMuch(control.field, FIELD_KIND) && isMuch(control.type, CONTORL_IMAGELIST)) {
            appendExtraKinds();
        }
        let component = createComponent(control.field, control.type, mode);

        // テキストボックスの場合はEnterキーで発動できるように
        if (isPlayMode(mode) && isMuch(control.type, CONTROL_TEXT) && component instanceof TextBox) {
            component.textBox.setAttribute('onKeyPress', 'textBox_KeyPress(event);');
        }

        addComponent(component);
        controlArea.appendChild(makeControl(component, mode));
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
    doCommand(getCommandText());
}

function onModeChangeButton_Click() {
    console.log('イベント:', '[モード変更ボタン]マウスクリック');
    changeMode(isPlayMode(currentMode))
}

function onCommandText_KeyPress(event) {
    if (event.keyCode == 13) {
        console.log('イベント:', '[コマンドテキストボックス]Enterキー押下');
        event.preventDefault();
        doCommand(getCommandText());
    }
}

function onTextBox_KeyPress(event) {
    if (event.keyCode == 13) {
        console.log('イベント:', '[項目テキストボックス]Enterキー入力');
        doCommand(COMMAND_DOG);
        event.preventDefault();
    }
}

function onRunButton_Click(command, caption) {
    console.log('イベント:', `[${caption}]ボタンクリック`);
    doCommand(command);
}


function isPlayMode(mode = null) { return ((mode ?? currentMode) == MODE_PLAY); }
function isEditMode(mode = null) { return !isPlayMode(mode); }

function UpdateDebugArea(visible) {
    const debugArea = document.querySelector(HTML_ID_DEBUG_AREA);
    if (debugArea == null) return;
    debugArea.style.display = visible ? STYLE_VALUE_BLOCK : STYLE_VALUE_NONE;
}

function UpdateMainScreen(isDebugMode) {
    mainScreen.isDebugMode = isDebugMode
    mainScreen.render(isDebugMode);
}

function prepareHtmlElements() {
    contentArea = document.querySelector(HTML_ID_CONTENT);
    controlArea = document.querySelector(HTML_ID_CONTROL_AREA);
    buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);
    commandBox = document.querySelector(HTML_ID_COMMAND_TEXT);
    if (commandBox instanceof HTMLInputElement && commandBox.type != 'text') commandBox = null;
}

function appendControl(field, rebuild = true) {
    const index = controls.findIndex((c) => isMuch(c.field, field))
    if (index == -1) {
        controls.push({ field: field, type: CONTROL_TEXT });
        if (rebuild) buildControls(currentMode);
    }
}

function removeControl(field, rebuild = true) {
    console.log('コントロール除外', field);
    const index = controls.findIndex((c) => isMuch(c.field, field))
    if (index == -1 || index >= controls.length) return;
    controls.splice(index, 1);
    if (rebuild) buildControls(currentMode);
}


function getCommandText() {
    return commandBox?.value ?? '';
}



function appearBat() {

    if (batTile == null) loadBatTile('bat');
    const bat = new Bat(batTile, application.getRandom(mainScreen.width / 8, mainScreen.width / 8 * 7), application.getRandom(mainScreen.height / 8, mainScreen.height / 8 * 7));
    mainScreen.addSprite(bat, 0);
}


function setAutoMode(value) {
    if (isAutoMode) resetDogs();
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

    for (let c of commands) {
        c = translateCommand(c);
        switch (c) {
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
                direction = directionItems.find(x => isMuch(x.command, c))?.id;
                appear = true;
                break;
            case COMMAND_SPEED_FAST:
            case COMMAND_SPEED_SLOW:
                if (speed != null) break;
                speed = speedItems.find(x => isMuch(x.command, c))?.id;
                appear = true;
                break;
            case COMMAND_SIZE_BIG:
            case COMMAND_SIZE_SMALL:
            case COMMAND_SIZE_SUPERSMALL:
            case COMMAND_SIZE_SUPERBIG:
                if (size != null) break;
                size = sizeItems.find(x => isMuch(x.command, c))?.id;
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

                if (extraKinds.includes(c)) appendExtraKinds();
                const kindId = kindItems.find(x => isMuch(x.command, c))?.id;
                if (kindId != null && kind == null) {
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


function UpdateButtonInfo() {

    console.log('ボタン情報更新')

    for (let i = 0; i < buttons.length; i++) {
        const id = `#${HTML_ID_BUTTON_COMMAND}${i + 1}Component`;
        const textBox = document.querySelector(id)?.firstChild;
        if (textBox instanceof HTMLInputElement) {
            buttons[i] = textBox.value;
        }
        else {
            buttons[i] = '';
        }
    }
}


function removeButton() {
    if (isPlayMode(currentMode)) return;
    if (buttons.length > 0) buttons.pop();
    UpdateButtonInfo();
    buildButtons(currentMode);
}

function buildButtons(mode = MODE_PLAY) {

    if (buttonArea == null) return;

    console.log('ボタンインターフェース構築:', isPlayMode(mode) ? '実行モード' : '編集モード');

    clearChildElements(buttonArea);
    if (isEditMode(mode)) {
        clearChildElements(buttonArea);
        for (let i = 0; i < buttons.length; i++) {
            const text = buttons[i];
            const textBox = new TextBox(`${HTML_ID_BUTTON_COMMAND}${i + 1}`, text);
            // textBox.placeholder = `ボタン${i + 1}`;
            textBox.placeholder = '未使用';
            buttonArea.appendChild(textBox.htmlElement);
        }

    } else {
        let beforeButton = null;
        for (let text of buttons) {
            const command = translateCommand(text);
            if (command == '') continue;
            let caption = '';
            let optionNode = null;
            let styleClass = null;
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
                    caption = getItemText(allItems, command, (x) => x.command) ?? command;
                    break;
            }
            let onClick = `onRunButton_Click('${command}', '${caption}');`;
            const button = new Button(`${command}Button`, caption, onClick);
            if (optionNode != null) button.button.appendChild(optionNode);
            // if (beforeButton?.id == `${COMMAND_DOG}Button` && command?.trim().length > 0) {
            if (isMuch(beforeButton?.id, `${COMMAND_DOG}Button`) && command?.trim().length > 0) {
                beforeButton.button.classList.add('concat-button-left');
                button.button.classList.add('concat-button-right');
            }
            buttonArea.appendChild(button?.htmlElement);
            if (button != null) beforeButton = button;
        }
    }
}

function resetDogs() {
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

    resetDogs();

    if (editMode) {

        currentMode = MODE_EDIT;
        layout?.classList.add(CLASS_EDIT_MODE);

        body?.classList.add(CLASS_DARK_THEME);
        body?.classList.remove(CLASS_LIGHT_THEME);

        if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_EDIT;
        if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_EDIT;

    } else {

        if (isEditMode) UpdateButtonInfo();

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

application.run().then((runInfo) => {

    const thisApp = runInfo[0];

    thisApp.overrideConsoleLog(document.querySelector(HTML_ID_LOG_AREA));
    console.log('アプリケーション開始', runInfo.slice(1));

    const skipFrame = thisApp.getParam(PARAM_NAME_SKIP_FRAME) ?? DEFAULT_SKIP_FRAME;
    const maxFps = thisApp.getParam(PARAM_NAME_FPS) ?? DEFAULT_MAX_FPS;
    const backGround = thisApp.getParam(PARAM_NAME_BG) || null;
    const isDebug = (thisApp.getParam(PARAM_NAME_DEBUG) || 0) != 0;
    const controlsCode = thisApp.getParam(PARAM_NAME_CONTROLS);

    currentMode = thisApp.getParam(PARAM_NAME_MODE) ?? MODE_DEFAULT;
    canClickScreen = (thisApp.getParam(PARAM_NAME_CLICK) || 0) != 0;

    thisApp.onChangeDebugMode = (isDebugMode) => {
        UpdateMainScreen(isDebugMode);
        UpdateDebugArea(isDebugMode);
    };

    prepareHtmlElements();
    initializeItemTables();
    InitializeControls(controlsCode);

    const element = document.querySelector(HTML_ID_SCREEN);
    if (!(element instanceof HTMLCanvasElement)) return;

    element.style.width = STYLE_VALUE_100PERCENT;
    element.style.height = STYLE_VALUE_100PERCENT;

    mainScreen = new ActiveCanvas(element, 0, 0, null, maxFps, skipFrame, isDebug);
    mainScreen.drawOrders.push((s) => s.bottom);

    setBackground(backGround);

    // buildButtons(currentMode);
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
