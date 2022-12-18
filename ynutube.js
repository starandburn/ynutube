'use strict';

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

const CLASS_SIMPLE = 'simple-component';
const CLASS_COMPOSITE = 'composite-component';
const CLASS_DISABLED = 'disabled-component';
const CLASS_IMAGELIST = 'imagelist-component';

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
const COMMAND_SAMPLE = 'sample';

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

class YnuTube extends Application {

    MODE_DEFAULT = MODE_PLAY; // 初期状態

    // 既定で使用されるウィジェット
    DEFAULT_WIDGET = WIDGET_TYPE_ID_TEXT;

    widgetTypes = [
        // { id: WIDGET_TYPE_ID_FIX, text: '固定', code: 'f' , icon:'📍' },
        { id: WIDGET_TYPE_ID_TEXT, text: 'テキストボックス', code: 't', icon: '📝', short: 'テキスト' },
        { id: WIDGET_TYPE_ID_CHECK, text: 'チェックボックス', code: 'c', icon: '✅', short: 'チェック' },
        { id: WIDGET_TYPE_ID_RADIO, text: 'ラジオボタン', code: 'r', icon: '🔘', short: 'ラジオ' },
        { id: WIDGET_TYPE_ID_DROPDOWN, text: 'ドロップダウン', code: 'd', icon: '🔽', short: 'ドロップ' },
        { id: WIDGET_TYPE_ID_LIST, text: 'リストボックス', code: 'l', icon: '🚦', short: 'リスト' },
        { id: WIDGET_TYPE_ID_SLIDER, text: 'スライダー', code: 's', icon: '🎚', short: 'スライダ' },
        { id: WIDGET_TYPE_ID_IMAGELIST, text: 'イメージリスト', code: 'i', icon: '🖼', short: 'イメージ' },//, usableFields: [FIELD_ID_KIND] },
    ];

    // 選択肢項目
    extraKinds = ['hotdog', 'mame', 'siro', 'wanwan', 'xmas'];

    fields = [
        { id: FIELD_ID_DIRECTION, text: '向き', checkText: '反対を向く', code: 'd' },
        { id: FIELD_ID_SIZE, text: 'サイズ', checkText: '大きくする', code: 'z' },
        { id: FIELD_ID_SPEED, text: 'スピード', checkText: '速くする', code: 'p' },
        { id: FIELD_ID_KIND, text: '種類', checkText: '違う種類', code: 'k' },
    ];

