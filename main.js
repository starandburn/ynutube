'use strict';

const SKIP_FRAME_AUTO = -1; // オートフレームスキップの値
const DEFAULT_SKIP_FRAME = SKIP_FRAME_AUTO; // フレームスキップのデフォルト値 
const DEFAULT_MAX_FPS = 60; // 最大FPS

const DOG_IMAGE_NO_MIN = 1;
const DOG_IMAGE_NO_MAX = 10;
const DOG_PATTERN_COUNT = 20;

// HTML 要素ID
const HTML_ID_COMMAND_TEXT = '#commandText';
const HTML_ID_DOG_BUTTON = '#dogButton';
const HTML_ID_BAT_BUTTON = '#batButton';
const HTML_ID_BUTTON_AREA = '#buttonArea';
const HTML_ID_MODE_TEXT = '#modeText';
const HTML_ID_MODE_DESCRIPTION = '#modeDescription';
const HTML_ID_LOG_AREA = '#logArea';
const HTML_ID_DOG_COUNT = '#dogCount';
const HTML_ID_OVERLAY = '#windowOverlay';
const HTML_ID_CONTROL_AREA = '#controlArea';
const HTML_ID_SCREEN = '#screen';
const HTML_ID_CONTENT = '#content';
const HTML_ID_BUTTON_PLAY_AREA = '#buttonPlayArea';
const HTML_ID_BUTTON_EDIT_AREA = '#buttonEditArea';
const HTML_ID_BUTTON_COMMAND = 'buttonCommand';

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
const COMMAND_CLEAR_BUTTON = 'clearbutton';

const COMMAND_EVERY = 'every';
const COMMAND_ALL = 'all';
const COMMAND_CLICK = 'click';

// 各フィールドに設定される値
const VALUE_RANDOM = Number.MIN_SAFE_INTEGER;   // ランダム指定の数値

const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;

const SIZE_NORMAL = 1;
const SIZE_SMALL = 2;
const SIZE_BIG = 3
const SIZE_SUPERSMALL = 0;
const SIZE_SUPERBIG = 4;

const SPEED_MIN = 1;
const SPEED_MAX = 10;
const SPEED_RANGE = (SPEED_MAX - SPEED_MIN + 1);

const SPEED_SLOW = SPEED_MIN;
const SPEED_FAST = SPEED_MAX;
const SPEED_NORMAL = Math.floor(SPEED_RANGE / 2);

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
const speedItems = [ // 速度
    { id: SPEED_SLOW, text: '遅い', command: COMMAND_SPEED_SLOW, useOption: true, useList: false, useRandom: true },
    { id: SPEED_NORMAL, text: '普通', command: COMMAND_SPEED_NORMAL, useOption: true, useList: false, useRandom: true, default: true },
    { id: SPEED_FAST, text: '速い', command: COMMAND_SPEED_FAST, useOption: true, useList: false, useRandom: true, useCheck: true },
]
function initializeSpeedItems() {
    const names = getCommandItems(FIELD_SPEED);
    for (let i = SPEED_MIN; i <= SPEED_MAX; i++) {
        let listText = `速度${i}`;
        let description = getItemText(names, i);
        if (description != null) listText += `(${description})`;
        speedItems.push({ id: i, text: listText, command: null, useOption: false, useList: true, useRandom: true });
    }
}

