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
const HTML_ID_WIDGETS_INFO = '#widgetsInfo'
const HTML_ID_WIDGET_AREA = '#widgetArea';
const HTML_ID_SCREEN = '#screen';
const HTML_ID_CONTENT = '#content';
const HTML_ID_UPDATE_LINK = "#updateLink";
const HTML_ID_SELECT_BG_AREA = '#selectBgArea';
const HTML_ID_BUTTON_TEXT = 'buttonText';

const STYLE_VALUE_NONE = 'none';
const STYLE_VALUE_BLOCK = 'block';
const STYLE_VALUE_FLEX = 'flex';
const STYLE_VALUE_100PERCENT = '100%';

const KEY_CODE_ENTER = 13;

const STRING_EMPTY = '';

// ユーザーが入力できるフィールド項目
const FIELD_ID_DIRECTION = 'direction';    // 向き
const FIELD_ID_SIZE = 'size';              // 大きさ
const FIELD_ID_SPEED = 'speed';            // 速度
const FIELD_ID_KIND = 'kind';              // 種類
const FIELD_ID_EXTRA_KIND = "extrakind";   // 拡張種類

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
const COMMAND_WIDGETS = 'widgets';
const COMMAND_BUTTONS = 'buttons';
const COMMAND_RESET_BUTTONS = '-buttons';
const COMMAND_RESET_WIDGETS = '-widgets';

const PARAM_NAME_MODE = 'm';
const PARAM_NAME_EDIT_MODE = 'e';
const PARAM_NAME_RUN_MODE = 'r';
const PARAM_NAME_DEBUG = 'g';
const PARAM_NAME_WIDGETS = 'w';
const PARAM_NAME_BG = 'b';
const PARAM_NAME_SKIP_FRAME = 'p';
const PARAM_NAME_FPS = 'f';
const PARAM_NAME_CLICK = 'c';
const PARAM_NAME_BUTTONS = 't';
const PARAM_NAME_FLAGS = 'n';
const PARAM_SEPARATOR_BUTTON = '.';
const PARAM_NAME_ENABLED_WIDGETS_TYPE = 'u';

// 動作モード
const MODE_PLAY = 0;            // 実行モード
const MODE_EDIT = 1;            // 編集モード
const MODE_DEFAULT = MODE_PLAY; // 初期状態

// ウィジェット（UI部品）
const WIDGET_TYPE_ID_FIX = 'fix';
const WIDGET_TYPE_ID_TEXT = 'text';
const WIDGET_TYPE_ID_CHECK = 'check';
const WIDGET_TYPE_ID_RADIO = 'radio';
const WIDGET_TYPE_ID_DROPDOWN = 'dropdown';
const WIDGET_TYPE_ID_SLIDER = 'slider';
const WIDGET_TYPE_ID_LIST = 'list';
const WIDGET_TYPE_ID_IMAGELIST = 'imagelist';

// 既定で使用されるウィジェット
const DEFAULT_WIDGET = WIDGET_TYPE_ID_TEXT;

const widgetTypes = [
    { id: WIDGET_TYPE_ID_FIX, text: '📍固定', code: 'f' },
    { id: WIDGET_TYPE_ID_TEXT, text: '📝テキストボックス', code: 't' },
    { id: WIDGET_TYPE_ID_CHECK, text: '✅チェックボックス', code: 'c' },
    { id: WIDGET_TYPE_ID_RADIO, text: '🔘ラジオボタン', code: 'r' },
    { id: WIDGET_TYPE_ID_DROPDOWN, text: '🔽ドロップダウン', code: 'd' },
    { id: WIDGET_TYPE_ID_LIST, text: '🚦リストボックス', code: 'l' },
    { id: WIDGET_TYPE_ID_SLIDER, text: '🎚スライダー', code: 's' },
    { id: WIDGET_TYPE_ID_IMAGELIST, text: '🖼イメージリスト', code: 'i', usableFields: [FIELD_ID_KIND] },
];

// 選択肢項目
const extraKinds = ['hotdog', 'mame', 'siro', 'wanwan', 'xmas'];

const fields = [
    { id: FIELD_ID_DIRECTION, text: '向き', checkText: '反対を向く', code: 'd' },
    { id: FIELD_ID_SIZE, text: 'サイズ', checkText: '大きくする', code: 'z' },
    { id: FIELD_ID_SPEED, text: 'スピード', checkText: '速くする', code: 'p' },
    { id: FIELD_ID_KIND, text: '種類', checkText: '違う種類', code: 'k' },
];

const widgetItems = [
    { field: FIELD_ID_DIRECTION, value: DIRECTION_LEFT, text: '左向き', command: COMMAND_DIRECTION_LEFT, useOption: true, useList: true, useRandom: true, default: true },
    { field: FIELD_ID_DIRECTION, value: DIRECTION_RIGHT, text: '右向き', command: COMMAND_DIRECTION_RIGHT, useOption: true, useList: true, useRandom: true, useCheck: true },

    { field: FIELD_ID_SIZE, value: SIZE_SUPERSMALL, text: '超小さい', command: COMMAND_SIZE_SUPERSMALL, useOption: false, useList: true, useRandom: false },
    { field: FIELD_ID_SIZE, value: SIZE_SMALL, text: '小さい', command: COMMAND_SIZE_SMALL, useOption: true, useList: true, useRandom: true },
    { field: FIELD_ID_SIZE, value: SIZE_NORMAL, text: '普通', command: COMMAND_SIZE_NORMAL, useOption: true, useList: true, useRandom: true, default: true },
    { field: FIELD_ID_SIZE, value: SIZE_BIG, text: '大きい', command: COMMAND_SIZE_BIG, useOption: true, useList: true, useRandom: true, useCheck: true },
    { field: FIELD_ID_SIZE, value: SIZE_SUPERBIG, text: '超大きい', command: COMMAND_SIZE_SUPERBIG, useOption: false, useList: true, useRandom: false },

    { field: FIELD_ID_SPEED, value: SPEED_SLOW, text: '遅い', command: COMMAND_SPEED_SLOW, useOption: true, useList: false, useRandom: true },
    { field: FIELD_ID_SPEED, value: SPEED_NORMAL, text: '普通', command: COMMAND_SPEED_NORMAL, useOption: true, useList: false, useRandom: true, default: true },
    { field: FIELD_ID_SPEED, value: SPEED_FAST, text: '速い', command: COMMAND_SPEED_FAST, useOption: true, useList: false, useRandom: true, useCheck: true },
];

