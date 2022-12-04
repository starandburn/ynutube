'use strict';

const SKIP_FRAME_AUTO = -1; // オートフレームスキップの値
const DEFAULT_SKIP_FRAME = SKIP_FRAME_AUTO; // フレームスキップのデフォルト値 
const DEFAULT_MAX_FPS = 60; // 最大FPS

const DOG_IMAGE_NO_MIN = 1;
const DOG_IMAGE_NO_MAX = 10;
const DOG_PATTERN_COUNT = 20;

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
const VALUE_RANDOM = Number.MIN_SAFE_INTEGER;   // ランダム指定の数値

// 各フィールドに設定される値
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
    { id : DIRECTION_LEFT,  text : '左向き',    command : COMMAND_DIRECTION_LEFT,   useOption : true, useList : true, useRandom : true, default : true }, 
    { id : DIRECTION_RIGHT, text : '右向き',    command : COMMAND_DIRECTION_RIGHT,  useOption : true, useList : true, useRandom : true, useCheck : true }, 
];
const sizeItems = [ // 大きさ
    { id : SIZE_SUPERSMALL, text : '超小さい',  command : null,                     useOption : false, useList : true, useRandom : false }, 
    { id : SIZE_SMALL,      text : '小さい',    command : COMMAND_SIZE_SMALL,       useOption : true, useList : true, useRandom : true }, 
    { id : SIZE_NORMAL,     text : '普通',      command : COMMAND_SIZE_NORMAL,      useOption : true, useList : true, useRandom : true, default : true }, 
    { id : SIZE_BIG,        text : '大きい',    command : COMMAND_SIZE_BIG,         useOption : true, useList : true, useRandom : true, useCheck : true }, 
    { id : SIZE_SUPERBIG,   text : '超大きい',  command : null,                     useOption : false, useList : true, useRandom : false }, 
]
const speedItems = [ // 速度
    { id : SPEED_SLOW,      text : '遅い',      command : COMMAND_SPEED_SLOW,       useOption : true, useList : false, useRandom : true  }, 
    { id : SPEED_NORMAL,    text : '普通',      command : COMMAND_SPEED_NORMAL,     useOption : true, useList : false, useRandom : true , default : true }, 
    { id : SPEED_FAST,      text : '速い',      command : COMMAND_SPEED_FAST,       useOption : true, useList : false, useRandom : true , useCheck : true }, 
]
function initializeSpeedItems() {
    const names = getCommandItems(FIELD_SPEED);
    for (let i = SPEED_MIN; i <= SPEED_MAX; i++) {
        let listText = `速度${i}`;
        let description = getItemText(names, i);
        if (description != null) listText += `(${description})`;
        speedItems.push({id : i, text : listText, command : null, useOption : false, useList : true, useRandom : true});
    }
}

const kindItems = [];   // 種類
function initializeKindItems() {
    kindItems.splice(0);
    for (let tileNo = DOG_IMAGE_NO_MIN; tileNo <= DOG_IMAGE_NO_MAX; tileNo++) {
        const imageId = `dog${tileNo}`;
        kindItems.push({id : tileNo, text : `犬${tileNo}`, src : `img/${imageId}.png`, imageId : imageId , command : imageId, useOption : true, useList : true, useRandom : true, default : (tileNo == DOG_IMAGE_NO_MIN), useCheck : (tileNo == DOG_IMAGE_NO_MAX) } );
    }
}

const extraKinds = ['hotdog', 'mame', 'siro', 'wanwan'];
function addExtraKinds() {

    let tileNo = DOG_IMAGE_NO_MAX;
    for (let imageId of extraKinds) {
        if (kindItems.map((x) => x.imageId).includes(imageId)) continue;
        tileNo++;
        kindItems.push({id : tileNo, text : `特殊犬${imageId}`, src : `img/@dog${imageId}.png`, imageId : imageId , command : imageId, useOption : true, useList : true, useRandom : true} );
    }
}


function getItemText(items, id) {
    return items?.find((item) => item?.id == id)?.text ?? null;
}

const fieldAttributes = new Map([
    [FIELD_DIRECTION, { 
        text : '向き', 
        items : directionItems, 
        checkText : '反対を向く', 
    }],

    [FIELD_SIZE, { 
        text : 'サイズ', 
        items : sizeItems, 
        checkText : '大きくする', 
    }],

    [FIELD_SPEED, { 
        text : 'スピード', 
        items : speedItems, 
        checkText : '速くする', 
    }],

    [FIELD_KIND, { 
        text : '種類', 
        items : kindItems, 
        checkText : '種類を変える', 
    }],

])