const kindItems = [];   // 種類
function initializeKindItems() {
    kindItems.splice(0);
    for (let tileNo = DOG_IMAGE_NO_MIN; tileNo <= DOG_IMAGE_NO_MAX; tileNo++) {
        const imageId = `dog${tileNo}`;
        kindItems.push({ id: tileNo, text: `犬${tileNo}`, src: `img/${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true, default: (tileNo == DOG_IMAGE_NO_MIN), useCheck: (tileNo == DOG_IMAGE_NO_MAX) });
    }
}

const extraKinds = ['hotdog', 'mame', 'siro', 'wanwan'];
function addExtraKinds() {

    let tileNo = DOG_IMAGE_NO_MAX;
    for (let imageId of extraKinds) {
        if (kindItems.map((x) => x.imageId).includes(imageId)) continue;
        tileNo++;
        kindItems.push({ id: tileNo, text: `特殊犬${imageId}`, src: `img/@dog${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
    }
}

function getItemText(items, id) {
    return items?.find((item) => item?.id == id)?.text ?? null;
}

const fieldAttributes = new Map([
    [FIELD_DIRECTION, {
        text: '向き',
        items: directionItems,
        checkText: '反対を向く',
    }],

    [FIELD_SIZE, {
        text: 'サイズ',
        items: sizeItems,
        checkText: '大きくする',
    }],

    [FIELD_SPEED, {
        text: 'スピード',
        items: speedItems,
        checkText: '速くする',
    }],

    [FIELD_KIND, {
        text: '種類',
        items: kindItems,
        checkText: '種類を変える',
    }],

]);


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

function splitTextBySpace(command) {
    return command.replace(/[　\t]/g, ' ').split(' ').map(x => x.trim()).filter(x => x.length > 0);
}

const tlanslateTable = [
    [FIELD_DIRECTION, 'dir', 'muki', '向き', 'むき', 'ムキ', 'ﾑｷ', 'houkou', '方向', 'ほうこう', 'ホウコウ', 'ﾎｳｺｳ'],
    [FIELD_SIZE, 'サイズ', 'ｻｲｽﾞ', 'さいず', '大きさ', 'おおきさ', 'saizu', 'ookisa'],
    [FIELD_SPEED, 'スピード', 'ｽﾋﾟｰﾄﾞ', '速さ', '早さ', 'はやさ', 'すぴーど', 'ハヤサ', 'ﾊﾔｻ', 'hayasa', 'supido'],
    [FIELD_KIND, 'タイプ', 'ﾀｲﾌﾟ', '種類', 'しゅるい', 'シュルイ', 'ｼｭﾙｲ', '画像', 'がぞう', 'ガゾウ', 'ｶﾞｿﾞｳ', '犬種', 'けんしゅ', 'ケンシュ', 'ｹﾝｼｭ', 'shurui', 'syurui', 'keshu', 'kensyu'],
    [COMMAND_PLAY, 'playmode', COMMAND_RUN, COMMAND_GO, '再生', '再生モード', '実行', '始め', 'はじめ', '動け', 'うごけ'],
    [COMMAND_EDIT, 'editmode', '編集', '編集モード', 'make', '作る', '直す', 'つくる', 'なおす'],
    [COMMAND_DEBUG, 'デバッグ', 'ﾃﾞﾊﾞｯｸﾞ'],
    [COMMAND_DOG, '犬', 'いぬ', 'イヌ', 'ｲﾇ', '走れ', 'はしれ'],
    [CONTROL_TEXT, 'textbox', 'input', 'テキストボックス', 'ﾃｷｽﾄﾎﾞｯｸｽ'],
    [CONTROL_CHECK, 'checkbox', 'チェックボックス', 'ﾁｪｯｸﾎﾞｯｸｽ', 'チェック', 'ﾁｪｯｸ'],
    [CONTORL_RADIO, 'radiobutton', 'option', 'optionbox', 'ラジオボタン', 'ラジオ', 'ﾗｼﾞｵﾎﾞﾀﾝ', 'ﾗｼﾞｵ', 'オプション', 'ｵﾌﾟｼｮﾝ'],
    [CONTROL_DROPDOWN, 'dropdownbox', 'dropdownlist', 'combobox', 'combo', 'ドロップダウン', 'ﾄﾞﾛｯﾌﾟﾀﾞｳﾝ', 'ドロップダウンリスト', 'ﾄﾞﾛｯﾌﾟﾀﾞｳﾝﾘｽﾄ'],
    [CONTROL_LIST, 'listbox', 'リストボックス', 'ﾘｽﾄﾎﾞｯｸｽ', '一覧', 'リスト', 'ﾘｽﾄ'],
    [CONTROL_SLIDER, 'srider', 'trackbar', 'スライダー', 'トラックバー', 'ｽﾗｲﾀﾞｰ', 'ﾄﾗｯｸﾊﾞｰ'],
    [CONTORL_IMAGELIST, 'image', 'イメージリスト', 'ｲﾒｰｼﾞﾘｽﾄ', '画像リスト', '画像一覧', '画像ﾘｽﾄ', 'イメージ', 'ｲﾒｰｼﾞ'],
    [COMMAND_BUTTON, 'ボタン', 'botan', 'btn', 'buton', 'buttn', 'buttan', 'ﾎﾞﾀﾝ'],
    [COMMAND_CLEAR_BUTTON, 'clear button', 'clear botan', 'clear btn', 'clearbotan', 'clearbtn'],
    [COMMAND_CLEAR, COMMAND_RESET],
    [COMMAND_CLICK, 'クリック', 'くりっく', 'ｸﾘｯｸ', 'mouse', 'マウス', 'まうす', 'ﾏｳｽ', 'touch', 'タッチ', 'たっち', 'ﾀｯﾁ'],
    [COMMAND_RANDOM, 'ランダム', 'らんだむ', 'rand', 'rnd', '？', '?'],
];

function normalizeText(text) {
    return text?.trim().toLocaleLowerCase() ?? '';
}

function translateCommand(source) {

    const command = normalizeText(source);

    for (let group of tlanslateTable) {
        const result = normalizeText(group[0]);
        for (let i = 0; i < group.length; i++) {
            if (group[i] == command) return result;
        }
    }
    return command;
}

ResetControlItemsEnabled();
function ResetControlItemsEnabled() {
    for (let item of controlItems) {
        item.enabled = (item.id == CONTROL_TEXT);
    }
}

const controlHeadCaps = new Map();
function initializeControlHeadCaps() {
    controlHeadCaps.clear();
    for (let item of controlItems) {
        for (let i = 0; i < item.id.length; i++) {
            const c = item.id.charAt(i);
            if (!controlHeadCaps.has(c)) {
                controlHeadCaps.set(c, item.id);
                break;
            }
        }
    }
}

const controls = [];
const buttons = [];

function initializeButtons() {
    buttons.splice(0);
}
initializeButtons();
function ClearButtons() {
    initializeButtons();
    buildButtons();
}

const shadow = new ShadowTile();
const dogTiles = new Map();

let mainScreen;
let backGround = null;
let dogCount = 0;
let viewDogCount = 0;
let hideDogCount = 0;
let isPausing = false;

const PARAM_NAME_MODE = 'mode';

const MODE_PLAY = 0;
const MODE_EDIT = 1;
const MODE_DEFAULT = MODE_PLAY;

let controlArea;
let contentArea;

let currentMode;
let enableClick = false;
let autoMode = false;

class Dog extends TransitionSprite {

    constructor(areaCanvas, srcTiles, kind, x, y, direction, size, speed, startPattern) {

        const tile = srcTiles.get(kind);
        super(tile, x, y, 0, 0, 1, 1, 1, DOG_PATTERN_COUNT, 1, startPattern, true, false, 0, false);

        this._areaCanvas = areaCanvas ?? null;
        this._srcTiles = srcTiles ?? null;

        this.direction = direction;
        this.size = size;
        this.speed = speed;
        this.kind = kind;

        this.setBaseBottomCenter();
        this.actualScaleY = this.scaleY;

        this.debugInfo = new TextTile(0, 0, null, '#ffffff', null, this._areaCanvas.createFont(16), true);
    }

    get actualHeight() { return this.srcHeight * this.actualScaleY; }

    get areaWidth() { return ((this._areaCanvas?.width) ?? 0); }
    get areaHeight() { return ((this._areaCanvas?.height) ?? 0); }

    _size;
    set size(value) {
        this._size = value;
        this.height = this.getDrawHeight();
        this.actualScaleY = this.scaleY;
        this.scaleX = this.scaleY;
    }
    get size() { return this._size; }

    _direction;
    set direction(value) {
        this._direction = value;
        this.hMirror = (value != DIRECTION_LEFT);
    }
    get direction() { return this._direction; }

    render(ctx, debug = false) {
        this.scaleY = this.actualScaleY - (this._currentPattern / 1000);
        super.render(ctx, debug);
        this.scaleY = this.actualScaleY;
    }

    _drawDebugInfo(ctx) {
        super._drawDebugInfo(ctx);
        let text = `種類:${getItemText(kindItems, this.kind)}\n`;
        text += `向き:${getItemText(directionItems, this.direction)}\n`;
        text += `サイズ:${getItemText(sizeItems, this.size)}\n`;
        text += `スピード:${getItemText(speedItems, this.speed)}\n`;

        this.debugInfo.text = text;
        this.debugInfo.draw(ctx, this.right, this.bottom - this.actualHeight);
    }

    getDrawHeight() {
        const height = this.areaHeight / 5;
        switch (this.size) {
            case SIZE_NORMAL:
                return height;
            case SIZE_SMALL:
                return height / 2;
            case SIZE_BIG:
                return height * 2;
            case SIZE_SUPERSMALL:
                return height / 4;
            case SIZE_SUPERBIG:
                return this.areaHeight;
            default:
                return height;
        }
    }

    refreshTile() {
        this.tile = this._srcTiles.get(this.kind);
    }

    update(stepFrame = 1) {
        super.update(stepFrame);

        if (!this.visible) return;

        this.vMirror = false;
        const dx = this.distanceX * stepFrame;

        let isOut = false;
        switch (this.direction) {
            case DIRECTION_LEFT:
                this.x -= dx;
                isOut = (this.right < 0);
                break;
            case DIRECTION_RIGHT:
                this.x += dx;
                isOut = (this.left > this._areaCanvas.right);
                break;
        }
        if (isOut) {
            this.dispose();
            viewDogCount--;
            console.log('表示中の犬の数', viewDogCount);
        }
    }

    get distanceX() {
        const MIN_DISTANCE = 0.5;
        const MAX_DISTANCE = this.width / 7;
        const tick = (MAX_DISTANCE - MIN_DISTANCE) / SPEED_RANGE;
        let dst = tick * (this.speed - SPEED_MIN) + MIN_DISTANCE;
        return dst;
    }

}

// [一時停止]ボタン
function pauseButton_Click() {
    doPauseCommand();
}
// [一時停止]コマンド
function doPauseCommand() {
    if (isPausing) {
        isPausing = false;
        mainScreen.resume();
    } else {
        if (viewDogCount > 0) {
            isPausing = true;
            mainScreen.pause();
        }
    }
}

// [デバッグモード]ボタン
function debugButton_Click() {
    doDebugCommand();
}

// [デバッグ]コマンド
function doDebugCommand() {
    application.debugToggle();
}

function setBackground(id) {

    let img = application.getImage(id);
    new Promise((resolve) => {
        if (img != null) resolve();
        const url = `img/${id}.png`;
        application.loadImage(id, url).then((msg) => {
            console.log('背景画像読込完了', url);
            img = application.getImage(id);
        }).catch((msg) => {
            console.log('setBackground', msg);
            img = null;
        }).finally(() => {
            resolve();
        });
    }).then(() => {
        backGround = new ImageTile(img);
    });
}

function loadDogTile(tileNo) {

    if (dogTiles.has(tileNo)) return;

    const item = kindItems.find((k) => k.id == tileNo);
    const src = item?.src;
    const id = item?.imageId;

    dogTiles.set(tileNo, new DrawingTile(256, 256));
    application.loadImage(id, src).then((msg) => {
        console.log('loadDogTile', msg);
        const tile = new ImageTile(application.getImage(id), 0, 0, 0, 0, true, true);
        dogTiles.set(tileNo, tile);

        for (let dog of mainScreen.sprites.filter((x) => x instanceof Dog)) {
            if (dog.kind == tileNo) {
                dog.refreshTile();
                console.log('loadDogTile', dog.tag, '画像更新');
            }
        }
    });
}


// 1体の犬を表示する
function appearDog(x, y, kind, direction, size, speed) {

    kind = getFieldValue(FIELD_KIND, kind);
    loadDogTile(kind);

    const dog = new Dog(mainScreen, dogTiles, kind, 0, 0, 0, 0, 0, application.getRandom(0, DOG_PATTERN_COUNT - 1));

    dog.tag = `犬${++dogCount}`;

    dog.direction = getFieldValue(FIELD_DIRECTION, direction);
    dog.size = getFieldValue(FIELD_SIZE, size);
    dog.speed = getFieldValue(FIELD_SPEED, speed);

    x = Math.round(x ?? (dog.direction == DIRECTION_LEFT ? mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
    y = Math.round(y ?? (application.getRandom(0, mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);

    dog.moveAt(x, y);
    dog.resetTransition();

    mainScreen.addSprite(dog);
    viewDogCount++;

    updateDogCount();

    console.log('appearDog', dog.tag, getItemText(kindItems, dog.kind), dog.x, dog.y, getItemText(directionItems, dog.direction), getItemText(sizeItems, dog.size), getItemText(speedItems, dog.speed));

    return dog;

}

function updateDogCount() {

    const CLASS_DOG_COUNT = '.dog-count';
    // const countLabel = document.querySelector(HTML_ID_DOG_COUNT);
    // if (countLabel == undefined || countLabel == null) return;
    // countLabel.textContent = dogCount;

    for (let countLabel of document.querySelectorAll(CLASS_DOG_COUNT)) {
        if (countLabel == undefined || countLabel == null) continue;
        countLabel.textContent = dogCount;
    }

}

// [ドッグ]ボタン
function dogButton_Click() {
    doDogCommand();
}

// [ドッグ]コマンド
function doDogCommand() {
    if (isEditMode()) return;
    if (isPausing) return;
    appearDog();
}


let components = new Map();

// 各フィールドの値をコントロールに設定
function setFieldValue(field, value) {
    getComponent(field)?.setValue(value);
}

function getFieldValue(field, value) {

    const defaultValue = (value == null || value == undefined || value == VALUE_RANDOM) ? getDefaultValue(field) : value;
    const component = getComponent(field);
    if (component == null && value != VALUE_RANDOM) return defaultValue;

    let items;
    switch (controls.find((c) => c.field == field)?.type) {
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

    value = value ?? component?.number ?? items?.find((x) => x.command?.toString().toLocaleLowerCase() == component?.text?.toLocaleLowerCase())?.id ?? defaultValue;
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

function getFieldAttributes(field) {
    return fieldAttributes.get(field) ?? null;
}

function getItems(field) {
    return getFieldAttributes(field)?.items;
}
function getDefaultValue(field, translateCommand = false) {
    const defaultItem = getFieldAttributes(field)?.items?.find((x) => x?.default);
    return (translateCommand ? defaultItem.command : null) ?? defaultItem.id ?? null;
}
function getCheckedValue(field) {
    return getFieldAttributes(field)?.items?.find((x) => x?.useCheck)?.id;
}
function getOptionItems(field) {
    return getFieldAttributes(field)?.items?.filter((x) => x.useOption);
}
function getCheckItems(field) {
    return getFieldAttributes(field)?.items?.filter((x) => x?.default || x?.useCheck);
}
function getListItems(field) {
    return getFieldAttributes(field)?.items?.filter((x) => x.useList);
}
function getCommandItems(field) {
    return getFieldAttributes(field)?.items?.filter((x) => ((x.command?.toString().trim() ?? '') != ''));
}
function getRandomItems(field) {
    return getFieldAttributes(field)?.items?.filter((x) => x.useRandom);
}

function createComponent(field, type, mode = MODE_PLAY) {

    const CLASS_SIMPLE = 'simple-component';
    const CLASS_COMPOSITE = 'composite-component';
    const CLASS_DISABLED = 'disabled-component';
    const CLASS_IMAGELIST = 'imagelist-component';

    let component = null;

    if (mode == MODE_PLAY) {
        switch (type) {
            case CONTROL_TEXT:
                component = new TextBox(field, getDefaultValue(field, true), getCommandItems(field), CLASS_SIMPLE);
                break;
            case CONTORL_RADIO:
                component = new RadioButtons(field, getOptionItems(field), getDefaultValue(field), CLASS_COMPOSITE);
                break;
            case CONTROL_CHECK:
                component = new CheckBox(field, getFieldAttributes(field)?.checkText, getDefaultValue(field), getCheckedValue(field), CLASS_COMPOSITE);
                break;
            case CONTROL_DROPDOWN:
                component = new DropDown(field, getListItems(field), getDefaultValue(field), CLASS_SIMPLE);
                break;
            case CONTROL_LIST:
                component = new ListBox(field, getListItems(field), getDefaultValue(field), CLASS_SIMPLE, null, () => { dogButton_Click(); });
                break;
            case CONTROL_SLIDER:
                component = new Slider(field, getListItems(field), getDefaultValue(field), CLASS_COMPOSITE);
                break;
            case CONTORL_IMAGELIST:
                component = new ImageList(field, getListItems(field), getDefaultValue(field), CLASS_IMAGELIST, () => { dogButton_Click(); });
                break;
            case CONTROL_FIX:
                component = new FixedLabel(field, getDefaultValue(field), getFieldAttributes(field)?.items, CLASS_DISABLED);
                break;
            default:
                break;
        }
    } else {
        // let items = controlItems.filter( item => { return ( (item.control?.includes(field) ?? true) && ((item.id == type) || level >= item.level)); });
        let items = controlItems.filter(item => { return ((item.control?.includes(field) ?? true) && ((item.id == type) || item.enabled)); });
        component = new DropDown(field, items, type, CLASS_SIMPLE);
    }

    return component;

}



function createControl(component, level = MODE_PLAY, showLabel = true) {
    const CLASS_CONTROL_DESCRIPTION = 'control-description';
    const CLASS_CONTROL = 'control';
    const id = component.id;
    const control = document.createElement('div');
    control.classList.add(CLASS_CONTROL);
    control.id = `${id}Control`;

    if (showLabel) {
        let description = fieldAttributes.get(id)?.text;
        if (level != MODE_PLAY) description += 'を決めるコントロール';
        const label = new FixedLabel(`${id}Label`, description, null, CLASS_CONTROL_DESCRIPTION);
        label.appendTo(control);
    }

    component.appendTo(control);

    return control;
}

function clearChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function clearControls(parent) {
    clearChildElements(parent);
    components.clear();
}

function initializeControls() {
    // const param = application.getParam('c')?.toString().trim().toLocaleLowerCase() ?? 'ffff';

    controls.splice(0);
    // for (let [field, index] of Array.from(fieldAttributes.keys()).map((f, i) => {return [f, i]})) {
    //     let type = application.getParam(field)?.toString().trim().toLocaleLowerCase();
    //     if (index < param?.length && type == null) {
    //         type = controlHeadCaps.get(param.charAt(index));
    //     }
    //     controls.push( { field : field, type : type ?? CONTROL_FIX } );
    // }
    components.clear();
}

function textBox_KeyPress(event) {

    if (event.keyCode == 13) {
        doDogCommand();
        event.preventDefault();
    }

}

function buildControls(parent, mode = MODE_PLAY, updateType = false) {

    console.log('buildControls', 'コントロール構築');

    if (updateType) {
        controls.splice(0);
        components.forEach((component) => {
            const field = component.id;
            const type = component.value ?? CONTROL_FIX;
            controls.push({ field: field, type: type });
        });
    }

    clearControls(parent);
    for (let control of controls) {

        console.log('buildControls', `[${fieldAttributes.get(control.field).text}]`, getItemText(controlItems, control.type));

        if (control.field == FIELD_KIND && control.type == CONTORL_IMAGELIST) {
            addExtraKinds();
        }
        let component = createComponent(control.field, control.type, mode);

        // テキストボックスの場合はEnterキーで発動できるように
        if (mode == MODE_PLAY && control.type == CONTROL_TEXT && component instanceof TextBox) {
            component.textBox.setAttribute('onKeyPress', 'textBox_KeyPress(event);');
        }

        addComponent(component);
        parent.appendChild(createControl(component, mode));
    }

}

const application = new Application();


function onHanbarger_Click() {
    doDebugCommand();
}

function isPlayMode() { return (currentMode == MODE_PLAY); }
function isEditMode() { return !isPlayMode(); }


// コンソール出力をオーバーライドしてデバッグエリアにも表示する
const log = console.log;
console.log = function (...args) {
    log(...args);

    const logArea = document.querySelector(HTML_ID_LOG_AREA);
    const p = document.createElement('p');
    p.textContent = args.join(' ');
    logArea.prepend(p);
};


function UpdateLogArea(isDebugMode) {
    const logArea = document.querySelector(HTML_ID_LOG_AREA);
    logArea.style.display = isDebugMode ? 'block' : 'none';
}

function UpdateMainScreen(isDebugMode) {
    mainScreen.isDebugMode = isDebugMode
    mainScreen.render(isDebugMode);
}

application.onChangeDebugMode = (isDebugMode) => {
    UpdateMainScreen(isDebugMode);
    UpdateLogArea(isDebugMode);
};

application.run().then((msg) => {

    const PARAM_NAME_BG = 'bg';
    const PARAM_NAME_SKIP_FRAME = 'skip';
    const PARAM_NAME_FPS = 'fps';

    const skipFrame = application.getParam(PARAM_NAME_SKIP_FRAME) ?? DEFAULT_SKIP_FRAME;
    const maxFps = application.getParam(PARAM_NAME_FPS) ?? DEFAULT_MAX_FPS;
    currentMode = application.getParam(PARAM_NAME_MODE) ?? MODE_DEFAULT;

    initializeControlHeadCaps();
    initializeSpeedItems();
    initializeKindItems();
    initializeControls();

    contentArea = document.querySelector(HTML_ID_CONTENT);
    controlArea = document.querySelector(HTML_ID_CONTROL_AREA);

    const element = document.querySelector(HTML_ID_SCREEN);
    if (element instanceof HTMLCanvasElement) {
        element.style.width = '100%';
        element.style.height = '100%';
    } else {
        return;
    }

    mainScreen = new ActiveCanvas(element, 0, 0, null, maxFps, skipFrame, application.isDebugMode);
    mainScreen.drawOrders.push((s) => s.bottom);

    let bg = application.getParam(PARAM_NAME_BG) || 'field';
    setBackground(bg);

    buildButtons();
    changeMode(isEditMode(), true);

    application.debugOff();

    mainScreen.onClick = (x, y, button, target) => {

        if (isEditMode()) return;
        if (isPausing) return;
        if (!enableClick) return;

        switch (button) {
            case 0:
                appearDog(x, y + application.getRandom(-8, 8));
                break;
            case 2:

                const newDog = appearDog(x, y, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM);

                setFieldValue(FIELD_DIRECTION, newDog.direction);
                setFieldValue(FIELD_SIZE, newDog.size);
                setFieldValue(FIELD_SPEED, newDog.speed);
                setFieldValue(FIELD_KIND, newDog.kind);

                break;
            case 1:
                const hited = target.getPointedSprite(x, y, true);
                if (hited instanceof Dog) {
                    target.removeSprite(hited);
                    viewDogCount--;
                    console.log('表示中の犬の数', viewDogCount);
                }
        }

    };

    mainScreen.onUpdate = (stepFrame) => {

        if (autoMode && isPlayMode() && Math.random() * 100 < 5) {
            doRandomCommand();
        }

    };

    mainScreen.onDraw = (ctx, target, debug) => {

        if (backGround == null || backGround?.image == null) {
            target.clear(debug);
        } else {
            backGround.draw(ctx, 0, 0, target.width, target.height);
        }

        target.sprites.forEach(sprite => {
            shadow.draw(ctx, sprite, 0, 0);
        });

        target.sprites.forEach(sprite => {
            sprite.render(ctx, debug);
        });
    };

    document.querySelector(HTML_ID_OVERLAY).style.display = 'none';


});


function appendControl(field, rebuild = true) {
    const index = controls.findIndex((c) => c.field == field)
    if (index == -1) {
        controls.push({ field: field, type: CONTROL_TEXT });
        if (rebuild) buildControls(controlArea, currentMode);
    }
    else {
        // if (confirm(`[${fieldAttributes.get(field).text}]のコントロールはもう存在します。\n画面から消しますか？`)) {
        //     controls.splice(index, 1);
        //     if (rebuild) buildControls(controlArea, currentMode);
        // }
    }
}

function doClearCommand(mode) {

    if (mode == MODE_EDIT) {
        initializeControls();
        ResetControlItemsEnabled();
        buildControls(controlArea, currentMode);
        ClearButtons();
        setAutoMode(false);
        enableClick = false;
    } else {
        ClearDogs();
    }
}

function commandButton_Click() {

    console.log('コマンドボタン押下');

    const tb = document.querySelector(HTML_ID_COMMAND_TEXT);
    if (!(tb instanceof HTMLInputElement)) return;

    doCommand(tb.value);

}

function doCommand(text) {

    const command = translateCommand(text);
    if (command.length == 0) return;

    console.log('コマンド:', command);

    // 両モード共通コマンド
    switch (command) {
        case COMMAND_DEBUG:
            doDebugCommand();
            break;
        case COMMAND_MODE:
            changeMode(isPlayMode());
            break;
        case COMMAND_CLEAR:
            doClearCommand(currentMode);
            break;
        case COMMAND_CLICK:
            enableClick = true;
            break;
    }

    // 編集モード中のコマンド
    if (isEditMode()) {
        switch (command) {
            case COMMAND_PLAY:
                changeMode(false);
                break;
            case FIELD_DIRECTION:
            case FIELD_SIZE:
            case FIELD_SPEED:
            case FIELD_KIND:
                appendControl(command);
                break;
            case COMMAND_EVERY:
                for (let item of controlItems) {
                    item.enabled = true;
                }
                buildControls(controlArea, currentMode, true);
                break;
            case COMMAND_ALL:
                initializeControls();
                for (let field of Array.from(fieldAttributes.keys()).map((f, i) => { return f })) {
                    appendControl(field, false);
                }
                buildControls(controlArea, currentMode);
                break;
            case COMMAND_CLEAR_BUTTON:
                ClearButtons();
                break;
            case COMMAND_BUTTON:
                doButtonCommand();
                break;
            case `-${COMMAND_BUTTON}`:
                removeButton();
                break;
            case 'batbutton':
            case 'bat':
            case 'バット':
                doButtonCommand(COMMAND_BAT);
                break;
            case 'dogbutton':
                doButtonCommand(COMMAND_DOG);
                break;
            default:
                for (let item of controlItems) {
                    if (item.id == command) {
                        item.enabled = true;
                        buildControls(controlArea, MODE_EDIT, true);
                        break;
                    }
                }
                break;
        }
    } else {
        // 実行モード中のコマンド

        switch (command) {
            case COMMAND_EDIT:
                changeMode(true);
                break;
            case COMMAND_AUTO:
                setAutoMode(true);
                break;
            case COMMAND_STOP:
                setAutoMode(false);
                break;
            default:
                appearDogByCommand(command);
                break;
        }
    }
    commandText.value = '';
}

function setAutoMode(value) {
    if (autoMode) ClearDogs();
    autoMode = value;
}

function doRandomCommand() {
    appearDogByCommand(COMMAND_RANDOM);
}

function appearDogByCommand(command) {

    let commands = splitTextBySpace(command);

    let appear = false;
    let direction = null;
    let speed = null;
    let size = null;
    let kind = null;

    for (let c of commands) {
        c = translateCommand(c);
        switch (c) {
            case COMMAND_RANDOM:
                if (direction == null) direction = VALUE_RANDOM;
                if (speed == null) speed = VALUE_RANDOM;
                if (size == null) size = VALUE_RANDOM;
                if (kind == null) kind = VALUE_RANDOM;
                appear = true;
                break;
            case COMMAND_DIRECTION_LEFT:
            case COMMAND_DIRECTION_RIGHT:
                if (direction != null) break;
                direction = directionItems.find(x => x.command == c)?.id;
                appear = true;
                break;
            case COMMAND_SPEED_FAST:
            case COMMAND_SPEED_SLOW:
                if (speed != null) break;
                speed = speedItems.find(x => x.command == c)?.id;
                appear = true;
                break;
            case COMMAND_SIZE_BIG:
            case COMMAND_SIZE_SMALL:
            case COMMAND_SIZE_SUPERSMALL:
            case COMMAND_SIZE_SUPERBIG:
                if (size != null) break;
                size = sizeItems.find(x => x.command == c)?.id;
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

                if (extraKinds.includes(c)) addExtraKinds();
                const k = kindItems.find(x => x.command == c)?.id;
                if (k != null && kind == null) {
                    kind = k;
                    appear = true;
                }
        }
    }
    if (appear) {
        const dog = appearDog(null, null, kind, direction, size, speed);
        setFieldValue(FIELD_DIRECTION, dog.direction);
        setFieldValue(FIELD_SIZE, dog.size);
        setFieldValue(FIELD_SPEED, dog.speed);
        setFieldValue(FIELD_KIND, dog.kind);
    }

}

function modeChangeButton_Click() {

    changeMode(isPlayMode())

}

function commandText_KeyPress(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        commandButton_Click();
    }
}

function UpdateButtonInfo() {

    console.log('ボタン情報更新')

    for (let i = 0; i < buttons.length; i++) {
        const id = `#${HTML_ID_BUTTON_COMMAND}${i + 1}Component`;
        const tb = document.querySelector(id)?.firstChild;
        if (tb instanceof HTMLInputElement) {
            buttons[i] = tb.value;
        }
        else {
            buttons[i] = '';
        }
    }
}

function doButtonCommand(text = '') {
    if (isPlayMode()) return;
    UpdateButtonInfo();
    console.log('ボタン追加', text);
    buttons.push(text);
    buildButtons();
}

function removeButton() {
    if (isPlayMode()) return;
    if (buttons.length > 0) buttons.pop();
    UpdateButtonInfo();
    buildButtons();
}

function buildButtons() {

    console.log('ボタン構築');

    const buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);
    if (buttonArea == null) {
        console.log('Not Found', HTML_ID_BUTTON_AREA)
        return;
    }

    clearChildElements(buttonArea);
    if (isEditMode()) {
        clearChildElements(buttonArea);
        for (let i = 0; i < buttons.length; i++) {
            const text = buttons[i];
            const tb = new TextBox(`${HTML_ID_BUTTON_COMMAND}${i + 1}`, text);
            tb.placeholder = `ボタン${i + 1}`;
            buttonArea.appendChild(tb.htmlElement);
        }
    } else {

        let items = [];
        Array.from(fieldAttributes.values()).map(x => x.items).forEach(item => {
            items = [...items, ...item];
        });

        for (let text of buttons) {
            const command = translateCommand(text);
            if (command == '') continue;
            let caption = '';
            let onClick = `doCommand('${command}')`;
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
                case COMMAND_CLEAR:
                    caption = '✖';
                    break;
                default:
                    caption = items.find(x => x.command == command)?.text ?? text.trim();
                    break;
            }
            const button = new Button(`command${Button}`, caption, onClick);
            if (optionNode != null) button.button.appendChild(optionNode);

            buttonArea.appendChild(button.htmlElement);
        }
    }
}

function ClearDogs() {
    mainScreen.clearSprites();
    dogCount = 0;
    viewDogCount = 0;
    hideDogCount = 0;
    updateDogCount();
}

// [編集][再生]モード変更
function changeMode(editMode = false, first = false) {

    const MODE_TEXT_EDIT = 'ただいま設計中';
    const MODE_DESCRIPTION_EDIT = 'インターフェースを作ってみよう！'

    const MODE_TEXT_PLAY = 'ただいま実行中';
    const MODE_DESCRIPTION_PLAY = '作ったものを動かしてみよう！'

    const CLASS_EDIT_MODE = 'edit-mode';
    const CLASS_LAYOUT = '.layout';

    const CLASS_LIGHT_THEME = 'light-theme';
    const CLASS_DARK_THEME = 'dark-theme';

    mainScreen.stop();

    const body = document.body;
    const layout = document.querySelector(CLASS_LAYOUT);
    const modeText = document.querySelector(HTML_ID_MODE_TEXT);
    const modeDescription = document.querySelector(HTML_ID_MODE_DESCRIPTION);
    const commandText = document.querySelector(HTML_ID_COMMAND_TEXT);

    commandText.value = '';

    ClearDogs();

    if (editMode) {

        currentMode = MODE_EDIT;
        layout.classList.add(CLASS_EDIT_MODE);

        body.classList.add(CLASS_DARK_THEME);
        body.classList.remove(CLASS_LIGHT_THEME);

        modeText.textContent = MODE_TEXT_EDIT;
        modeDescription.textContent = MODE_DESCRIPTION_EDIT;

    } else {

        if (isEditMode) UpdateButtonInfo();

        currentMode = MODE_PLAY;
        layout.classList.remove(CLASS_EDIT_MODE);

        body.classList.add(CLASS_LIGHT_THEME);
        body.classList.remove(CLASS_DARK_THEME);

        modeText.textContent = MODE_TEXT_PLAY;
        modeDescription.textContent = MODE_DESCRIPTION_PLAY;

    }

    console.log('モード変更:', editMode ? `編集モード(${currentMode})` : '再生モード');

    buildControls(controlArea, currentMode, !first && !editMode);
    buildButtons();

    if (isPlayMode) mainScreen.start();

}