const backGroundIds = [
    'field',
    'sea',
    'fantasy',
    'night',
    'out',
];

const kindNames = [
    { id: 'dog1', text: 'ブラッドハウンド' },
    { id: 'dog2', text: ' ラブラドールレトリバー' },
    { id: 'dog3', text: ' グレイハウンド' },
    { id: 'dog4', text: ' シベリアンハスキー' },
    { id: 'dog5', text: ' ブルドッグ' },
    { id: 'dog6', text: ' パグ' },
    { id: 'dog7', text: ' ロットワイラー' },
    { id: 'dog8', text: ' シェパード' },
    { id: 'dog9', text: ' グレート・デーン' },
    { id: 'dog10', text: ' ボクサー' },
    { id: 'hotdog', text: 'ホットドッグ' },
    { id: 'mame', text: '豆しば' },
    { id: 'siro', text: 'シロ' },
    { id: 'wanwan', text: 'ワンワン' },
    { id: 'xmas', text: 'クリスマス' },
];

const buttonCommands = [
    { command: COMMAND_DOG, text: '🐕', concatLeft: true, afterClass: 'dog-count', afterId: 'dogCount' },
    { command: COMMAND_BAT, text: '🦇', concatRight: true },
    { command: COMMAND_RANDOM, text: '❓', concatRight: true },
    { command: COMMAND_RESET, text: '✖', concatRight: true },
    { command: COMMAND_SIZE_BIG },
    { command: COMMAND_SIZE_SMALL },
    { command: COMMAND_DIRECTION_LEFT },
    { command: COMMAND_DIRECTION_RIGHT },
    { command: COMMAND_SPEED_FAST },
    { command: COMMAND_SPEED_SLOW },
];

const translateTable = [
    [FIELD_ID_DIRECTION, 'dir', 'muki', '向き', 'むき', 'houkou', '方向', 'ほうこう'],
    [FIELD_ID_SIZE, 'siz', 'サイズ', '大きさ', 'おおきさ', 'saizu', 'ookisa'],
    [FIELD_ID_SPEED, 'sped', 'spe', 'spd', 'スピード', '速さ', '早さ', 'はやさ', 'hayasa', 'supido'],
    [FIELD_ID_KIND, 'kin', 'knd', 'typ', 'type', 'タイプ', '種類', 'しゅるい', '画像', 'がぞう', '犬種', 'けんしゅ', 'shurui', 'syurui', 'keshu', 'kensyu'],
    [COMMAND_PLAY, 'playmode', COMMAND_RUN, COMMAND_GO, '再生', '再生モード', '実行', '始め', 'はじめ', '動け', 'うごけ'],
    [COMMAND_EDIT, 'editmode', '編集', '編集モード', 'make', '作る', '直す', 'つくる', 'なおす'],
    [COMMAND_DEBUG, 'デバッグ'],
    [COMMAND_DOG, '犬', 'いぬ', '走れ', 'はしれ'],
    [WIDGET_TYPE_ID_TEXT, 'textbox', 'input', 'テキストボックス'],
    [WIDGET_TYPE_ID_CHECK, 'checkbox', 'チェックボックス', 'チェック'],
    [WIDGET_TYPE_ID_RADIO, 'radiobutton', 'option', 'optionbox', 'ラジオボタン', 'ラジオ', 'オプション'],
    [WIDGET_TYPE_ID_DROPDOWN, 'drop', 'ドロップ', 'dropdownbox', 'dropdownlist', 'combobox', 'combo', 'ドロップダウン', 'ドロップダウンリスト'],
    [WIDGET_TYPE_ID_LIST, 'listbox', 'リストボックス', '一覧', 'リスト'],
    [WIDGET_TYPE_ID_SLIDER, 'slid', 'srider', 'trackbar', 'スライダー', 'トラックバー'],
    [WIDGET_TYPE_ID_IMAGELIST, 'image', 'イメージリスト', '画像リスト', '画像一覧', 'イメージ'],
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
    [COMMAND_WIDGETS, 'controls', 'wijets', 'widets', 'wigets'],
];


const widgets = [{ fieldId: 'dummy', type: 'dummy' }];
const buttonTexts = [];

const shadowTile = new ShadowTile();
const dogTiles = new Map();

let components = new Map();

let batTile = null;
let backGroundTile = null;
let backGroundId = null;

let layoutArea = null;
let modeText = null;
let modeDescription = null;
let mainScreen = null;
let widgetArea = null;
let contentArea = null;
let buttonArea = null;
let debugArea = null;
let commandBox = null;
let widgetsInfoArea = null;
let updateLinkAnchor = null;
let selectBgArea = null;

let totalDogCount = 0;
let visibleDogCount = 0;

let currentMode = MODE_DEFAULT;

let canClickScreen = false;
let isAutoMode = false;
let isPausing = false;
let existsExtraKinds = false;
let defaultWidgetTypesEnabled;

function initializeWidgetItems(log = false) {
    console.log('項目テーブル初期化');

    createSpeedItems();
    createKindItems();
    normalizeWidgetItems();

    if (log) console.log('全項目テーブル:', toStringFromItems(getItems()));

}

function normalizeWidgetItems(log = false) {
    console.log('項目テーブル正規化');

    for (let item of widgetItems) {
        item.field = normalizeText(item.field, true, log);
        item.command = normalizeText(item.command, true, log);
        item.text = item.text?.trim() ?? STRING_EMPTY;
    }
}

function normalizeTranslateTable(log = false) {
    console.log('コマンド変換テーブル正規化');
    for (let i in translateTable) {
        for (let j in translateTable[i]) {
            translateTable[i][j] = normalizeText(translateTable[i][j], true, log);
        }
    }

    if (log) for (let group of translateTable) console.log(group.slice(0, 1), group.slice(1));

}

function getFieldIdByCode(code, log = false) {
    const result = fields.find(f => equals(f.code, code))?.id;
    if (!isNone(code) && log) console.log('コードからフィールドを取得', `${code} -> ${result ?? '取得失敗'}`);
    return result;
}