const CONTROL_FIX = 'fix';
const CONTROL_TEXT = 'text';
const CONTROL_CHECK = 'check';
const CONTORL_RADIO = 'radio';
const CONTROL_DROPDOWN = 'dropdown';
const CONTROL_SLIDER = 'slider';
const CONTROL_LIST = 'list';
const CONTORL_IMAGELIST = 'imagelist';

const controlItems = [
    { id : CONTROL_FIX,         text : '固定',             level : 0 },
    { id : CONTROL_TEXT,        text : 'テキストボックス',  level : 1 },
    { id : CONTROL_CHECK,       text : 'チェックボックス',  level : 2 },
    { id : CONTORL_RADIO,       text : 'ラジオボタン',      level : 2 },
    { id : CONTROL_DROPDOWN,    text : 'ドロップダウン',    level : 3 },
    { id : CONTROL_LIST,        text : 'リストボックス',    level : 3 },
    { id : CONTROL_SLIDER,      text : 'スライダー',        level : 4 },
    { id : CONTORL_IMAGELIST,   text : 'イメージリスト',    level : 5, control : [FIELD_KIND] },
]

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
const shadow = new ShadowTile();
const dogTiles = new Map();

let mainScreen;
let backGround = null;
let dogCount = 0;
let viewDogCount = 0;
let hideDogCount = 0;
let paused = false;

const PARAM_NAME_RUN_LEVEL = "run";

const RUN_LEVEL_PLAY = 0;
const RUN_LEVEL_EDIT = 6;
const RUN_LEVEL_DEFAULT = 2;//RUN_LEVEL_EDIT;

let controlArea;
let contentArea;

let runLevel; 
let maxRunLevel;
let enableBatButton = false;

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

        this.debugInfo =  new TextTile(0, 0, null, '#ffffff', null, this._areaCanvas.createFont(16), true);
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
    get size() { return this._size;}

    _direction;
    set direction(value){
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
            console.log("表示中の犬の数", viewDogCount);
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
    if (paused) {
        paused = false;
        mainScreen.resume();
    } else {

        if (viewDogCount > 0){
            paused = true;
            mainScreen.pause();
        }
    }
}


// [デバッグモード]ボタン
function debugButton_Click() {
    application.debugToggle();
    // mainScreen.isDebugMode = application.isDebugMode;
    // mainScreen.render(application.isDebugMode);
    // application.setDebugMode(!application.isDebugMode);
}