    widgetItems = [
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

    backGroundIds = [
        'field',
        'sea',
        'fantasy',
        'night',
        'out',
    ];

    kindNames = [
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

    buttonCommands = [
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

    translateTable = [
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
        [WIDGET_TYPE_ID_SLIDER, 'slid', 'srider', 'trackbar', 'スライダー', 'スライダ', 'トラックバー'],
        [WIDGET_TYPE_ID_IMAGELIST, 'image', 'イメージリスト', '画像リスト', '画像一覧', 'イメージ'],
        [COMMAND_BUTTON, 'ボタン', 'botan', 'btn', 'buton', 'buttn', 'buttan'],
        [COMMAND_RESET, COMMAND_CLEAR, 'リセット', 'クリア', 'クリアー'],
        [COMMAND_CLICK, 'クリック', 'mouse', 'マウス', 'touch', 'タッチ'],
        [COMMAND_RANDOM, 'ランダム', 'randam', 'rand', 'rnd', '？', '?'],
        [COMMAND_DIRECTION_RIGHT, '右', '右向き', 'みぎむき', '逆', 'みぎ', 'ぎゃく', 'migi'],
        [COMMAND_DIRECTION_LEFT, '左', 'ひだり', '左向き', 'ひだりむき', 'hidari'],
        [COMMAND_SPEED_FAST, '速い', '早い', 'はやい', 'hayai'],
        [COMMAND_SPEED_SLOW, '遅い', 'おそい', 'のろい', 'osoi'],
        [COMMAND_SIZE_SMALL, '小さい', 'ちいさい', 'スモール', 'chisai', 'tisai', 'chiisai', 'tiisai'],
        [COMMAND_SIZE_BIG, '大きい', 'おおきい', 'でかい', 'ビッグ', 'ビック', 'ookii', 'oki', 'okii', 'dekai'],
        [COMMAND_CLICK, 'クリック', 'touch', 'タッチ', 'マウス', 'mouse', 'tap', 'タップ'],
        [COMMAND_WIDGETS, 'controls', 'wijets', 'widets', 'wigets'],
    ];


    widgets = [{ fieldId: 'dummy', type: 'dummy' }];
    buttonTexts = [];

    shadowTile = new ShadowTile();
    dogTiles = new Map();

    components = new Map();

    batTile = null;
    backGroundTile = null;
    backGroundId = null;

    layoutArea = null;
    modeText = null;
    modeDescription = null;
    mainScreen = null;
    widgetArea = null;
    contentArea = null;
    buttonArea = null;
    debugArea = null;
    commandBox = null;
    widgetsInfo = null;
    updateLinkAnchor = null;
    selectBgArea = null;

    totalDogCount = 0;
    visibleDogCount = 0;

    currentMode = MODE_DEFAULT;

    canClickScreen = false;
    isAutoMode = false;
    isPausing = false;
    existsExtraKinds = false;
    defaultWidgetTypesEnabled;

    setHiddenCommands() {

        const table = [
            // { id: 'clickCommand', on: 'setClickable(true);updateLinkUrl();' },
            // { id: 'debugCommand', on: 'doDebugCommand();' },
            // { id: 'everyTypesCommand', on: 'doCommand(\'every\');' },
            // { id: 'allWidgetsCommand', on: 'doCommand(\'widgets\');' },
            { id: 'clickCommand', on: (()=>{
                this.setClickable(true);
                this.updateLinkUrl();
            }).bind(this) },
            { id: 'debugCommand', on: this.doDebugCommand.bind(this) },
            { id: 'everyTypesCommand', on: this.doCommand.bind(this, 'every') },
            { id: 'allWidgetsCommand', on: this.doCommand.bind(this, 'widgets')},
        ];
        for (let c of table) {
            const elements = document.querySelectorAll(`#${c.id}`);
            for (let e of elements) {
                // e.setAttribute('ondblclick', c.on);
                e.ondblclick = c.on;
            }
        }


        const modeButton = document.querySelector('#modeButton');
        modeButton.onclick = this.onModeChangeButton_Click.bind(this);

        const resetButton = document.querySelector('#resetButton');
        resetButton.onclick = this.onResetButton_Click.bind(this);

        const menuButton = document.querySelector('#menuButton');
        menuButton.onclick = this.onMenubutton_Click.bind(this);

        const commandButton = document.querySelector('#commandButton');
        commandButton.onclick = this.onCommandButton_Click.bind(this);

        const commadBox = document.querySelector('#commandBox');
        commadBox.onkeypress = this.onCommandText_KeyPress.bind(this);

    }

    initializeWidgetItems(log = false) {
        console.log('項目テーブル初期化');

        this.createSpeedItems(log);
        this.createKindItems(log);
        this.normalizeWidgetItems(log);
        this.initializeWidgetItemImageSources(log);

        if (log) console.log('全項目テーブル:', this.toStringFromItems(this.getItems()));

    }

    normalizeWidgetItems(log = false) {
        console.log('項目テーブル正規化');

        for (let item of this.widgetItems) {
            item.field = normalizeText(item.field, true, log);
            item.command = normalizeText(item.command, true, log);
            item.text = item.text?.trim() ?? STRING_EMPTY;
        }
    }

    initializeWidgetItemImageSources(log = false) {
        for (let item of this.widgetItems.filter(x => x.useList)) {
            if (isBlank(item.src)) {
                item.src = `img/${item.command}.png`;
            }
        }
        console.log('イメージリスト用画像ソース初期化', !log ? '' : this.getItems().map(x => x.src));
    }


    normalizeTranslateTable(log = false) {
        console.log('コマンド変換テーブル正規化');
        for (let i in this.translateTable) {
            for (let j in this.translateTable[i]) {
                this.translateTable[i][j] = normalizeText(this.translateTable[i][j], true, log);
            }
        }

        if (log) for (let group of translateTable) console.log(group.slice(0, 1), group.slice(1));

    }

    getFieldIdByCode(code, log = false) {
        const result = this.fields.find(f => equals(f.code, code))?.id;
        if (!isNone(code) && log) console.log('コードからフィールドを取得', `${code} -> ${result ?? '取得失敗'}`);
        return result;
    }

    getWidgetTypeByCode(code, log = false) {
        const result = this.widgetTypes.find(x => equals(x.code, code))?.id || null;
        if (!isNone(code) && log) console.log('コードからウィジェット種類を取得', `${code} -> ${result ?? '取得失敗'}`);
        return result;
    }

    toStringFromItems(items) {
        return items?.map(x => `${x?.command ?? 'none'}[${x?.value}]:${x?.text}`)?.join(', ');
    }

    createSpeedItems(log = false) {

        const names = this.getCommandItems(FIELD_ID_SPEED);
        for (let value = SPEED_MIN; value <= SPEED_MAX; value++) {
            let listText = `速度${value}`;
            const imgSrc = `img/speed${value}.png`;
            const description = this.getTextByValue(names, value);
            if (!isNone(description)) listText += `(${description})`;
            this.widgetItems.push({ field: FIELD_ID_SPEED, value: value, text: listText, src: imgSrc, command: null, useOption: false, useList: true, useRandom: true });
        }
        console.log('速度項目作成追加', !log ? '' : this.toStringFromItems(this.getItems(FIELD_ID_SPEED)));
    }

    createKindItems(log = false) {

        for (let value = DOG_IMAGE_NO_MIN; value <= DOG_IMAGE_NO_MAX; value++) {
            const imageId = `dog${value}`;
            const text = this.kindNames.find(x => equals(x.id, imageId))?.text ?? `犬${value}`;
            this.widgetItems.push({ field: FIELD_ID_KIND, value: value, text: text, src: `img/${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true, default: (value == DOG_IMAGE_NO_MIN), useCheck: (value == DOG_IMAGE_NO_MAX) });
        }

        let value = DOG_IMAGE_NO_MAX;
        for (let imageId of this.extraKinds) {
            if (this.getItems(FIELD_ID_KIND, FIELD_ID_EXTRA_KIND).map(x => x.imageId).includes(imageId)) continue;
            value++;
            const text = this.kindNames.find(x => equals(x.id, imageId))?.text ?? `特殊犬${value - DOG_IMAGE_NO_MAX + 1}`;
            this.widgetItems.push({ field: FIELD_ID_EXTRA_KIND, value: value, text: text, src: `img/@dog${imageId}.png`, imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
        }

        console.log('種類項目作成追加', !log ? '' : this.toStringFromItems(this.getItems(FIELD_ID_KIND, FIELD_ID_EXTRA_KIND)));
    }

    appendExtraKinds(log = false) {

        if (this.existsExtraKinds) return;
        for (let item of this.getItems(FIELD_ID_EXTRA_KIND)) item.field = FIELD_ID_KIND;
        this.existsExtraKinds = true;

        console.log('種類テーブル特殊犬追加', !log ? '' : this.toStringFromItems(getItems(FIELD_ID_KIND)));

    }

    getItems(...fieldIds) {
        if (isNone(fieldIds) || fieldIds.length == 0) return this.widgetItems;
        return this.widgetItems.filter(x => fieldIds.map(x => normalizeText(x)).includes(x.field));
    }

    getTextByValue(items, value, log = false) {
        return this.getTextByAny(items, value, (x) => x.value, log);
    }
    getTextByCommand(items, command, log = false) {
        return this.getTextByAny(items, command, (x) => x.command, log);
    }
    getTextById(items, id, log = false) {
        return this.getTextByAny(items, id, (x) => x.id, log);
    }
    getTextByAny(items, key, getKey = (x) => x, log = false) {
        const result = items?.find((item) => equals(getKey(item), key))?.text ?? null;
        if (log) console.log('項目名取得', `[${key}]`, result);
        return result;
    }


    translateCommand(source, log = true) {

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
                for (let group of this.translateTable) {
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
    doPauseCommand() {
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
    doDebugCommand() {
        console.log('コマンド実行:', 'デバッグモード切替');
        this.debugToggle();
    }

    // [リセット]コマンド
    doResetCommand(mode) {
        console.log('コマンド実行', this.isPlayMode(mode) ? '実行状態リセット' : '設計内容リセット');
        if (this.isEditMode(mode)) {
            this.resetBackground();
            this.resetWidgetTypes();
            this.resetWidgets();
            this.buildWidgetArea(mode);
            this.resetButtons();
            this.buildButtons(mode);
            this.setAutoMode(false);
            this.setClickable(false);
            this.updateLinkUrl();
        }
        this.resetSprites();
    }

    // [ランダム表示]コマンド
    doRandomCommand() {
        console.log('コマンド実行', 'ランダム表示');
        this.appearDogByCommand(COMMAND_RANDOM);
    }

    // ボタン追加コマンド
    // appendButton(text = STRING_EMPTY, rebuild = true) {
    appendButton(text = '', rebuild = true) {
        if (!isBlank(text) && this.buttonTexts?.includes(x => equals(x.value, text))) return;
        console.log('ボタン追加', text);

        // const textBox = new TextBox(`${HTML_ID_BUTTON_TEXT}${this.buttonTexts.length + 1}`, text);
        // const textBox = new TextBox(`${HTML_ID_BUTTON_TEXT}${(this.buttonTexts?.length ?? 0) + 1}`, text);
        console.log('TEXT', text);
        const textBox = new TextBox(`${HTML_ID_BUTTON_TEXT}${(this.buttonTexts?.length ?? 0) + 1}`, text);
        textBox.placeholder = '未使用';
        textBox.onUpdateValue = (() => {
            this.UpdateWidgetTypes();
            this.updateLinkUrl();
        }).bind(this);

        this.buttonTexts.push(textBox);
        this.updateLinkUrl();
        if (rebuild) this.buildButtons(this.currentMode);
    }


    // 汎用コマンド実行
    doCommand(text) {

        const command = this.translateCommand(text);
        if (isBlank(command)) return;

        console.log('コマンド実行:', command);

        try {

            // 両モード共通コマンド
            switch (command) {
                case COMMAND_DEBUG:
                    this.doDebugCommand();
                    return;
                case COMMAND_MODE:
                    this.changeMode(isPlayMode(currentMode));
                    return;
                case COMMAND_RESET:
                    this.doResetCommand(currentMode);
                    return;
                case COMMAND_CLICK:
                    this.setClickable(true);
                    return;
            }

            // 編集モード中のコマンド
            if (this.isEditMode(this.currentMode)) {
                switch (command) {
                    case COMMAND_PLAY:
                        this.changeMode(false);
                        return;
                    case COMMAND_EVERY:
                        this.widgetTypes.forEach(x => x.enabled = true);
                        this.buildWidgetArea(this.currentMode, true);
                        return;
                    case COMMAND_ALL:
                        this.doCommand(COMMAND_WIDGETS);
                        this.doCommand(COMMAND_BUTTON);
                        return;
                    case COMMAND_WIDGETS:
                        this.resetWidgets();
                        this.fields.forEach(f => this.appendField(f.id));
                        this.buildWidgetArea(this.currentMode, false, false, true);
                        return;
                    case COMMAND_RESET_WIDGETS:
                        this.resetWidgets();
                        this.buildWidgetArea(this.currentMode)
                        return;
                    case COMMAND_RESET_BUTTONS:
                        this.resetButtons();
                        this.buildButtons(this.currentMode);
                        return;
                    case COMMAND_BUTTONS:
                        for (let i = 0; i < 4; i++) this.appendButton();
                        return;
                    case COMMAND_BUTTON:
                        this.appendButton();
                        return;
                    case `-${COMMAND_BUTTON}`:
                        this.removeButton();
                        return;
                    // case COMMAND_DOG:
                    // case COMMAND_BAT:
                    // case COMMAND_RANDOM:
                    //     appendButton(command);
                    //     return;
                    default:

                        // コマンドボタンの直接配置(xxxxbuttonでボタン追加)
                        if (command.endsWith('button')) {
                            this.appendButton(command.replace(/button$/g, STRING_EMPTY));
                            return;
                        }

                        // 設定可能フィールドの追加と除外（-xxxxxxx)で除外
                        for (let fieldId of this.fields.map(f => f.id)) {
                            if (equals(fieldId, command, true, false)) {
                                this.appendField(fieldId);
                                return;
                            }
                            if (command.startsWith('-') && equals(command.slice(1), fieldId)) {
                                this.removeField(fieldId);
                                return;
                            }
                        }

                        // ウィジェットの有効化
                        if (this.setWidgetTypeEnabled(command, true)) {
                            this.buildWidgetArea(this.currentMode, true);
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
                        this.changeMode(true);
                        return;
                    case COMMAND_AUTO:
                        this.setAutoMode(true);
                        return;
                    case COMMAND_STOP:
                        this.setAutoMode(false);
                        return;
                    case COMMAND_BAT:
                        this.appearBat();
                        return;
                    default:
                        if (this.appearDogByCommand(command)) return;
                }
            }

            console.log('無効なコマンド:', command);

        } finally {
            this.clearCommandBox();
            this.updateLinkUrl();
        }
    }


    loadBatTile(id) {

        if (this.batTile != null) return;
        let img = this.getImage(id);
        new Promise((resolve) => {
            if (img != null) resolve();
            const url = `img/${id}.png`;
            this.loadImage(id, url).then((msg) => {
                console.log('蝙蝠画像読込完了:', `[${id}]`, url);
                img = this.getImage(id);
            }).catch((msg) => {
                console.log('エラー:', '蝙蝠画像読込失敗', msg);
                img = null;
            }).finally(() => {
                resolve();
            });
        }).then(() => {
            // 読み込みが完了した段階ですでに使用中のスプライトの画像を更新する
            this.batTile = new ImageTile(img);
            for (let bat of this.mainScreen.sprites.filter((x) => x instanceof Bat)) {
                bat.refreshTile(this.batTile);
                console.log('蝙蝠画像更新');
            }
        });
    }


    setBackground(id) {

        console.log('背景画像変更指示', id);

        if (isNone(id)) {
            this.backGroundId = null;
            this.backGroundTile = null;
            this.updateBgSelected();
            this.mainScreen?.render();
            this.updateLinkUrl();
            return;
        }

        let img = this.getImage(id);
        new Promise((resolve) => {
            if (img != null) resolve();
            const url = `img/${id}.png`;
            this.loadImage(id, url).then((msg) => {
                console.log('背景画像変更:', `[${id}]`, url);
                img = this.getImage(id);
                this.backGroundId = id;
                this.updateBgSelected();
                this.updateLinkUrl();
            }).catch((msg) => {
                console.log('エラー:', '背景画像読込失敗', msg);
                img = null;
            }).finally(() => {
                resolve();
            });
        }).then(() => {
            this.backGroundTile = new ImageTile(img);
            this.mainScreen?.render();
        });
    }

    loadDogTile(tileNo) {

        if (this.dogTiles.has(tileNo)) return;

        const item = this.getItems(FIELD_ID_KIND).find((k) => equals(k.value, tileNo));
        const src = item?.src;
        const id = item?.imageId;

        this.dogTiles.set(tileNo, new DrawingTile(256, 256));
        this.loadImage(id, src).then((msg) => {
            const tile = new ImageTile(this.getImage(id), 0, 0, 0, 0, true, true);
            this.dogTiles.set(tileNo, tile);
            // 読み込みが完了した段階ですでに使用中のスプライトの画像を更新する
            for (let dog of this.mainScreen.sprites.filter((x) => x instanceof Dog)) {
                if (dog.kind == tileNo) {
                    dog.refreshTile();
                    console.log('犬画像読込', `[${tileNo}]`, id);
                }
            }
        });
    }



    // 犬を表示する
    appearDog(x, y, kind, direction, size, speed) {

        kind = this.getFieldValue(FIELD_ID_KIND, kind);
        this.loadDogTile(kind);

        const dog = new Dog(this.mainScreen, this.dogTiles, kind, 0, 0, 0, 0, 0, getRandom(0, DOG_PATTERN_COUNT - 1));

        dog.directionTranslate = (d) => this.getTextByValue(getItems(FIELD_ID_DIRECTION), d);
        dog.sizeTranslate = (s) => this.getTextByValue(getItems(FIELD_ID_SIZE), s);
        dog.speedTranslate = (s) => this.getTextByValue(getItems(FIELD_ID_SPEED), s);
        dog.kindTranslate = (k) => this.getTextByValue(getItems(FIELD_ID_KIND), k);

        this.totalDogCount++;
        dog.tag = `DOG_${this.totalDogCount.toString().padStart(4, '0')}`;

        dog.direction = this.getFieldValue(FIELD_ID_DIRECTION, direction);
        dog.size = this.getFieldValue(FIELD_ID_SIZE, size);
        dog.speed = this.getFieldValue(FIELD_ID_SPEED, speed);

        x = Math.round(x ?? (equals(dog.direction, DIRECTION_LEFT, false, true) ? this.mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
        y = Math.round(y ?? (getRandom(0, this.mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);

        dog.moveAt(x, y);
        dog.resetTransition();

        this.mainScreen.addSprite(dog, 1);
        this.visibleDogCount++;

        dog.onOutOfCanvas = (dog) => {
            console.log('イベント:', `[${dog.tag}]`, '画面外離脱')
            dog.dispose();
            this.visibleDogCount--;
        }

        this.updateDogCount();

        console.log('犬を表示:', `[${dog.tag}]`, `座標:(${dog.x}, ${dog.y})`, `種類:${this.getTextByValue(this.getItems(FIELD_ID_KIND), dog.kind)}`, this.getTextByValue(this.getItems(FIELD_ID_DIRECTION), dog.direction), this.getTextByValue(this.getItems(FIELD_ID_SIZE), dog.size), this.getTextByValue(this.getItems(FIELD_ID_SPEED), dog.speed));

        return dog;

    }

    updateDogCount() {
        console.log('総数表示:', this.totalDogCount, `(表示中:${this.visibleDogCount})`);
        const CLASS_DOG_COUNT = '.dog-count';
        for (let countLabel of document.querySelectorAll(CLASS_DOG_COUNT)) {
            if (countLabel == undefined || countLabel == null) continue;
            countLabel.textContent = this.totalDogCount;
        }
    }


    // 各フィールドの値をコンポーネントに設定
    setFieldValue(fieldId, value) {
        console.log('コンポーネント値設定:', `[${fieldId}]`, value);
        this.getComponent(fieldId)?.setValue(value);
    }

    getFieldValue(fieldId, value) {

        const defaultValue = (isNone(value) || value == VALUE_RANDOM) ? this.getDefaultValue(fieldId) : value;
        const component = this.getComponent(fieldId);
        if (component == null && value != VALUE_RANDOM) return defaultValue;

        let items;
        switch (this.widgets.find((c) => equals(c.fieldId, fieldId))?.type) {
            case WIDGET_TYPE_ID_TEXT:
                items = this.getCommandItems(fieldId);
                break;
            case WIDGET_TYPE_ID_RADIO:
                items = this.getOptionItems(fieldId);
                break;
            case WIDGET_TYPE_ID_CHECK:
                items = this.getCheckItems(fieldId);
                break;
            default:
                items = this.getListItems(fieldId);
        }


        // preferredValue = preferredValue ?? component?.number ?? items?.find((x) => equals(x.command, translateCommand(component?.text), true, false))?.id ?? defaultValue;
        value = value ?? component?.number ?? items?.find((x) => equals(x.command, this.translateCommand(component?.text), true, false))?.value ?? defaultValue;
        if (component?.text == COMMAND_RANDOM || value == VALUE_RANDOM) {
            items = items.filter((x) => x.useRandom);
            value = getRandomSelect(...this.getValues(items));
        }

        if (!this.getValues(items)?.includes(value)) {
            console.log('getFieldValue', fieldId, '不正な値')
            value = defaultValue;
        }

        return value;
    }

    getValues(item) {
        // return item?.map((x) => x.id);
        return item?.map((x) => x.value);
    }

    getComponent(fieldId) {
        return this.components.get(fieldId) ?? null;
    }

    addComponent(component) {
        if (component != null) {
            this.components.set(component.id, component);
        }
    }

    getFieldById(fieldId) {
        return this.fields.find(f => equals(f.id, fieldId));
    }

    getDefaultValue(fieldId, translateCommand = false) {
        const defaultItem = this.getItems(fieldId)?.find((x) => x?.default);
        return (translateCommand ? defaultItem.command : null) ?? defaultItem.value ?? null;
    }
    getCheckedValue(fieldId) {
        return this.getItems(fieldId)?.find((x) => x?.useCheck)?.value;
    }
    getOptionItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x.useOption);
    }
    getCheckItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x?.default || x?.useCheck);
    }
    getListItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x.useList);
    }
    getCommandItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => !isBlank(x.command));
    }
    getRandomItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x.useRandom);
    }

    // 入力コンポーネントを作成
    createComponent(fieldId, type, mode = MODE_PLAY) {

        let component = null;

        if (this.isPlayMode(mode)) {
            switch (type) {
                case WIDGET_TYPE_ID_TEXT:
                    component = new TextBox(fieldId, this.getDefaultValue(fieldId, true), this.getCommandItems(fieldId), CLASS_SIMPLE);
                    break;
                case WIDGET_TYPE_ID_RADIO:
                    component = new RadioButtons(fieldId, this.getOptionItems(fieldId), this.getDefaultValue(fieldId), CLASS_COMPOSITE);
                    break;
                case WIDGET_TYPE_ID_CHECK:
                    component = new CheckBox(fieldId, this.getFieldById(fieldId)?.checkText, this.getDefaultValue(fieldId), this.getCheckedValue(fieldId), CLASS_COMPOSITE);
                    break;
                case WIDGET_TYPE_ID_DROPDOWN:
                    component = new DropDown(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), CLASS_SIMPLE);
                    break;
                case WIDGET_TYPE_ID_LIST:
                    component = new ListBox(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), CLASS_SIMPLE, Math.min(this.getListItems(fieldId).length, 5), () => { this.doCommand(COMMAND_DOG); });
                    break;
                case WIDGET_TYPE_ID_SLIDER:
                    component = new Slider(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), CLASS_COMPOSITE);
                    break;
                case WIDGET_TYPE_ID_IMAGELIST:
                    component = new ImageList(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), CLASS_IMAGELIST, () => { this.doCommand(COMMAND_DOG); });
                    break;
                case WIDGET_TYPE_ID_FIX:
                    component = new FixedLabel(fieldId, this.getDefaultValue(fieldId), this.getItems(fieldId), CLASS_DISABLED);
                    break;
                default:
                    break;
            }
        } else {

            // 編集モードの場合はドロップダウンリスト固定
            let items = this.widgetTypes.filter(x => ((equals(x.id, type)) || x.enabled) && (x.usableFields?.includes(fieldId) ?? true)).map(x => [{ value: x.id, text: `${x.icon}${x.text}` }]).flat();
            component = new DropDown(fieldId, items, type, CLASS_SIMPLE);
            component.onUpdateValue = (() => {
                this.UpdateWidgetTypes();
                this.updateLinkUrl();
            }).bind(this);
        }
        return component;

    }

    // ウィジェットを構成するHTMLエレメントを生成して取得する
    generateWidgetElement(component, mode = MODE_PLAY, showLabel = true) {

        const CLASS_WIDGET_DESCRIPTION = 'widget-description';
        const CLASS_WIDGET = 'widget';

        const fieldId = component.id;
        const element = document.createElement('div');
        element.classList.add(CLASS_WIDGET);
        element.id = `${fieldId}widget`;

        if (showLabel) {
            let description = this.fields.find(f => equals(f.id, fieldId, true, false))?.text;
            if (this.isEditMode(mode)) description += 'を決めるウィジェット';
            const label = new FixedLabel(`${fieldId}Label`, description, null, CLASS_WIDGET_DESCRIPTION);
            label.appendTo(element);
        }
        component.appendTo(element);

        return element;
    }

    // 指定要素の子ノードをすべて削除する
    clearChildElements(parent) {
        console.log('HTML子ノード全削除', parent.id);
        while (parent?.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    InitializeWidgets(code, hexCode) {
        console.log('ウィジェット初期化', code, hexCode);

        this.resetWidgetTypes(hexCode);
        this.resetWidgets(code);
        this.logWidgetsInfo();

    }

    resetWidgetTypes(hexCode) {
        console.log('ウィジェット使用状況リセット', hexCode)

        this.widgetTypes.forEach(item => item.enabled = equals(item.id, DEFAULT_WIDGET, false, true));
        this.defaultWidgetTypesEnabled = this.getWidgetTypesEnabledAsHexCode();

        this.setWidgetTypesEnabledByHexCode(hexCode);
        console.log('ウィジェット利用可否コード規定値', this.defaultWidgetTypesEnabled)

    }

    clearWidgetArea() {
        console.log('表示コンポーネント消去')
        this.clearChildElements(this.widgetArea);
        this.components.clear();
    }
    clearWidgets() {
        console.log('ウィジェット配置情報全消去');
        this.widgets.splice(0);
    }

    resetBackground() {
        this.setBackground();
    }

    resetWidgets(restoreCode) {

        console.log('ウィジェット配置リセット');
        this.clearWidgets();
        this.clearWidgetArea();

        if (isBlank(restoreCode)) return;

        restoreCode = normalizeText(restoreCode);
        let fieldId = null;
        for (let pos = 0; pos < restoreCode.length; pos++) {
            const char = restoreCode.charAt(pos);
            if (pos % 2 == 0) {
                fieldId = this.getFieldIdByCode(char);
            } else if (fieldId != null) {
                if (this.widgets.find(x => equals(x.fieldId, fieldId)) != null) continue;
                const type = this.getWidgetTypeByCode(char) ?? DEFAULT_WIDGET;
                this.setWidgetTypeEnabled(type, true);
                this.widgets.push({ fieldId: fieldId, type: type });
            }
        }
        console.log('ウィジェット配置復元', restoreCode, this.widgets);
    }

    initializeButtons(restoreCode) {

        console.log('ボタン初期化');

        this.normalizeButtonCommands();
        this.resetButtons(restoreCode);

    }

    normalizeButtonCommands(log = false) {
        for (let item of this.buttonCommands) {
            item.command = normalizeText(item.command);
        }
        console.log('ボタンコマンド正規化', !log ? '' : this.buttonCommands);
    }

    resetButtons(restoreCode) {

        console.log('ボタン配置リセット');
        this.buttonTexts.splice(0);
        this.clearButtonArea();

        restoreCode = normalizeText(restoreCode, false);
        if (isBlank(restoreCode)) return;

        const codes = restoreCode.split(PARAM_SEPARATOR_BUTTON);
        if (codes?.filter(x => !isBlank(x)).length == 0) codes.pop();
        for (let text of codes) this.appendButton(text, false);

        console.log('ボタン配置復元', restoreCode, this.buttonTexts);

    }

    getButtonRestoreCode() {
        let result = STRING_EMPTY;
        for (let text of this.buttonTexts.map(x => x.value)) {
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

    getWidgetsRestoreCode() {

        let result = STRING_EMPTY;
        for (let widget of this.widgets) {
            const fieldCode = this.getFieldById(widget.fieldId).code;
            const typeCode = this.widgetTypes.find(x => equals(x.id, widget.type))?.code;
            result += normalizeText(`${fieldCode}${typeCode}`);
        }
        return result;
    }

    logWidgetsInfo() {

        console.log('ウィジェット使用可能状況');
        for (let widgetType of this.widgetTypes) {
            console.log(`[${widgetType.id}]${widgetType.text}(${widgetType.code}):`, widgetType.enabled ? '使用可' : '使用不可');
        }
        console.log('フィールド別ウィジェット種類', this.widgets);
        for (let widget of this.widgets) {
            const fieldId = this.getFieldById(widget.fieldId)
            if (isNone(fieldId)) continue;
            console.log(fieldId?.text, this.getTextById(this.widgetTypes, widget.type));
        }
        console.log("ウィジェット復元コード:", this.getWidgetsRestoreCode());
        console.log('ウィジェット使用可否復元コード', this.getWidgetTypesEnabledAsHexCode());

    }

    getWidgetTypesEnabledAsHexCode() {
        let result = 0;
        for (let e of this.widgetTypes.map(x => x.enabled)) {
            result = result << 1;
            if (e) result |= 0x1;
        }
        return result.toString(16);
    }
    setWidgetTypesEnabledByHexCode(hexCode) {
        let number = Number.parseInt(`0x${hexCode}`) || 0;
        console.log('ウィジェット利用可否値', number);
        for (let i = this.widgetTypes.length - 1; i >= 0; i--) {
            this.widgetTypes[i].enabled = ((number & 0x1) != 0) || equals(this.widgetTypes[i].id, DEFAULT_WIDGET, false, true);
            number = number >> 1;
        }
    }

    getWidgetTypeById(id) {
        return this.widgetTypes.find(c => equals(c.id, id));
    }

    setWidgetTypeEnabled(id, value) {
        console.log('ウィジェット使用可否設定', id, value);
        const widgetType = this.getWidgetTypeById(id);
        if (widgetType == null) return false;
        widgetType.enabled = value;
        return true;
    }

    UpdateWidgetTypes() {

        this.clearWidgets();
        this.components.forEach((component) => {
            const id = component.id;
            const type = component.value ?? DEFAULT_WIDGET;
            this.addWidgets(id, type);
        });
        console.log('ウィジェット種類更新:', this.getWidgetsRestoreCode());
    }
    addWidgets(fieldId, type) {
        console.log('ウィジェット追加', fieldId, type);
        this.widgets.push({ fieldId: fieldId, type: type });
    }

    getTitleElement(text) {
        const result = this.getDivElement('title');
        result.textContent = text;
        return result;
    }
    getDescriptionElement(...texts) {
        console.log(...texts);
        const result = this.getDivElement('description');
        for (let text of texts.filter(x => !isBlank(x))) {
            const p = document.createElement('p');
            p.textContent = text;
            result.appendChild(p);
        }
        return result;
    }

    getDivElement(classStyle) {
        const element = document.createElement('div');
        if (!isNone(classStyle)) element.classList.add(classStyle?.toString());
        return element;
    }

    buildWidgetTypesInfo(mode) {

        const CLASS_WIDGET_TYPE_TAG = 'widget-type-tag';

        this.clearChildElements(this.widgetsInfo);
        if (this.isEditMode(mode)) {

            const items = this.widgetTypes.filter(x => x.enabled);

            this.widgetsInfo.appendChild(this.getTitleElement('利用できるウィジェット種別'));

            const desc = [];
            if (items.length == 0) {
                desc.push('有効なウィジェット種別がありません。');
            } else if (this.widgets.length > 0) {
                // desc.push('種別を押すと全項目に一括設定します。');
            }
            if (items.length >= this.widgetTypes.length) {
                desc.push('すべてのウィジェットが利用可能です。')
            } else {
                desc.push('コマンドで種別を増やせます。');
            }

            if (desc.length > 0) this.widgetsInfo.appendChild(this.getDescriptionElement(...desc));

            const element = document.createElement('ul');
            for (let item of items) {
                const li = document.createElement('li');
                li.textContent = item?.short ?? item?.text;

                li.classList.add(CLASS_WIDGET_TYPE_TAG);
                li.onclick = () => { this.setAllWidgets(item.id) };

                if (!isBlank(li.textContent)) element.appendChild(li);
            }

            widgetsInfo.appendChild(element);

            widgetsInfo.style.display = STYLE_VALUE_FLEX;

        } else {
            widgetsInfo.style.display = STYLE_VALUE_NONE;
        }

    }

    setAllWidgets(typeId) {
        console.log('ウィジェット種類一括変更')
        this.UpdateWidgetTypes();
        for (let widget of this.widgets) {
            const type = this.getWidgetTypeById(typeId);
            if (isNone(type.usableFields) || type.usableFields?.includes(widget.fieldId)) {
                this.setFieldValue(widget.fieldId, typeId);
            }
        }
    }


    buildWidgetArea(mode = MODE_PLAY, update = false, newWidget = false, all = false) {

        console.log('ウィジェットエリア構築:', this.widgets);

        if (update) this.UpdateWidgetTypes();

        this.clearWidgetArea();
        this.buildWidgetTypesInfo(mode);

        if (this.isEditMode(mode)) {
            this.widgetArea.appendChild(this.getTitleElement('入力できるウィジェットの項目'));
            if (this.widgets.length == 0) {
                this.widgetArea.appendChild(this.getDescriptionElement(
                    '入力項目はまだありません。',
                    'コマンドで項目を追加できます。'));
                return;
            }
        }

        for (let widget of this.widgets) {

            console.log('ウィジェット配置:', `[${this.fields.find(f => equals(f.id, widget.fieldId))?.text}]`, this.getTextById(this.widgetTypes, widget.type));

            if (equals(widget.fieldId, FIELD_ID_KIND) && equals(widget.type, WIDGET_TYPE_ID_IMAGELIST)) {
                this.appendExtraKinds();
            }
            let component = this.createComponent(widget.fieldId, widget.type, mode);

            if (all || (newWidget && this.widgets.slice(-1)[0].fieldId == widget.fieldId)) {
                component.addClass('new');
            }

            // テキストボックスの場合はEnterキーで発動できるように
            if (this.isPlayMode(mode) && equals(widget.type, WIDGET_TYPE_ID_TEXT) && component instanceof TextBox) {
                // component.textBox.setAttribute('onKeyPress', 'onTextBox_KeyPress(event);');
                component.textBox.onkeypress = this.onTextBox_KeyPress.bind(this);
            }

            this.addComponent(component);
            this.widgetArea.appendChild(this.generateWidgetElement(component, mode));
        }
        console.log('ウィジェット配置コード:', this.getWidgetsRestoreCode());
    }

    // -----------------------------------------------
    // イベントハンドラー
    // -----------------------------------------------
    onMainScreenClick(x, y, button, target) {
        if (this.isEditMode(this.currentMode)) return;
        if (this.isPausing) return;
        if (!this.canClickScreen) return;

        console.log('イベント:', '[スクリーン]マウスクリック');
        switch (button) {
            case 0:
                this.appearDog(x, y + getRandom(-8, 8));
                break;
            case 2:
                this.updateFieldValue(this.appearDog(x, y, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM, VALUE_RANDOM));
                break;

            case 1:
                const hited = target.getPointedSprite(x, y, true);
                if (hited instanceof Dog) {
                    target.removeSprite(hited);
                    this.visibleDogCount--;
                    this.updateDogCount();
                }
        }

    }

    onResetButton_Click() {
        if (confirm('すべての設計内容をリセットします。\nこの操作は元に戻せません。\n\nよろしければ[OK]を押してください。')) {
            this.doResetCommand(MODE_EDIT);
            this.doResetCommand(MODE_PLAY);
            this.changeMode(this.isEditMode(this.currentMode));
        }
    }

    buildSelectBgArea() {

        const CLASS_THUMBNAIL = 'thumbnail';

        this.selectBgArea.style.display = STYLE_VALUE_NONE;

        this.clearChildElements(this.selectBgArea);
        const clearBg = document.createElement('div');
        clearBg.id = 'clearBg'
        clearBg.classList.add(CLASS_THUMBNAIL);
        const p = document.createElement('p');
        p.textContent = '背景なし';
        clearBg.appendChild(p);
        clearBg.onclick = () => this.setBackground(null);

        this.selectBgArea.appendChild(clearBg);

        for (let id of this.backGroundIds) {
            const img = document.createElement('img');
            img.classList.add(CLASS_THUMBNAIL);
            img.id = `bg${id}`;
            img.src = `img/${id}.png`;
            img.onclick = () => this.setBackground(id);
            selectBgArea.appendChild(img);
        }

        this.updateBgSelected();
        selectBgArea.style.display = STYLE_VALUE_FLEX;

    }

    updateBgSelected() {

        const id = this.backGroundId == null ? 'clearBg' : `bg${this.backGroundId}`;

        for (let thumb of this.selectBgArea.children) {
            if (thumb.id == id) {
                thumb.classList.add('selected');
            } else {
                thumb.classList.remove('selected');
            }
        }
    }

    updateLinkUrl() {

        const params = [];

        let flags = STRING_EMPTY;

        if (!equals(this.currentMode, MODE_DEFAULT, false, false)) flags += this.isEditMode(this.currentMode) ? PARAM_NAME_EDIT_MODE : PARAM_NAME_RUN_MODE;
        if (this.canClickScreen) flags += PARAM_NAME_CLICK;
        if (this.isDebugMode) flags += PARAM_NAME_DEBUG;

        let bgId = this.backGroundIds.findIndex(x => equals(x, this.backGroundId));
        if (bgId >= 0) {
            flags += (bgId + 1).toString();
        } else {
            params.push({ param: PARAM_NAME_BG, value: this.backGroundId ?? STRING_EMPTY });
        }

        params.push({ param: PARAM_NAME_FLAGS, value: flags });
        params.push({ param: PARAM_NAME_WIDGETS, value: this.getWidgetsRestoreCode() });

        let hexCode = this.getWidgetTypesEnabledAsHexCode();
        if (equals(hexCode, this.defaultWidgetTypesEnabled)) hexCode = STRING_EMPTY;
        params.push({ param: PARAM_NAME_ENABLED_WIDGETS_TYPE, value: hexCode });
        params.push({ param: PARAM_NAME_BUTTONS, value: this.getButtonRestoreCode() });

        const queryString = params.filter(x => !isBlank(x.value)).map(y => `${y.param}=${encodeURIComponent(y.value)}`).join('&');
        const newUrl = (location.href.split('?')[0]) + (isBlank(queryString) ? STRING_EMPTY : '?' + queryString);

        this.updateLinkAnchor.setAttribute('href', newUrl);
        console.log('リンクURL更新', newUrl);

    }

    onMenubutton_Click() {
        console.log('イベント:', '[メニューボタン]マウスクリック');
        if (confirm('サンプルを別タブに表示します。\n今作っているものに戻るにはタブを切り替えてください。')) {
            window.open('./?n=c1&w=dczrprkl&u=7f&t=dog.random', '_blank');
        }
        // doDebugCommand();
    }

    // [一時停止]ボタン
    onPauseButton_Click() {
        console.log('イベント:', '[一時停止ボタン]マウスクリック')
        doPauseCommand();
    }

    onCommandButton_Click() {
        console.log('イベント:', '[コマンドボタン]マウスクリック');
        this.doCommand(this.getCommandBoxText());
    }

    onModeChangeButton_Click() {
        console.log('イベント:', '[モード変更ボタン]マウスクリック');
        this.changeMode(this.isPlayMode(this.currentMode))
    }

    onCommandText_KeyPress(event) {
        if (event.keyCode == KEY_CODE_ENTER) {
            console.log('イベント:', '[コマンドテキストボックス]Enterキー押下');
            event.preventDefault();
            this.doCommand(this.getCommandBoxText());
        }
    }

    onTextBox_KeyPress(event) {
        if (event.keyCode == KEY_CODE_ENTER) {
            console.log('イベント:', '[項目テキストボックス]Enterキー入力');
            this.doCommand(COMMAND_DOG);
            event.preventDefault();
        }
    }

    onActButton_Click(command, caption) {
        console.log('イベント:', `[${caption}]ボタンクリック`);
        this.doCommand(command);
    }

    isPlayMode(mode = null) { return ((mode ?? this.currentMode) == MODE_PLAY); }
    isEditMode(mode = null) { return !this.isPlayMode(mode); }

    updateDebugArea(visible) {
        if (isNone(debugArea)) return;
        debugArea.style.display = visible ? STYLE_VALUE_FLEX : STYLE_VALUE_NONE;
    }

    updateMainScreen(isDebugMode) {
        this.mainScreen.isDebugMode = isDebugMode
        this.mainScreen.render(isDebugMode);
    }

    prepareHtmlElements() {
        console.log('常用HTMLエレメント事前準備');

        this.layoutArea = document.querySelector(HTML_ID_LAYOUT);
        this.modeText = document.querySelector(HTML_ID_MODE_TEXT);
        this.modeDescription = document.querySelector(HTML_ID_MODE_DESCRIPTION);
        this.updateLinkAnchor = document.querySelector(HTML_ID_UPDATE_LINK);
        this.selectBgArea = document.querySelector(HTML_ID_SELECT_BG_AREA);
        this.contentArea = document.querySelector(HTML_ID_CONTENT);
        this.widgetArea = document.querySelector(HTML_ID_WIDGET_AREA);
        this.widgetsInfo = document.querySelector(HTML_ID_WIDGETS_INFO)
        this.buttonArea = document.querySelector(HTML_ID_BUTTON_AREA);
        this.debugArea = document.querySelector(HTML_ID_DEBUG_AREA);
        this.commandBox = document.querySelector(HTML_ID_COMMAND_BOX);
        if (this.commandBox instanceof HTMLInputElement && this.commandBox.type != 'text') this.commandBox = null;

        this.setHiddenCommands();
    }

    appendField(fieldId, rebuild = true) {
        console.log('フィールド項目追加', fieldId);
        const index = this.widgets.findIndex((c) => equals(c.fieldId, fieldId))
        if (index == -1) {
            this.widgets.push({ fieldId: fieldId, type: DEFAULT_WIDGET });
            if (rebuild) this.buildWidgetArea(this.currentMode, false, true);
        }
    }

    removeField(fieldId, rebuild = true) {
        console.log('フィールド項目除外', fieldId);
        const index = this.widgets.findIndex((c) => equals(c.fieldId, fieldId))
        if (index == -1 || index >= this.widgets.length) return;
        this.widgets.splice(index, 1);
        if (rebuild) this.buildWidgetArea(this.currentMode);
    }

    getCommandBoxText() {
        const result = this.commandBox?.value ?? STRING_EMPTY;
        return result;
    }

    appearBat() {

        if (this.batTile == null) this.loadBatTile('bat');
        const bat = new Bat(this.batTile, getRandom(this.mainScreen.width / 8, this.mainScreen.width / 8 * 7), getRandom(this.mainScreen.height / 8, this.mainScreen.height / 8 * 7));
        this.mainScreen.addSprite(bat, 0);
    }


    setAutoMode(value) {
        if (this.isAutoMode) resetSprites();
        this.isAutoMode = value;
    }
    setClickable(value) {
        this.canClickScreen = value;
    }


    appearDogByCommand(command) {

        let commands = toSplitedArray(command);

        let appear = false;
        let direction = null;
        let speed = null;
        let size = null;
        let kind = null;
        let random = false;

        for (let command of commands) {
            command = this.translateCommand(command);
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
                    direction = this.getItems(FIELD_ID_DIRECTION).find(x => equals(x.command, command, false, false))?.value;
                    appear = true;
                    break;
                case COMMAND_SPEED_FAST:
                case COMMAND_SPEED_SLOW:
                    if (speed != null) break;
                    speed = this.getItems(FIELD_ID_SPEED).find(x => equals(x.command, command, false, false))?.value;
                    appear = true;
                    break;
                case COMMAND_SIZE_BIG:
                case COMMAND_SIZE_SMALL:
                case COMMAND_SIZE_SUPERSMALL:
                case COMMAND_SIZE_SUPERBIG:
                    if (size != null) break;
                    size = this.getItems(FIELD_ID_SIZE).find(x => equals(x.command, command, false, false))?.value;
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

                    if (this.extraKinds.includes(command)) this.appendExtraKinds();
                    const kindId = this.getItems(FIELD_ID_KIND).find(x => equals(x.command, command, false, false))?.value;
                    if (!isNone(kindId) && isNone(kind)) {
                        kind = kindId;
                        appear = true;
                    }
            }
        }
        if (appear) {
            const dog = this.appearDog(null, null, kind, direction, size, speed);
            if (random) this.updateFieldValue(dog);
        }

        return appear;
    }

    updateFieldValue(dog) {

        console.log('フィールド表示項目更新', dog.direction, dog.size, dog.speed, dog.kind);

        if (!(dog instanceof Dog)) return;

        this.setFieldValue(FIELD_ID_DIRECTION, dog.direction);
        this.setFieldValue(FIELD_ID_SIZE, dog.size);
        this.setFieldValue(FIELD_ID_SPEED, dog.speed);
        this.setFieldValue(FIELD_ID_KIND, dog.kind);

    }

    removeButton(componentId) {

        console.log('ボタン削除', componentId);

        if (isNone(componentId)) {
            if (this.buttonTexts.length > 0) this.buttonTexts.pop();
        }
        else {
            const idx = this.buttonTexts.findIndex(x => equals(x.id, componentId))
            if (idx < 0) return;
            this.buttonTexts.splice(idx, 1);
        }
        this.buildButtons(this.currentMode);
    }

    clearButtonArea() {
        this.clearChildElements(this.buttonArea);
        console.log('ボタンエリア消去', this.buttonArea);
    }

    buildButtons(mode = MODE_PLAY) {

        if (this.buttonArea == null) return;

        console.log('ボタンインターフェース構築:', this.isPlayMode(mode) ? '実行モード' : '編集モード');

        this.clearButtonArea();
        if (this.isEditMode(mode)) {
            for (let component of this.buttonTexts) {
                this.buttonArea.appendChild(component.htmlElement);
                // const removeButton = new Button('removeButton', '-', `removeButton('${component.id}');`);
                const removeButton = new Button('removeButton', '-', this.removeButton.bind(this, component.id));
                removeButton.button.classList.add('remove-button');
                this.buttonArea.appendChild(removeButton.htmlElement);
            }

            const appendButton = new Button('appendButton', '+', this.appendButton.bind(this, null));
            appendButton.button.classList.add('append-button');
            buttonArea.appendChild(appendButton.htmlElement);

        } else {
            let previousComponent = null;
            let previousConcatLeft = false;
            for (let textBox of this.buttonTexts) {
                const command = this.translateCommand(textBox?.value);
                if (isBlank(command)) continue;
                const buttonCommand = this.buttonCommands.find(x => equals(x.command, command, false, false));
                const caption = buttonCommand?.text ?? this.getTextByCommand(this.widgetItems, command) ?? command
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

                // const onClick = `onActButton_Click('${command}', '${caption}');`;
                const onClick = this.onActButton_Click.bind(this, command, caption);
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

    resetSprites() {
        this.mainScreen.clearSprites();
        this.totalDogCount = 0;
        this.visibleDogCount = 0;
        this.isAutoMode = false;
        this.updateDogCount();
    }

    clearCommandBox() {
        if (this.commandBox == null) return;
        this.commandBox.value = STRING_EMPTY;
    }

    // [編集][再生]モード変更
    changeMode(editMode = false, first = false) {

        const MODE_TEXT_EDIT = 'いぬちゅーぶ＠設計モード';
        const MODE_DESCRIPTION_EDIT = '自分で画面を作ってみよう！'

        const MODE_TEXT_PLAY = 'いぬちゅーぶ＠実行モード';
        const MODE_DESCRIPTION_PLAY = '作ったものを動かしてみよう！'

        const CLASS_EDIT_MODE = 'edit-mode';

        const CLASS_LIGHT_THEME = 'light-theme';
        const CLASS_DARK_THEME = 'dark-theme';

        this.mainScreen?.stop();
        this.clearCommandBox();

        const body = document.body;

        this.resetSprites();

        if (editMode) {

            this.currentMode = MODE_EDIT;
            this.layoutArea?.classList.add(CLASS_EDIT_MODE);

            body?.classList.add(CLASS_DARK_THEME);
            body?.classList.remove(CLASS_LIGHT_THEME);

            if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_EDIT;
            if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_EDIT;

        } else {

            this.currentMode = MODE_PLAY;
            this.layoutArea?.classList.remove(CLASS_EDIT_MODE);

            body?.classList.add(CLASS_LIGHT_THEME);
            body?.classList.remove(CLASS_DARK_THEME);

            if (modeText instanceof HTMLElement) modeText.textContent = MODE_TEXT_PLAY;
            if (modeDescription instanceof HTMLElement) modeDescription.textContent = MODE_DESCRIPTION_PLAY;

        }

        console.log('モード変更:', this.editMode ? `編集モード(${this.currentMode})` : '再生モード', this.widgets);

        this.buildWidgetArea(this.currentMode, !first && this.isPlayMode(this.currentMode));
        this.buildButtons(this.currentMode);

        commandBox?.focus();

        if (this.isPlayMode(this.currentMode)) {
            this.updateDogCount();
            this.mainScreen?.start();
        }

        this.updateLinkUrl();

    }

    getBackGroundId(code) {
        if (code > 0 && code <= this.backGroundIds.length) {
            const index = Number.parseInt(code) - 1;
            return this.backGroundIds[index];
        }
        return this.backGroundIds.find(x => equals(x, code));
    }

    run() {
        super.run().then(() => {


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

            this.currentMode = getParam(PARAM_NAME_MODE) ?? (flags?.includes(PARAM_NAME_EDIT_MODE) ? MODE_EDIT : flags?.includes(PARAM_NAME_RUN_MODE) ? MODE_PLAY : MODE_DEFAULT);
            this.canClickScreen = (getParam(PARAM_NAME_CLICK) || flags?.includes(PARAM_NAME_CLICK)) != 0;

            this.onChangeDebugMode = (isDebugMode) => {
                this.updateMainScreen(isDebugMode);
                this.updateDebugArea(isDebugMode);
                this.updateLinkUrl();
            };

            this.prepareHtmlElements();
            this.initializeWidgetItems(true);
            this.normalizeTranslateTable();
            this.InitializeWidgets(widgetsCode, widgetsType);
            this.initializeButtons(buttonCode);

            this.buildSelectBgArea();

            const screenCanvas = document.querySelector(HTML_ID_SCREEN);
            if (!(screenCanvas instanceof HTMLCanvasElement)) return;

            screenCanvas.style.width = STYLE_VALUE_100PERCENT;
            screenCanvas.style.height = STYLE_VALUE_100PERCENT;

            this.mainScreen = new ActiveCanvas(screenCanvas, 0, 0, null, maxFps, skipFrame, isDebug);
            this.mainScreen.drawOrders.push((s) => s.bottom);

            this.setBackground(this.getBackGroundId(backGround));
            this.changeMode(this.isEditMode(), true);

            this.setDebugMode(isDebug);

            this.mainScreen.onClick = this.onMainScreenClick.bind(this);

            this.mainScreen.onUpdate = () => {

                if (this.isAutoMode && this.isPlayMode() && Math.random() * 100 < 5) {
                    this.doRandomCommand();
                }

            };

            this.mainScreen.onDraw = (ctx, target, debug) => {

                if (this.backGroundTile == null || this.backGroundTile?.image == null) {
                    target.clear(debug);
                } else {
                    this.backGroundTile.draw(ctx, 0, 0, target.width, target.height);
                }

                target.sprites.filter(x => x instanceof Dog).forEach(sprite => {
                    this.shadowTile.draw(ctx, sprite, 0, 0);
                });

                target.sprites.forEach(sprite => {
                    sprite.render(ctx, debug);
                });
            };

            document.querySelector(HTML_ID_OVERLAY).style.display = STYLE_VALUE_NONE;

        });
    }

}

new YnuTube().run();