function getWidgetTypeByCode(code, log = false) {
    const result = widgetTypes.find(x => equals(x.code, code))?.id || null;
    if (!isNone(code) && log) console.log('コードからウィジェット種類を取得', `${code} -> ${result ?? '取得失敗'}`);
    return result;
}

function toStringFromItems(items) {
    return items?.map(x => `${x?.command ?? 'none'}[${x?.value}]:${x?.text}`)?.join(', ');
}

function createSpeedItems(log = false) {

    const names = getCommandItems(FIELD_ID_SPEED);
    for (let value = SPEED_MIN; value <= SPEED_MAX; value++) {
        let listText = `速度${value}`;
        let description = getTextByValue(names, value);
        if (!isNone(description)) listText += `(${description})`;
        widgetItems.push({ field: FIELD_ID_SPEED, value: value, text: listText, command: null, useOption: false, useList: true, useRandom: true });
    }
    console.log('速度項目作成追加', !log ? '' : toStringFromItems(getItems(FIELD_ID_SPEED)));
}

function createKindItems(log = false) {

    for (let value = DOG_IMAGE_NO_MIN; value <= DOG_IMAGE_NO_MAX; value++) {
        const imageId = `dog${value}`;
        const text = kindNames.find(x => equals(x.id, imageId))?.text ?? `犬${value}`;
        widgetItems.push({ field: FIELD_ID_KIND, value: value, text: text, src: `img/${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true, default: (value == DOG_IMAGE_NO_MIN), useCheck: (value == DOG_IMAGE_NO_MAX) });
    }

    let value = DOG_IMAGE_NO_MAX;
    for (let imageId of extraKinds) {
        if (getItems(FIELD_ID_KIND, FIELD_ID_EXTRA_KIND).map(x => x.imageId).includes(imageId)) continue;
        value++;
        const text = kindNames.find(x => equals(x.id, imageId))?.text ?? `特殊犬${value - DOG_IMAGE_NO_MAX + 1}`;
        widgetItems.push({ field: FIELD_ID_EXTRA_KIND, value: value, text: text, src: `img/@dog${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
    }

    console.log('種類項目作成追加', !log ? '' : toStringFromItems(getItems(FIELD_ID_KIND, FIELD_ID_EXTRA_KIND)));
}

function appendExtraKinds(log = false) {

    if (existsExtraKinds) return;
    for (let item of getItems(FIELD_ID_EXTRA_KIND)) item.field = FIELD_ID_KIND;
    existsExtraKinds = true;

    console.log('種類テーブル特殊犬追加', !log ? '' : toStringFromItems(getItems(FIELD_ID_KIND)));

}

function getItems(...fieldIds) {
    if (isNone(fieldIds) || fieldIds.length == 0) return widgetItems;
    return widgetItems.filter(x => fieldIds.map(x => normalizeText(x)).includes(x.field));
}

function getTextByValue(items, value, log = false) {
    return getTextByAny(items, value, (x) => x.value, log);
}
function getTextByCommand(items, command, log = false) {
    return getTextByAny(items, command, (x) => x.command, log);
}
function getTextById(items, id, log = false) {
    return getTextByAny(items, id, (x) => x.id, log);
}
function getTextByAny(items, key, getKey = (x) => x, log = false) {
    const result = items?.find((item) => equals(getKey(item), key))?.text ?? null;
    if (log) console.log('項目名取得', `[${key}]`, result);
    return result;
}


function translateCommand(source, log = true) {

    if (isNone(source)) return STRING_EMPTY;
    const command = normalizeText(source, false);
    const blnMinus = command.startsWith('-');
    let result;
    let tokens = command.split(' ');

    if (isNone(tokens)) return STRING_EMPTY;

    try {
        if (tokens.length > 1) {
            for (let i in tokens) {
                tokens[i] = translateCommand(tokens[i], false);
            }
            result = tokens.join(' ');
            return result;
        } else {
            for (let group of translateTable) {
                result = group[0];
                for (let i = 0; i < group.length; i++) {
                    if (equals(group[i], command.replace(/^[\-]/g, STRING_EMPTY), false, false)) {
                        result = `${blnMinus ? '-' : STRING_EMPTY}${result}`;
                        return result;
                    }
                }
            }
            result = command;
            return result;
        }
    } finally {
        if (log && source != result) console.log('コマンド変換:', source, '->', result);
    }
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
        resetBackground();
        resetWidgetTypes();
        resetWidgets();
        buildWidgetArea(mode);
        resetButtons();
        buildButtons(mode);
        setAutoMode(false);
        setClickable(false);
        updateLinkUrl();
    }
    resetSprites();
}

// [ランダム表示]コマンド
function doRandomCommand() {
    console.log('コマンド実行', 'ランダム表示');
    appearDogByCommand(COMMAND_RANDOM);
}

// ボタン追加コマンド
function appendButton(text = STRING_EMPTY, rebuild = true) {
    if (!isBlank(text) && buttonTexts?.includes(x => equals(x.value, text))) return;
    console.log('ボタン追加', text);

    const textBox = new TextBox(`${HTML_ID_BUTTON_TEXT}${buttonTexts.length + 1}`, text);
    textBox.placeholder = '未使用';
    textBox.onUpdateValue = () => {
        UpdateWidgetTypes();
        updateLinkUrl();
    };

    buttonTexts.push(textBox);
    updateLinkUrl();
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
                    widgetTypes.forEach(x => x.enabled = true);
                    buildWidgetArea(currentMode, true);
                    return;
                case COMMAND_ALL:
                    doCommand(COMMAND_WIDGETS);
                    doCommand(COMMAND_BUTTONS);
                    return;
                case COMMAND_WIDGETS:
                    resetWidgets();
                    fields.forEach(f => appendField(f.id));
                    buildWidgetArea(currentMode, false, false, true);
                    return;
                case COMMAND_RESET_WIDGETS:
                    resetWidgets();
                    buildWidgetArea(currentMode)
                    return;
                case COMMAND_RESET_BUTTONS:
                    resetButtons();
                    buildButtons(currentMode);
                    return;
                case COMMAND_BUTTONS:
                    for (let i = 0; i < 4; i++) appendButton();
                    return;
                case COMMAND_BUTTON:
                    appendButton();
                    return;
                case `-${COMMAND_BUTTON}`:
                    removeButton();
                    return;
                // case COMMAND_DOG:
                // case COMMAND_BAT:
                // case COMMAND_RANDOM:
                //     appendButton(command);
                //     return;
                default:

                    // コマンドボタンの直接配置(xxxxbuttonでボタン追加)
                    if (command.endsWith('button')) {
                        appendButton(command.replace(/button$/g, STRING_EMPTY));
                        return;
                    }

                    // 設定可能フィールドの追加と除外（-xxxxxxx)で除外
                    for (let fieldId of fields.map(f => f.id)) {
                        if (equals(fieldId, command, true, false)) {
                            appendField(fieldId);
                            return;
                        }
                        if (command.startsWith('-') && equals(command.slice(1), fieldId)) {
                            removeField(fieldId);
                            return;
                        }
                    }

                    // ウィジェットの有効化
                    if (setWidgetTypeEnabled(command, true)) {
                        buildWidgetArea(currentMode, true);
                        return;
                    }

                    // if (widgetItems.some(x => equals(x.command, command, false, false))) {
                    //     appendButton(command);
                    //     return;
                    // }

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
        updateLinkUrl();
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

    console.log('背景画像変更指示', id);

    if (isNone(id)) {
        backGroundId = null;
        backGroundTile = null;
        updateBgSelected();
        mainScreen?.render();
        updateLinkUrl();
        return;
    }

    let img = application.getImage(id);
    new Promise((resolve) => {
        if (img != null) resolve();
        const url = `img/${id}.png`;
        application.loadImage(id, url).then((msg) => {
            console.log('背景画像変更:', `[${id}]`, url);
            img = application.getImage(id);
            backGroundId = id;
            updateBgSelected();
            updateLinkUrl();
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

    const item = getItems(FIELD_ID_KIND).find((k) => equals(k.value, tileNo));
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



// 犬を表示する
function appearDog(x, y, kind, direction, size, speed) {

    kind = getFieldValue(FIELD_ID_KIND, kind);
    loadDogTile(kind);

    const dog = new Dog(mainScreen, dogTiles, kind, 0, 0, 0, 0, 0, getRandom(0, DOG_PATTERN_COUNT - 1));

    dog.directionTranslate = (d) => getTextByValue(getItems(FIELD_ID_DIRECTION), d);
    dog.sizeTranslate = (s) => getTextByValue(getItems(FIELD_ID_SIZE), s);
    dog.speedTranslate = (s) => getTextByValue(getItems(FIELD_ID_SPEED), s);
    dog.kindTranslate = (k) => getTextByValue(getItems(FIELD_ID_KIND), k);

    totalDogCount++;
    dog.tag = `DOG_${totalDogCount.toString().padStart(4, '0')}`;

    dog.direction = getFieldValue(FIELD_ID_DIRECTION, direction);
    dog.size = getFieldValue(FIELD_ID_SIZE, size);
    dog.speed = getFieldValue(FIELD_ID_SPEED, speed);

    x = Math.round(x ?? (equals(dog.direction, DIRECTION_LEFT, false, true) ? mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
    y = Math.round(y ?? (getRandom(0, mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);

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

    console.log('犬を表示:', `[${dog.tag}]`, `座標:(${dog.x}, ${dog.y})`, `種類:${getTextByValue(getItems(FIELD_ID_KIND), dog.kind)}`, getTextByValue(getItems(FIELD_ID_DIRECTION), dog.direction), getTextByValue(getItems(FIELD_ID_SIZE), dog.size), getTextByValue(getItems(FIELD_ID_SPEED), dog.speed));

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


// 各フィールドの値をコンポーネントに設定
function setFieldValue(fieldId, value) {
    console.log('コンポーネント値設定:', `[${fieldId}]`, value);
    getComponent(fieldId)?.setValue(value);
}

function getFieldValue(fieldId, value) {

    const defaultValue = (isNone(value) || value == VALUE_RANDOM) ? getDefaultValue(fieldId) : value;
    const component = getComponent(fieldId);
    if (component == null && value != VALUE_RANDOM) return defaultValue;

    let items;
    switch (widgets.find((c) => equals(c.fieldId, fieldId))?.type) {
        case WIDGET_TYPE_ID_TEXT:
            items = getCommandItems(fieldId);
            break;
        case WIDGET_TYPE_ID_RADIO:
            items = getOptionItems(fieldId);
            break;
        case WIDGET_TYPE_ID_CHECK:
            items = getCheckItems(fieldId);
            break;
        default:
            items = getListItems(fieldId);
    }


    // preferredValue = preferredValue ?? component?.number ?? items?.find((x) => equals(x.command, translateCommand(component?.text), true, false))?.id ?? defaultValue;
    value = value ?? component?.number ?? items?.find((x) => equals(x.command, translateCommand(component?.text), true, false))?.value ?? defaultValue;
    if (component?.text == COMMAND_RANDOM || value == VALUE_RANDOM) {
        items = items.filter((x) => x.useRandom);
        value = getRandomSelect(...getValues(items));
    }

    if (!getValues(items)?.includes(value)) {
        console.log('getFieldValue', fieldId, '不正な値')
        value = defaultValue;
    }

    return value;
}

function getValues(item) {
    // return item?.map((x) => x.id);
    return item?.map((x) => x.value);
}

function getComponent(fieldId) {
    return components.get(fieldId) ?? null;
}

function addComponent(component) {
    if (component != null) {
        components.set(component.id, component);
    }
}

function getFieldById(fieldId) {
    return fields.find(f => equals(f.id, fieldId));
}

function getDefaultValue(fieldId, translateCommand = false) {
    const defaultItem = getItems(fieldId)?.find((x) => x?.default);
    return (translateCommand ? defaultItem.command : null) ?? defaultItem.value ?? null;
}
function getCheckedValue(fieldId) {
    return getItems(fieldId)?.find((x) => x?.useCheck)?.value;
}
function getOptionItems(fieldId) {
    return getItems(fieldId)?.filter((x) => x.useOption);
}
function getCheckItems(fieldId) {
    return getItems(fieldId)?.filter((x) => x?.default || x?.useCheck);
}
function getListItems(fieldId) {
    return getItems(fieldId)?.filter((x) => x.useList);
}
function getCommandItems(fieldId) {
    return getItems(fieldId)?.filter((x) => !isBlank(x.command));
}
function getRandomItems(fieldId) {
    return getItems(fieldId)?.filter((x) => x.useRandom);
}

// 入力コンポーネントを作成
function createComponent(fieldId, type, mode = MODE_PLAY) {

    const CLASS_SIMPLE = 'simple-component';
    const CLASS_COMPOSITE = 'composite-component';
    const CLASS_DISABLED = 'disabled-component';
    const CLASS_IMAGELIST = 'imagelist-component';

    let component = null;

    if (isPlayMode(mode)) {
        switch (type) {
            case WIDGET_TYPE_ID_TEXT:
                component = new TextBox(fieldId, getDefaultValue(fieldId, true), getCommandItems(fieldId), CLASS_SIMPLE);
                break;
            case WIDGET_TYPE_ID_RADIO:
                component = new RadioButtons(fieldId, getOptionItems(fieldId), getDefaultValue(fieldId), CLASS_COMPOSITE);
                break;
            case WIDGET_TYPE_ID_CHECK:
                component = new CheckBox(fieldId, getFieldById(fieldId)?.checkText, getDefaultValue(fieldId), getCheckedValue(fieldId), CLASS_COMPOSITE);
                break;
            case WIDGET_TYPE_ID_DROPDOWN:
                component = new DropDown(fieldId, getListItems(fieldId), getDefaultValue(fieldId), CLASS_SIMPLE);
                break;
            case WIDGET_TYPE_ID_LIST:
                component = new ListBox(fieldId, getListItems(fieldId), getDefaultValue(fieldId), CLASS_SIMPLE, null, () => { doCommand(COMMAND_DOG); });
                break;
            case WIDGET_TYPE_ID_SLIDER:
                component = new Slider(fieldId, getListItems(fieldId), getDefaultValue(fieldId), CLASS_COMPOSITE);
                break;
            case WIDGET_TYPE_ID_IMAGELIST:
                component = new ImageList(fieldId, getListItems(fieldId), getDefaultValue(fieldId), CLASS_IMAGELIST, () => { doCommand(COMMAND_DOG); });
                break;
            case WIDGET_TYPE_ID_FIX:
                component = new FixedLabel(fieldId, getDefaultValue(fieldId), getItems(fieldId), CLASS_DISABLED);
                break;
            default:
                break;
        }
    } else {

        // 編集モードの場合はドロップダウンリスト固定
        let items = widgetTypes.filter(x => ((equals(x.id, type)) || x.enabled) && (x.usableFields?.includes(fieldId) ?? true)).map(x => [{ value: x.id, text: x.text }]).flat();
        component = new DropDown(fieldId, items, type, CLASS_SIMPLE);
        component.onUpdateValue = () => {
            UpdateWidgetTypes();
            updateLinkUrl();
        }
    }
    return component;

}

// ウィジェットを構成するHTMLエレメントを生成して取得する
function generateWidgetElement(component, mode = MODE_PLAY, showLabel = true) {

    const CLASS_WIDGET_DESCRIPTION = 'widget-description';
    const CLASS_WIDGET = 'widget';

    const fieldId = component.id;
    const element = document.createElement('div');
    element.classList.add(CLASS_WIDGET);
    element.id = `${fieldId}widget`;

    if (showLabel) {
        let description = fields.find(f => equals(f.id, fieldId, true, false))?.text;
        if (isEditMode(mode)) description += 'を決めるウィジェット';
        const label = new FixedLabel(`${fieldId}Label`, description, null, CLASS_WIDGET_DESCRIPTION);
        label.appendTo(element);
    }
    component.appendTo(element);

    return element;
}

// 指定要素の子ノードをすべて削除する
function clearChildElements(parent) {
    console.log('HTML子ノード全削除', parent.id);
    while (parent?.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function InitializeWidgets(code, hexCode) {
    console.log('ウィジェット初期化', code, hexCode);

    resetWidgetTypes(hexCode);
    resetWidgets(code);
    logWidgetsInfo();

}

function resetWidgetTypes(hexCode) {
    console.log('ウィジェット使用状況リセット', hexCode)

    widgetTypes.forEach(item => item.enabled = equals(item.id, DEFAULT_WIDGET, false, true));
    defaultWidgetTypesEnabled = getWidgetTypesEnabledAsHexCode();

    setWidgetTypesEnabledByHexCode(hexCode);
    console.log('ウィジェット利用可否コード規定値', defaultWidgetTypesEnabled)

}

function clearWidgetArea() {
    console.log('表示コンポーネント消去')
    clearChildElements(widgetArea);
    components.clear();
}
function clearWidgets() {
    console.log('ウィジェット配置情報全消去');
    widgets.splice(0);
}

function resetBackground() {
    setBackground();
}

function resetWidgets(restoreCode) {

    console.log('ウィジェット配置リセット');
    clearWidgets();
    clearWidgetArea();

    if (isBlank(restoreCode)) return;

    restoreCode = normalizeText(restoreCode);
    let fieldId = null;
    for (let pos = 0; pos < restoreCode.length; pos++) {
        const char = restoreCode.charAt(pos);
        if (pos % 2 == 0) {
            fieldId = getFieldIdByCode(char);
        } else if (fieldId != null) {
            if (widgets.find(x => equals(x.fieldId, fieldId)) != null) continue;
            const type = getWidgetTypeByCode(char) ?? DEFAULT_WIDGET;
            setWidgetTypeEnabled(type, true);
            widgets.push({ fieldId: fieldId, type: type });
        }
    }
    console.log('ウィジェット配置復元', restoreCode, widgets);
}

function initializeButtons(restoreCode) {

    console.log('ボタン初期化');

    normalizeButtonCommands();
    resetButtons(restoreCode);

}

function normalizeButtonCommands(log = false) {
    for (let item of buttonCommands) {
        item.command = normalizeText(item.command);
    }
    console.log('ボタンコマンド正規化', !log ? '' : buttonCommands);
}

function resetButtons(restoreCode) {

    console.log('ボタン配置リセット');
    buttonTexts.splice(0);
    clearButtonArea();

    restoreCode = normalizeText(restoreCode, false);
    if (isBlank(restoreCode)) return;

    const codes = restoreCode.split(PARAM_SEPARATOR_BUTTON);
    if (codes?.filter(x => !isBlank(x)).length == 0) codes.pop();
    for (let text of codes) appendButton(text, false);

    console.log('ボタン配置復元', restoreCode, buttonTexts);

}

function getButtonRestoreCode() {
    let result = STRING_EMPTY;
    for (let text of buttonTexts.map(x => x.value)) {
        if (isBlank(text)) {
            result += PARAM_SEPARATOR_BUTTON;
            continue;
        }
        if (!isBlank(result) && !result.endsWith(PARAM_SEPARATOR_BUTTON)) {
            result += PARAM_SEPARATOR_BUTTON;
        }
        result += text;
    }

    return result;
}

function getWidgetsRestoreCode() {

    let result = STRING_EMPTY;
    for (let widget of widgets) {
        const fieldCode = getFieldById(widget.fieldId).code;
        const typeCode = widgetTypes.find(x => equals(x.id, widget.type))?.code;
        result += normalizeText(`${fieldCode}${typeCode}`);
    }
    return result;
}

function logWidgetsInfo() {

    console.log('ウィジェット使用可能状況');
    for (let widgetType of widgetTypes) {
        console.log(`[${widgetType.id}]${widgetType.text}(${widgetType.code}):`, widgetType.enabled ? '使用可' : '使用不可');
    }
    console.log('フィールド別ウィジェット種類', widgets);
    for (let widget of widgets) {
        const fieldId = getFieldById(widget.fieldId)
        if (isNone(fieldId)) continue;
        console.log(fieldId?.text, getTextById(widgetTypes, widget.type));
    }
    console.log("ウィジェット復元コード:", getWidgetsRestoreCode());
    console.log('ウィジェット使用可否復元コード', getWidgetTypesEnabledAsHexCode());

}

function getWidgetTypesEnabledAsHexCode() {
    let result = 0;
    for (let e of widgetTypes.map(x => x.enabled)) {
        result = result << 1;
        if (e) result |= 0x1;
    }
    return result.toString(16);
}
function setWidgetTypesEnabledByHexCode(hexCode) {
    let number = Number.parseInt(`0x${hexCode}`) || 0;
    console.log('ウィジェット利用可否値', number);
    for (let i = widgetTypes.length - 1; i >= 0; i--) {
        widgetTypes[i].enabled = ((number & 0x1) != 0) || equals(widgetTypes[i].id, DEFAULT_WIDGET, false, true);
        number = number >> 1;
    }
}

function getWidgetTypeById(id) {
    return widgetTypes.find(c => equals(c.id, id));
}

function setWidgetTypeEnabled(id, value) {
    console.log('ウィジェット使用可否設定', id, value);
    const widgetType = getWidgetTypeById(id);
    if (widgetType == null) return false;
    widgetType.enabled = value;
    return true;
}

function UpdateWidgetTypes() {

    clearWidgets();
    components.forEach((component) => {
        const id = component.id;
        const type = component.value ?? DEFAULT_WIDGET;
        addWidgets(id, type);
    });
    console.log('ウィジェット種類更新:', getWidgetsRestoreCode());
}
function addWidgets(fieldId, type) {
    console.log('ウィジェット追加', fieldId, type);
    widgets.push({ fieldId: fieldId, type: type });
}

function buildWidgetArea(mode = MODE_PLAY, update = false, newWidget = false, all = false) {

    console.log('ウィジェットエリア構築:', widgets);

    if (update) UpdateWidgetTypes();

    clearChildElements(widgetArea);
    clearWidgetArea();

    if (isEditMode(mode)){
        widgetsInfoArea.style.display = STYLE_VALUE_FLEX;

        const items = widgetTypes.filter(x=>x.enabled);
        const widgetsList = new ListBox('enabledWidgetsList', items);
        // widgetsInfoArea.appendChild(widgetsList.htmlElement);
        console.log(widgetsList.htmlElement);

    } else {
        widgetsInfoArea.style.display =STYLE_VALUE_NONE;
    }

    for (let widget of widgets) {

        console.log('ウィジェット配置:', `[${fields.find(f => equals(f.id, widget.fieldId))?.text}]`, getTextById(widgetTypes, widget.type));

        if (equals(widget.fieldId, FIELD_ID_KIND) && equals(widget.type, WIDGET_TYPE_ID_IMAGELIST)) {
            appendExtraKinds();
        }
        let component = createComponent(widget.fieldId, widget.type, mode);

        if (all || (newWidget && widgets.slice(-1)[0].fieldId == widget.fieldId)) {
            component.addClass('new');
        }

        // テキストボックスの場合はEnterキーで発動できるように
        if (isPlayMode(mode) && equals(widget.type, WIDGET_TYPE_ID_TEXT) && component instanceof TextBox) {
            component.textBox.setAttribute('onKeyPress', 'onTextBox_KeyPress(event);');
        }

        addComponent(component);
        widgetArea.appendChild(generateWidgetElement(component, mode));
    }

    console.log('ウィジェット配置コード:', getWidgetsRestoreCode());

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
            appearDog(x, y + getRandom(-8, 8));
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

function onResetButton_Click() {
    if (confirm('すべての設計内容をリセットします。\nこの操作は元に戻せません。\n\nよろしければ[OK]を押してください。')) {
        doResetCommand(MODE_EDIT);
        doResetCommand(MODE_PLAY);
        changeMode(isEditMode(currentMode));
    }
}

function buildSelectBgArea() {

    const CLASS_THUMBNAIL = 'thumbnail';

    selectBgArea.style.display = STYLE_VALUE_NONE;

    clearChildElements(selectBgArea);
    const clearBg = document.createElement('div');
    clearBg.id = 'clearBg'
    clearBg.classList.add(CLASS_THUMBNAIL);
    const p = document.createElement('p');
    p.textContent = '背景なし';
    clearBg.appendChild(p);
    clearBg.onclick = () => setBackground(null);

    selectBgArea.appendChild(clearBg);

    for (let id of backGroundIds) {
        const img = document.createElement('img');
        img.classList.add(CLASS_THUMBNAIL);
        img.id = `bg${id}`;
        img.src = `img/${id}.png`;
        img.onclick = () => setBackground(id);
        selectBgArea.appendChild(img);
    }

    updateBgSelected();
    selectBgArea.style.display = STYLE_VALUE_FLEX;

}

function updateBgSelected() {

    const id = backGroundId == null ? 'clearBg' : `bg${backGroundId}`;

    for (let thumb of selectBgArea.children) {
        if (thumb.id == id) {
            thumb.classList.add('selected');
        } else {
            thumb.classList.remove('selected');
        }
    }
}

function updateLinkUrl() {

    const params = [];

    let flags = STRING_EMPTY;

    if (!equals(currentMode, MODE_DEFAULT, false, false)) flags += isEditMode(currentMode) ? PARAM_NAME_EDIT_MODE : PARAM_NAME_RUN_MODE;
    if (canClickScreen) flags += PARAM_NAME_CLICK;
    if (application.isDebugMode) flags += PARAM_NAME_DEBUG;

    let bgId = backGroundIds.findIndex(x => equals(x, backGroundId));
    if (bgId >= 0) {
        flags += (bgId + 1).toString();
    } else {
        params.push({ param: PARAM_NAME_BG, value: backGroundId ?? STRING_EMPTY });
    }

    params.push({ param: PARAM_NAME_FLAGS, value: flags });
    params.push({ param: PARAM_NAME_WIDGETS, value: getWidgetsRestoreCode() });

    let hexCode = getWidgetTypesEnabledAsHexCode();
    if (equals(hexCode, defaultWidgetTypesEnabled)) hexCode = STRING_EMPTY;
    params.push({ param: PARAM_NAME_ENABLED_WIDGETS_TYPE, value: hexCode });
    params.push({ param: PARAM_NAME_BUTTONS, value: getButtonRestoreCode() });

    const queryString = params.filter(x => !isBlank(x.value)).map(y => `${y.param}=${encodeURIComponent(y.value)}`).join('&');
    const newUrl = (location.href.split('?')[0]) + (isBlank(queryString) ? STRING_EMPTY : '?' + queryString);

    updateLinkAnchor.setAttribute('href', newUrl);
    console.log('リンクURL更新', newUrl);

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

function updateDebugArea(visible) {
    if (isNone(debugArea)) return;
    debugArea.style.display = visible ? STYLE_VALUE_FLEX : STYLE_VALUE_NONE;
}

function updateMainScreen(isDebugMode) {
    mainScreen.isDebugMode = isDebugMode
    mainScreen.render(isDebugMode);
}

function prepareHtmlElements() {
    console.log('常用HTMLエレメント事前準備');

    layoutArea = document.querySelector(HTML_ID_LAYOUT);
    modeText = document.querySelector(HTML_ID_MODE_TEXT);
    modeDescription = document.querySelector(HTML_ID_MODE_DESCRIPTION);
    updateLinkAnchor = document.querySelector(HTML_ID_UPDATE_LINK);
    selectBgArea = document.querySelector(HTML_ID_SELECT_BG_AREA);
    contentArea = document.querySelector(HTML_ID_CONTENT);
    widgetArea = document.querySelector(HTML_ID_WIDGET_AREA);
    widgetsInfoArea = document.querySelector(HTML_ID_WIDGETS_INFO)
    buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);
    debugArea = document.querySelector(HTML_ID_DEBUG_AREA);
    commandBox = document.querySelector(HTML_ID_COMMAND_BOX);
    if (commandBox instanceof HTMLInputElement && commandBox.type != 'text') commandBox = null;
}

function appendField(fieldId, rebuild = true) {
    console.log('フィールド項目追加', fieldId);
    const index = widgets.findIndex((c) => equals(c.fieldId, fieldId))
    if (index == -1) {
        widgets.push({ fieldId: fieldId, type: DEFAULT_WIDGET });
        if (rebuild) buildWidgetArea(currentMode, false, true);
    }
}

function removeField(fieldId, rebuild = true) {
    console.log('フィールド項目除外', fieldId);
    const index = widgets.findIndex((c) => equals(c.fieldId, fieldId))
    if (index == -1 || index >= widgets.length) return;
    widgets.splice(index, 1);
    if (rebuild) buildWidgetArea(currentMode);
}

function getCommandBoxText() {
    const result = commandBox?.value ?? STRING_EMPTY;
    return result;
}

function appearBat() {

    if (batTile == null) loadBatTile('bat');
    const bat = new Bat(batTile, getRandom(mainScreen.width / 8, mainScreen.width / 8 * 7), getRandom(mainScreen.height / 8, mainScreen.height / 8 * 7));
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
                direction = getItems(FIELD_ID_DIRECTION).find(x => equals(x.command, command, false, false))?.value;
                appear = true;
                break;
            case COMMAND_SPEED_FAST:
            case COMMAND_SPEED_SLOW:
                if (speed != null) break;
                speed = getItems(FIELD_ID_SPEED).find(x => equals(x.command, command, false, false))?.value;
                appear = true;
                break;
            case COMMAND_SIZE_BIG:
            case COMMAND_SIZE_SMALL:
            case COMMAND_SIZE_SUPERSMALL:
            case COMMAND_SIZE_SUPERBIG:
                if (size != null) break;
                size = getItems(FIELD_ID_SIZE).find(x => equals(x.command, command, false, false))?.value;
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
                const kindId = getItems(FIELD_ID_KIND).find(x => equals(x.command, command, false, false))?.value;
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

    console.log('フィールド表示項目更新', dog.direction, dog.size, dog.speed, dog.kind);

    if (!(dog instanceof Dog)) return;

    setFieldValue(FIELD_ID_DIRECTION, dog.direction);
    setFieldValue(FIELD_ID_SIZE, dog.size);
    setFieldValue(FIELD_ID_SPEED, dog.speed);
    setFieldValue(FIELD_ID_KIND, dog.kind);

}

function removeButton(componentId) {

    console.log('ボタン削除', componentId);

    if (isNone(componentId)) {
        if (buttonTexts.length > 0) buttonTexts.pop();
    }
    else {
        const idx = buttonTexts.findIndex(x => equals(x.id, componentId))
        if (idx < 0) return;
        buttonTexts.splice(idx, 1);
    }
    buildButtons(currentMode);
}

function clearButtonArea() {
    clearChildElements(buttonArea);
    console.log('ボタンエリア消去', buttonArea);
}

function buildButtons(mode = MODE_PLAY) {

    if (buttonArea == null) return;

    console.log('ボタンインターフェース構築:', isPlayMode(mode) ? '実行モード' : '編集モード');

    clearButtonArea();
    if (isEditMode(mode)) {
        for (let component of buttonTexts) {
            buttonArea.appendChild(component.htmlElement);
            const removeButton = new Button('removeButton', '-', `removeButton('${component.id}');`);
            removeButton.button.classList.add('remove-button');
            buttonArea.appendChild(removeButton.htmlElement);
        }

        const appendButton = new Button('appendButton', '+', 'appendButton();');
        appendButton.button.classList.add('append-button');
        buttonArea.appendChild(appendButton.htmlElement);

    } else {
        let previousComponent = null;
        let previousConcatLeft = false;
        for (let textBox of buttonTexts) {
            const command = translateCommand(textBox?.value);
            if (isBlank(command)) continue;
            const buttonCommand = buttonCommands.find(x => equals(x.command, command, false, false));
            const caption = buttonCommand?.text ?? getTextByCommand(widgetItems, command) ?? command
            const nodes = [null, null];
            for (let index = 0; index < nodes.length; index++) {
                let styleClass = null;
                let spanId = null;
                switch (index) {
                    case 0:
                        styleClass = buttonCommand?.beforeClass;
                        spanId = buttonCommand?.beforeId ?? spanId;
                        break;
                    case 1:
                        styleClass = buttonCommand?.afterClass;
                        spanId = buttonCommand?.afterId ?? spanId;
                        break;
                }
                if (isNone(styleClass) && isNone(spanId)) continue;
                nodes[index] = document.createElement('span');
                nodes[index].id = spanId;
                nodes[index].classList.add(styleClass);
            }

            console.log('コマンド', command);

            const onClick = `onActButton_Click('${command}', '${caption}');`;
            const button = new Button(`${command}Button`, caption, onClick, null, ...nodes);

            if (previousConcatLeft && buttonCommand?.concatRight) {
                previousComponent.button.classList.add('concat-button-left');
                button.button.classList.add('concat-button-right');
            }
            buttonArea.appendChild(button?.htmlElement);
            if (button != null) {
                previousComponent = button;
                previousConcatLeft = buttonCommand?.concatLeft ?? null;
            }

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
    commandBox.value = STRING_EMPTY;
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

    resetSprites();

    if (editMode) {

        currentMode = MODE_EDIT;
        layoutArea?.classList.add(CLASS_EDIT_MODE);

        body?.classList.add(CLASS_DARK_THEME);
        body?.classList.remove(CLASS_LIGHT_THEME);

        if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_EDIT;
        if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_EDIT;

    } else {

        currentMode = MODE_PLAY;
        layoutArea?.classList.remove(CLASS_EDIT_MODE);

        body?.classList.add(CLASS_LIGHT_THEME);
        body?.classList.remove(CLASS_DARK_THEME);

        if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_PLAY;
        if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_PLAY;

    }

    console.log('モード変更:', editMode ? `編集モード(${currentMode})` : '再生モード', widgets);

    buildWidgetArea(currentMode, !first && isPlayMode(currentMode));
    buildButtons(currentMode);

    commandBox?.focus();

    if (isPlayMode(currentMode)) {
        updateDogCount();
        mainScreen?.start();
    }

    updateLinkUrl();

}

function getBackGroundId(code) {
    if (code > 0 && code <= backGroundIds.length) {
        const index = Number.parseInt(code) - 1;
        return backGroundIds[index];
    }
    return backGroundIds.find(x => equals(x, code));
}


application.run().then(((runInfo) => {

    overrideConsoleLog(document.querySelector(HTML_ID_LOG_AREA));
    console.log('アプリケーション開始');

    const flags = normalizeText(getParam(PARAM_NAME_FLAGS));

    const skipFrame = getParam(PARAM_NAME_SKIP_FRAME) ?? DEFAULT_SKIP_FRAME;
    const maxFps = getParam(PARAM_NAME_FPS) ?? DEFAULT_MAX_FPS;
    const backGround = getParam(PARAM_NAME_BG) || flags?.match(/[0-9]/);

    const isDebug = (getParam(PARAM_NAME_DEBUG) || flags?.includes(PARAM_NAME_DEBUG)) != 0;
    const widgetsCode = getParam(PARAM_NAME_WIDGETS);
    const buttonCode = getParam(PARAM_NAME_BUTTONS);

    const widgetsType = getParam(PARAM_NAME_ENABLED_WIDGETS_TYPE);

    currentMode = getParam(PARAM_NAME_MODE) ?? (flags?.includes(PARAM_NAME_EDIT_MODE) ? MODE_EDIT : flags?.includes(PARAM_NAME_RUN_MODE) ? MODE_PLAY : MODE_DEFAULT);
    canClickScreen = (getParam(PARAM_NAME_CLICK) || flags?.includes(PARAM_NAME_CLICK)) != 0;

    application.onChangeDebugMode = (isDebugMode) => {
        updateMainScreen(isDebugMode);
        updateDebugArea(isDebugMode);
        updateLinkUrl();
    };

    prepareHtmlElements();
    initializeWidgetItems();
    normalizeTranslateTable();
    InitializeWidgets(widgetsCode, widgetsType);
    initializeButtons(buttonCode);

    buildSelectBgArea();

    const screenCanvas = document.querySelector(HTML_ID_SCREEN);
    if (!(screenCanvas instanceof HTMLCanvasElement)) return;

    screenCanvas.style.width = STYLE_VALUE_100PERCENT;
    screenCanvas.style.height = STYLE_VALUE_100PERCENT;

    mainScreen = new ActiveCanvas(screenCanvas, 0, 0, null, maxFps, skipFrame, isDebug);
    mainScreen.drawOrders.push((s) => s.bottom);

    setBackground(getBackGroundId(backGround));
    changeMode(isEditMode(), true);

    application.setDebugMode(isDebug);

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

}));