function setBackground(id) {

    let img = application.getImage(id);
    new Promise((resolve) => {
        if (img != null) resolve();
        const url = `img/${id}.png`;
        application.loadImage(id, url).then((msg)=> {
            console.log(msg);
            img = application.getImage(id);
        }).catch((msg)=> {
            console.log(msg);
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
        console.log(msg);
        const tile = new ImageTile(application.getImage(id) , 0, 0, 0, 0, true, true);
        dogTiles.set(tileNo, tile);

        for (let dog of mainScreen.sprites.filter((x) => x instanceof Dog)) {
            if (dog.kind == tileNo) {
                dog.refreshTile();
                console.log(dog.tag, '画像更新');
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

    UpdateDogButton();

    console.log(dog.tag, getItemText(kindItems, dog.kind), dog.x, dog.y, getItemText(directionItems, dog.direction), getItemText(sizeItems, dog.size), getItemText(speedItems, dog.speed));

    return dog;

}

function UpdateDogButton()
{
    const HTML_ID_DOGCOUNT = '#dogCount';
    const countLabel = document.querySelector(HTML_ID_DOGCOUNT);
    countLabel.textContent = dogCount;
}

function dogButton_Click() {
    if (isEditMode()) return;
    if (paused) return;

    appearDog();
}

let components = new Map();

// 各フィールドの値をコントロールに設定
function setFieldValue(field, value) {
    getComponent(field)?.setValue(value);
}


function getFieldValue(field, value) {

    const defaultValue = getDefaultValue(field);
    const component = getComponent(field);
    if (component == null) return defaultValue;

    let items;
    switch (controls.find((c) => c.field == field).type) {
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
 
    value = value ?? component.number ?? items?.find((x) => x.command?.toString().toLocaleLowerCase() == component.text?.toLocaleLowerCase())?.id ?? defaultValue;
    if (component.text == COMMAND_RANDOM || value == VALUE_RANDOM) {

        items = items.filter((x) => x.useRandom);
        value = application.getRandomSelect(...getIdList(items));
    }

    if (!getIdList(items)?.includes(value)) {
        console.log(field, '不正な値')
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

function createComponent(field, type, level = RUN_LEVEL_PLAY) {

    const CLASS_SIMPLE = 'simple-component';
    const CLASS_COMPOSITE = 'composite-component';
    const CLASS_DISABLED = 'disabled-component';
    const CLASS_IMAGELIST = 'imagelist-component';

    let component = null;

    if (level == RUN_LEVEL_PLAY) {
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
                component = new ListBox(field, getListItems(field), getDefaultValue(field), CLASS_SIMPLE, null, () => { dogButton_Click(); } );
                break;
            case CONTROL_SLIDER:
                component = new Slider(field, getListItems(field), getDefaultValue(field), CLASS_COMPOSITE);
                break;
            case CONTORL_IMAGELIST:
                component = new ImageList(field, getListItems(field), getDefaultValue(field), CLASS_IMAGELIST, () => { dogButton_Click(); } );
                break;
            case CONTROL_FIX:
                component = new FixedLabel(field, getDefaultValue(field), getFieldAttributes(field)?.items, CLASS_DISABLED);
                break;
            default:
                break;
        }
    } else {
        let items = controlItems.filter( item => { return ( (item.control?.includes(field) ?? true) && ((item.id == type) || level >= item.level)); });
        component = new DropDown(field, items, type, CLASS_SIMPLE);
    }

    return component;

}



function createControl(component, level = RUN_LEVEL_PLAY, showLabel = true) {
    const CLASS_CONTROL_DESCRIPTION = 'control-description';
    const CLASS_CONTROL = 'control';
    const id = component.id;
    const control = document.createElement('div');
    control.classList.add(CLASS_CONTROL);
    control.id = `${id}Control`;

    if (showLabel) {
        let description = fieldAttributes.get(id)?.text;
        if (level != RUN_LEVEL_PLAY) description += 'を決めるコントロール';
        const label = new FixedLabel(`${id}Label`, description, null, CLASS_CONTROL_DESCRIPTION);
        label.appendTo(control);
    }

    component.appendTo(control);

    return control;
}

function clearControls(parent) {
    while (parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
    components.clear();
}

function initializeControls () {
    const param = application.getParam('c')?.toString().trim().toLocaleLowerCase() ?? 'ffff';

    controls.slice(0);
    for (let [field, index] of Array.from(fieldAttributes.keys()).map((f, i) => {return [f, i]})) {
        let type = application.getParam(field)?.toString().trim().toLocaleLowerCase();
        if (index < param?.length && type == null) {
            type = controlHeadCaps.get(param.charAt(index));
        }
        controls.push( { field : field, type : type ?? CONTROL_FIX } );
    }
    components.clear();
}


function buildControls(parent, runLevel = RUN_LEVEL_PLAY) {

    console.log('コントロール構築');
    clearControls(parent);

    for (let control of controls) {

        console.log(`[${fieldAttributes.get(control.field).text}]`, getItemText(controlItems, control.type));

        if (control.field == FIELD_KIND && control.type == CONTORL_IMAGELIST) {
            addExtraKinds();
        }
        let component = createComponent(control.field, control.type, runLevel);
        addComponent(component);
        parent.appendChild(createControl(component, runLevel));
    }

}

const application = new Application();
application.onChangeDebugMode = (d) => {
    // let controls = document.querySelectorAll('.control');
    // for (let ctrl of controls) {
    //         ctrl.style.borderStyle = d ? 'dashed' : 'none';
    //         ctrl.style.borderWidth = '1px';
    // }


    mainScreen.isDebugMode = d
    mainScreen.render(d);

    const logArea = document.querySelector('#logArea');
    logArea.style.display = d ? 'block' : 'none';

};

function onHanbarger_Click() {

    if (isPlayMode()) return;

    maxRunLevel++;
    runLevel = maxRunLevel;

    enableBatButton = !enableBatButton;

    console.log("実行レベル変更:", runLevel);
    console.log("バットボタン有効:", enableBatButton);

    buildControls(controlArea, runLevel);
    

}

function isPlayMode() { return (runLevel == RUN_LEVEL_PLAY); }
function isEditMode() { return !isPlayMode(); }

const HTML_ID_OVERLAY = '#windowOverlay';

const log = console.log;
console.log = function(...args){
  log(...args);

  const logArea = document.querySelector('#logArea');
  const p = document.createElement('p');
  p.textContent = args.join(' ');
  logArea.prepend(p);
};


document.addEventListener('keypress', keypress_ivent);
function keypress_ivent(e) {
	//いずれかのキーが押された時の処理

    switch (e.code)
    {
        case 'KeyG':
            debugButton_Click();
            break;
        case 'KeyP':
            pauseButton_Click();
            break;
        case 'KeyD':
            dogButton_Click();
            break;
        default:
            break;
    }

	return false; 
}

application.run().then((msg) => {


    const HTML_ID_CONTROL_AREA = '#controlArea';
    const HTML_ID_SCREEN = '#screen';
    const HTML_ID_CONTENT = "#content";
    const PARAM_NAME_BG = 'bg';
    const PARAM_NAME_SKIP_FRAME = 'skip';
    const PARAM_NAME_FPS = 'fps';

    const skipFrame = application.getParam(PARAM_NAME_SKIP_FRAME) ?? DEFAULT_SKIP_FRAME;
    const maxFps = application.getParam(PARAM_NAME_FPS) ?? DEFAULT_MAX_FPS;
    runLevel = application.getParam(PARAM_NAME_RUN_LEVEL) ?? RUN_LEVEL_DEFAULT;
    maxRunLevel = runLevel;

    initializeControlHeadCaps();
    initializeSpeedItems();
    initializeKindItems();
    initializeControls();

    contentArea = document.querySelector(HTML_ID_CONTENT);
    controlArea = document.querySelector(HTML_ID_CONTROL_AREA);

    console.log('動作レベル', runLevel);

    const element = document.querySelector(HTML_ID_SCREEN);
    if (element instanceof HTMLCanvasElement) {
        element.style.width = '100%';
        element.style.height = '100%';
    } else {
        return;
    }

    mainScreen =  new ActiveCanvas(element, 0, 0, null, maxFps, skipFrame, application.isDebugMode);
    mainScreen.drawOrders.push((s) => s.bottom);

    let bg = application.getParam(PARAM_NAME_BG) || 'field';
    setBackground(bg);

    changeMode(isEditMode(), true);
    application.debugOff();

    mainScreen.onClick = (x, y, button, target) => {

        if (isEditMode()) return;
        if (paused) return;

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
                    console.log("表示中の犬の数", viewDogCount);
                }
        }

    };

    mainScreen.onUpdate = (stepFrame) => { };

    mainScreen.onDraw = (ctx, target, debug) => {

        if (backGround == null || backGround?.image == null)
        {
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


function modeChangeButton_Click() {

    changeMode(isPlayMode())

}

// [編集][再生]モード変更
function changeMode(editMode = false, first = false) {

    const MODE_TEXT_EDIT = "編集中";
    const MODE_TEXT_PLAY = "実行中";

    const CLASS_EDIT_MODE = 'edit-mode';
    const CLASS_HEADER = '.header';
    const CLASS_LAYOUT = '.layout';
    const CLASS_MODE_TEXT = '.mode-text';
    const HTML_ID_BUTTON_AREA = '#buttonArea';

    const HTML_ID_DOG_BUTTON = '#dogButton';
    const HTML_ID_BAT_BUTTON = '#batButton';

    const CLASS_DOG_BUTTON_WITH_BAT_BUTTON = "dog-button-with-bat-button"

    const CLASS_LIGHT_THEME = 'light-theme';
    const CLASS_DARK_THEME = 'dark-theme';

    mainScreen.stop();

    const body = document.body;
    const layout = document.querySelector(CLASS_LAYOUT);
    const modeText = document.querySelector(CLASS_MODE_TEXT);
    const buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);

    mainScreen.clearSprites();
    dogCount = 0;
    viewDogCount = 0;
    hideDogCount = 0;
    UpdateDogButton();

    if (editMode) {
        runLevel = maxRunLevel;
        layout.classList.add(CLASS_EDIT_MODE);

        body.classList.add(CLASS_DARK_THEME);
        body.classList.remove(CLASS_LIGHT_THEME);

        modeText.value = MODE_TEXT_EDIT;
        buttonArea.style.display = 'none';

    } else {
        runLevel = RUN_LEVEL_PLAY;
        layout.classList.remove(CLASS_EDIT_MODE);

        body.classList.add(CLASS_LIGHT_THEME);
        body.classList.remove(CLASS_DARK_THEME);

        if (!first) {
            controls.splice(0);
            components.forEach((component) => {
                const field = component.id;
                const type = component.value ?? CONTROL_FIX;
                controls.push( { field : field, type : type } );
            });
        }

        modeText.value = MODE_TEXT_PLAY;

        const dogButton = document.querySelector(HTML_ID_DOG_BUTTON);
        const batButton = document.querySelector(HTML_ID_BAT_BUTTON);

        if (enableBatButton)
        {
            batButton.style.display = 'inline';
            dogButton.classList.add(CLASS_DOG_BUTTON_WITH_BAT_BUTTON);
        }
        else 
        {
            batButton.style.display = 'none';
            dogButton.classList.remove(CLASS_DOG_BUTTON_WITH_BAT_BUTTON);
        }

        buttonArea.style.display = 'flex';

    }

    console.log('モード変更:', editMode ? `編集モード(${runLevel})` : '再生モード');
    console.log(document.body.classList);

    buildControls(controlArea, runLevel);

    if (isPlayMode) mainScreen.start();
    
}
