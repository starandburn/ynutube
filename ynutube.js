'use strict';

class YnuTube extends Application {

    DogImageNo = Object.freeze({
        Min: 1,
        Max: 10,
    })

    HtmlId = Object.freeze({
        Layout: 'layout',
        CommandBox: 'commandBox',
        ButtonArea: 'buttonArea',
        ModeText: 'modeText',
        ModeDescription: 'modeDescription',
        LogArea: 'logArea',
        DebugArea: 'debugArea',
        WindowOverlay: 'windowOverlay',
        WidgetsInfo: 'widgetsInfo',
        WidgetArea: 'widgetArea',
        Screen: 'screen',
        Content: 'content',
        UpdateLink: 'updateLink',
        SelectBgArea: 'selectBgArea',
        ButtonText: 'buttonText',
        ClearBg: 'clearBg',
        RemoveButton: 'removeButton',
        AppendButton: 'appendButton',
    });

    // HTML 要素ID
    ClassName = Object.freeze({
        Simple: 'simple-component',
        Composite: 'composite-component',
        Disabled: 'disabled-component',
        ImageList: 'imagelist-component',
        DogCount: 'dog-count',
    });

    // 動作モード
    Mode = Object.freeze({
        Play: 0,
        Edit: 1,
    });

    // ユーザーが入力できるフィールド項目
    Field = Object.freeze({
        Direction: 'direction',
        Size: 'size',
        Speed: 'speed',
        Kind: 'kind',
        ExtraKind: 'extrakind',
    });

    // ウィジェット（UI部品）
    WidgetType = Object.freeze({
        FixedLabel: 'fix',
        TextBox: 'text',
        CheckBox: 'check',
        RadioButton: 'radio',
        DropDownList: 'dropdown',
        Slider: 'slider',
        ListBox: 'list',
        ImageList: 'imagelist',
    });

    Default = Object.freeze({
        Mode: this.Mode.Play,
        WidgetType: this.WidgetType.TextBox,
    });


    // 選択肢項目
    extraKinds = [
        'hotdog',
        'mame',
        'siro',
        'wanwan',
        'xmas',
    ];
    backgroundIds = [
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
        { id: 'hotdog', text: 'ホットドッグ', extra: true },
        { id: 'mame', text: '豆しば', extra: true },
        { id: 'siro', text: 'シロ', extra: true },
        { id: 'wanwan', text: 'ワンワン', extra: true },
        { id: 'xmas', text: 'クリスマス', extra: true },
    ];


    widgetTypes = [
        // { id: WidgetType.FixedList, text: '固定', code: 'f' , icon:'📍' },
        { id: this.WidgetType.TextBox, text: 'テキストボックス', code: 't', icon: '📝', short: 'テキスト' },
        { id: this.WidgetType.CheckBox, text: 'チェックボックス', code: 'c', icon: '✅', short: 'チェック' },
        { id: this.WidgetType.RadioButton, text: 'ラジオボタン', code: 'r', icon: '🔘', short: 'ラジオ' },
        { id: this.WidgetType.DropDownList, text: 'ドロップダウン', code: 'd', icon: '🔽', short: 'ドロップ' },
        { id: this.WidgetType.ListBox, text: 'リストボックス', code: 'l', icon: '🚦', short: 'リスト' },
        { id: this.WidgetType.Slider, text: 'スライダー', code: 's', icon: '🎚', short: 'スライダ' },
        { id: this.WidgetType.ImageList, text: 'イメージリスト', code: 'i', icon: '🖼', short: 'イメージ' },
    ];


    fields = [
        { id: this.Field.Direction, text: '向き', checkText: '反対を向く', code: 'd' },
        { id: this.Field.Size, text: 'サイズ', checkText: '大きくする', code: 'z' },
        { id: this.Field.Speed, text: 'スピード', checkText: '速くする', code: 'p' },
        { id: this.Field.Kind, text: '種類', checkText: '違う種類', code: 'k' },
    ];

    // テキストで入力する場合のコマンド文字列
    Command = Object.freeze({
        Direction: { Left: 'left', Right: 'right' },
        Speed: { Slow: 'slow', Normal: 'normal', Fast: 'fast' },
        Size: { Normal: 'normal', Small: 'small', Big: 'big', SuperSmall: 'supersmall', SuperBig: 'superbig' },
        Dog: 'dog', Bat: 'bat', Go: 'go', Random: 'random', Click: 'click',
        Auto: 'auto', Stop: 'stop',
        Button: 'button',
        Mode: 'mode', Play: 'play', Edit: 'edit', Run: 'run',
        Debug: 'debug', Reset: 'reset', Clear: 'clear',
        Buttons: 'buttons', Widets: 'widgets', ResetButtons: '-buttons', ResetWidgets: '-widgets',
        All: 'all', Every: 'every',
    });

    ParamCode = Object.freeze({
        Mode: 'm',
        EditMode: 'e',
        RunMode: 'r',
        DebugMode: 'g',
        Widgets: 'w',
        Background: 'b',
        SkipFrame: 'p',
        Fps: 'f',
        Clickable: 'c',
        Buttons: 't',
        Flags: 'n',
        ButtonSeparator: '.',
        WidgetsType: 'u',
    });


    widgetItems = [

        { field: this.Field.Direction, value: DogCommon.Direction.Left, text: '左向き', command: this.Command.Direction.Left, useOption: true, useList: true, useRandom: true, default: true },
        { field: this.Field.Direction, value: DogCommon.Direction.Right, text: '右向き', command: this.Command.Direction.Right, useOption: true, useList: true, useRandom: true, useCheck: true },

        { field: this.Field.Size, value: DogCommon.Size.SuperSmall, text: '超小さい', command: this.Command.Size.SuperSmall, useOption: false, useList: true, useRandom: false },
        { field: this.Field.Size, value: DogCommon.Size.Small, text: '小さい', command: this.Command.Size.Small, useOption: true, useList: true, useRandom: true },
        { field: this.Field.Size, value: DogCommon.Size.Normal, text: '普通', command: this.Command.Size.Normal, useOption: true, useList: true, useRandom: true, default: true },
        { field: this.Field.Size, value: DogCommon.Size.Big, text: '大きい', command: this.Command.Size.Big, useOption: true, useList: true, useRandom: true, useCheck: true },
        { field: this.Field.Size, value: DogCommon.Size.SuperBig, text: '超大きい', command: this.Command.Size.SuperBig, useOption: false, useList: true, useRandom: false },

        { field: this.Field.Speed, value: DogCommon.Speed.Slow, text: '遅い', command: this.Command.Speed.Slow, useOption: true, useList: false, useRandom: true },
        { field: this.Field.Speed, value: DogCommon.Speed.Normal, text: '普通', command: this.Command.Speed.Normal, useOption: true, useList: false, useRandom: true, default: true },
        { field: this.Field.Speed, value: DogCommon.Speed.Fast, text: '速い', command: this.Command.Speed.Fast, useOption: true, useList: false, useRandom: true, useCheck: true },
    ];


    buttonCommands = [
        { command: this.Command.Dog, text: '🐕', concatLeft: true, afterClass: this.ClassName.DogCount },
        { command: this.Command.Bat, text: '🦇', concatRight: true },
        { command: this.Command.Random, text: '❓', concatRight: true },
        { command: this.Command.Reset, text: '✖', concatRight: true },
        { command: this.Command.Size.Big },
        { command: this.Command.Size.Small },
        { command: this.Command.Direction.Left },
        { command: this.Command.Direction.Right },
        { command: this.Command.Speed.Fast },
        { command: this.Command.Speed.Slow },
    ];

    translateTable = [
        [this.Field.Direction, 'dir', 'muki', '向き', 'むき', 'houkou', '方向', 'ほうこう'],
        [this.Field.Size, 'siz', 'サイズ', '大きさ', 'おおきさ', 'saizu', 'ookisa'],
        [this.Field.Speed, 'sped', 'spe', 'spd', 'スピード', '速さ', '早さ', 'はやさ', 'hayasa', 'supido'],
        [this.Field.Kind, 'kin', 'knd', 'typ', 'type', 'タイプ', '種類', 'しゅるい', '画像', 'がぞう', '犬種', 'けんしゅ', 'shurui', 'syurui', 'keshu', 'kensyu'],
        [this.WidgetType.TextBox, 'textbox', 'input', 'テキストボックス'],
        [this.WidgetType.CheckBox, 'checkbox', 'チェックボックス', 'チェック'],
        [this.WidgetType.RadioButton, 'radiobutton', 'option', 'optionbox', 'ラジオボタン', 'ラジオ', 'オプション'],
        [this.WidgetType.DropDownList, 'drop', 'ドロップ', 'dropdownbox', 'dropdownlist', 'combobox', 'combo', 'ドロップダウン', 'ドロップダウンリスト'],
        [this.WidgetType.ListBox, 'listbox', 'リストボックス', '一覧', 'リスト'],
        [this.WidgetType.Slider, 'slid', 'srider', 'trackbar', 'スライダー', 'スライダ', 'トラックバー'],
        [this.WidgetType.ImageList, 'image', 'イメージリスト', '画像リスト', '画像一覧', 'イメージ'],
        [this.Command.Play, 'playmode', this.Command.Run, this.Command.Go, '再生', '再生モード', '実行', '始め', 'はじめ', '動け', 'うごけ'],
        [this.Command.Edit, 'editmode', '編集', '編集モード', 'make', '作る', '直す', 'つくる', 'なおす'],
        [this.Command.Debug, 'デバッグ'],
        [this.Command.Dog, '犬', 'いぬ', '走れ', 'はしれ'],
        [this.Command.Button, 'ボタン', 'botan', 'btn', 'buton', 'buttn', 'buttan'],
        [this.Command.Reset, this.Command.Clear, 'リセット', 'クリア', 'クリアー'],
        [this.Command.Click, 'クリック', 'mouse', 'マウス', 'touch', 'タッチ'],
        [this.Command.Random, 'ランダム', 'randam', 'rand', 'rnd', '？', '?'],
        [this.Command.Direction.Right, '右', '右向き', 'みぎむき', '逆', 'みぎ', 'ぎゃく', 'migi'],
        [this.Command.Direction.Left, '左', 'ひだり', '左向き', 'ひだりむき', 'hidari'],
        [this.Command.Speed.Fast, '速い', '早い', 'はやい', 'hayai'],
        [this.Command.Speed.Slow, '遅い', 'おそい', 'のろい', 'osoi'],
        [this.Command.Size.Small, '小さい', 'ちいさい', 'スモール', 'chisai', 'tisai', 'chiisai', 'tiisai'],
        [this.Command.Size.Big, '大きい', 'おおきい', 'でかい', 'ビッグ', 'ビック', 'ookii', 'oki', 'okii', 'dekai'],
        [this.Command.Click, 'クリック', 'touch', 'タッチ', 'マウス', 'mouse', 'tap', 'タップ'],
        [this.Command.Widgets, 'controls', 'wijets', 'widets', 'wigets'],
    ];


    widgets = [{ fieldId: 'dummy', type: 'dummy' }];
    buttonTexts = [];

    dogShadowTile = new ShadowTile();
    dogImageTiles = new Map();

    components = new Map();

    batImageTile = null;
    backgroundImageTile = null;
    backgroundId = null;

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

    currentMode = this.Default.Mode;
    canClickScreen = false;
    isAutoMode = false;
    isPausing = false;
    existsExtraKinds = false;
    defaultWidgetTypesCode;

    makeImageUrl(title, ext = 'png') {
        return `./img/${title}${(Text.isBlank(ext) || ext?.startsWith('.')) ? '' : '.'}${ext}`;
    }


    setEventHandlers(log = false) {

        console.log('イベントハンドラー設定')

        const Event = Object.freeze({
            Click: 0,
            DoubleClick: 1,
            KeyDown: 2,
        });

        const events = [
            { id: 'clickCommand', type: Event.DoubleClick, handler: this.setClickable.bind(this, true, true) },
            { id: 'debugCommand', type: Event.DoubleClick, handler: this.doDebugCommand.bind(this) },
            { id: 'everyTypesCommand', type: Event.DoubleClick, handler: this.doCommand.bind(this, this.Command.Every) },
            { id: 'allWidgetsCommand', type: Event.DoubleClick, handler: this.doCommand.bind(this, this.Command.Widets) },
            { id: 'modeButton', type: Event.Click, handler: this.onModeChangeButtonClick.bind(this) },
            { id: 'resetButton', type: Event.Click, handler: this.onResetButtonClick.bind(this) },
            { id: 'menuButton', type: Event.Click, handler: this.onMenubuttonClick.bind(this) },
            { id: 'commandButton', type: Event.Click, handler: this.onCommandButtonClick.bind(this) },
            { id: 'pauseButton', type: Event.Click, handler: this.onPauseButtonClick.bind(this) },
            { id: 'commandBox', type: Event.KeyDown, handler: this.onCommandTextKeyDown.bind(this) },
        ];

        const setEvent = (e, t, h) => {
            if (isNone(e)) return;
            switch (t) {
                case Event.Click:
                    e.onclick = h;
                    if (log) console.log(e.id, 'クリック');
                    break;
                case Event.DoubleClick:
                    e.ondblclick = h;
                    if (log) console.log(e.id, 'ダブルクリック');
                    break;
                case Event.KeyDown:
                    e.onkeydown = h;
                    if (log) console.log(e.id, 'キーダウン');
                    break;
            }
        };

        for (let item of events) {
            setEvent(Html.getById(item?.id), item?.type, item?.handler);
            for (let element of Html.getByClass(item?.class)) setEvent(element, item?.type, item?.handler);
        }
    }

    initializeWidgetItems(log = false) {
        console.log('項目テーブル初期化');

        this.createSpeedItems(log);
        this.createKindItems(log);
        this.normalizeWidgetItems(log);
        this.initializeImageListSource(log);

        if (log) console.log('全項目テーブル:', this.toCsvText(this.getItems()));

    }

    normalizeWidgetItems(log = false) {
        console.log('項目テーブル正規化');

        for (let item of this.widgetItems) {
            item.field = Text.normalize(item.field, true, log);
            item.command = Text.normalize(item.command, true, log);
            item.text = item.text?.trim() ?? Text.Empty;
        }
    }

    initializeImageListSource(log = false) {
        for (let item of this.widgetItems.filter(x => x.useList)) {
            if (Text.isBlank(item.src)) {
                item.src = this.makeImageUrl(item.command);
            }
        }
        console.log('イメージリスト用画像ソース初期化', !log ? '' : this.getItems().map(x => x.src));
    }

    normalizeTranslateTable(log = false) {
        console.log('コマンド変換テーブル正規化');
        for (let grpIdx in this.translateTable) {
            for (let colIdx in this.translateTable[grpIdx]) {
                this.translateTable[grpIdx][colIdx] = Text.normalize(this.translateTable[grpIdx][colIdx], true, log);
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

    toCsvText(items) {
        return items?.map(x => `${x?.command ?? 'none'}[${x?.value}]:${x?.text}`)?.join(', ');
    }

    createSpeedItems(log = false) {

        const names = this.getCommandItems(this.Field.Speed);
        for (let value = DogCommon.Speed.Slow; value <= DogCommon.Speed.Fast; value++) {
            let listText = `速度${value}`;
            const imgSrc = this.makeImageUrl(`speed${value}`);
            const description = this.getTextByValue(names, value);
            if (!isNone(description)) listText += `(${description})`;
            this.widgetItems.push({ field: this.Field.Speed, value: value, text: listText, src: imgSrc, command: null, useOption: false, useList: true, useRandom: true });
        }
        console.log('速度項目作成追加', !log ? '' : this.toCsvText(this.getItems(this.Field.Speed)));
    }

    createKindItems(log = false) {

        for (let value = this.DogImageNo.Min; value <= this.DogImageNo.Max; value++) {
            const imageId = `dog${value}`;
            const text = this.kindNames.find(x => equals(x.id, imageId))?.text ?? `犬${value}`;
            this.widgetItems.push({ field: this.Field.Kind, value: value, text: text, src: this.makeImageUrl(imageId), imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true, default: (value == this.DogImageNo.Min), useCheck: (value == this.DogImageNo.Max) });

        }

        let value = this.DogImageNo.Max;
        for (let imageId of this.extraKinds) {
            if (this.getItems(this.Field.Kind, this.Field.ExtraKind).map(x => x.imageId).includes(imageId)) continue;
            value++;
            const text = this.kindNames.find(x => equals(x.id, imageId))?.text ?? `特殊犬${value - this.DogImageNo.Max + 1}`;
            this.widgetItems.push({ field: this.Field.ExtraKind, value: value, text: text, src: this.makeImageUrl(`@dog${imageId}`), imageId: imageId, command: imageId, useOption: true, useList: true, useRandom: true });
        }

        console.log('種類項目作成追加', !log ? '' : this.toCsvText(this.getItems(this.Field.Kind, this.Field.ExtraKind)));
    }

    appendExtraKinds(log = false) {

        if (this.existsExtraKinds) return;
        for (let item of this.getItems(this.Field.ExtraKind)) item.field = this.Field.Kind;
        this.existsExtraKinds = true;

        console.log('種類テーブル特殊犬追加', !log ? '' : this.toCsvText(this.getItems(this.Field.Kind)));

    }

    getItems(...fieldIds) {
        if (isNone(fieldIds) || fieldIds.length == 0) return this.widgetItems;
        return this.widgetItems.filter(x => fieldIds.map(x => Text.normalize(x)).includes(x.field));
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

        if (isNone(source)) return Text.Empty;
        const command = Text.normalize(source, false);
        const blnMinus = command.startsWith('-');
        let result;
        let tokens = command.split(' ');

        if (isNone(tokens)) return Text.Empty;

        try {
            if (tokens.length > 1) {
                for (let i in tokens) {
                    tokens[i] = this.translateCommand(tokens[i], false);
                }
                result = tokens.join(' ');
                return result;
            } else {
                for (let group of this.translateTable) {
                    result = group[0];
                    for (let i = 0; i < group.length; i++) {
                        if (equals(group[i], command.replace(/^[\-]/g, Text.Empty), false, false)) {
                            result = `${blnMinus ? '-' : Text.Empty}${result}`;
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
    resetAll(mode) {
        console.log('コマンド実行', this.isPlayMode(mode) ? '実行状態リセット' : '設計内容リセット');
        if (this.isEditMode(mode)) {
            this.resetBackground();
            this.resetWidgetTypes();
            this.resetWidgets();
            this.buildWidgetArea(mode);
            this.resetButtons();
            this.buildButtons(mode);
            this.setAutoMode(false);
            this.setClickable(false, false);
            this.updateLinkUrl();
        }
        this.resetSprites();
    }

    // [ランダム表示]コマンド
    doRandomCommand() {
        console.log('コマンド実行', 'ランダム表示');
        this.appearDogByCommand(this.Command.Random);
    }

    // ボタン追加コマンド
    appendButton(text = Text.Empty, rebuild = true) {
        if (!Text.isBlank(text) && this.buttonTexts?.includes(x => equals(x.value, text))) return;
        console.log('ボタン追加', text);

        const textBox = new TextBox(`${this.HtmlId.ButtonText}${(this.buttonTexts?.length ?? 0) + 1}`, text);
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
        if (Text.isBlank(command)) return;

        console.log('コマンド実行:', command);

        try {

            // 両モード共通コマンド
            switch (command) {
                case this.Command.Debug:
                    this.doDebugCommand();
                    return;
                case this.Command.Mode:
                    this.changeMode(isPlayMode(currentMode));
                    return;
                case this.Command.Reset:
                    this.resetAll(currentMode);
                    return;
                case this.Command.Click:
                    this.setClickable(true);
                    return;
            }

            // 編集モード中のコマンド
            if (this.isEditMode(this.currentMode)) {
                switch (command) {
                    case this.Command.Play:
                        this.changeMode(false);
                        return;
                    case this.Command.Every:
                        this.widgetTypes.forEach(x => x.enabled = true);
                        this.buildWidgetArea(this.currentMode, true);
                        return;
                    case this.Command.All:
                        this.doCommand(this.Command.Widets);
                        this.doCommand(this.Command.Button);
                        return;
                    case this.Command.Widets:
                        this.resetWidgets();
                        this.fields.forEach(f => this.appendField(f.id));
                        this.buildWidgetArea(this.currentMode, false, false, true);
                        return;
                    case this.Command.ResetWidgets:
                        this.resetWidgets();
                        this.buildWidgetArea(this.currentMode)
                        return;
                    case this.Command.ResetButtons:
                        this.resetButtons();
                        this.buildButtons(this.currentMode);
                        return;
                    case this.Command.Buttons:
                        for (let i = 0; i < 4; i++) this.appendButton();
                        return;
                    case this.Command.Button:
                        this.appendButton();
                        return;
                    case `-${this.Command.Button}`:
                        this.removeButton();
                        return;
                    default:

                        // コマンドボタンの直接配置(xxxxbuttonでボタン追加)
                        if (command.endsWith(this.Command.Button)) {
                            this.appendButton(command.replace(/button$/g, Text.Empty));
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

                        break;
                }
            } else {
                // 実行モード中のコマンド

                switch (command) {
                    case this.Command.Edit:
                        this.changeMode(true);
                        return;
                    case this.Command.Auto:
                        this.setAutoMode(true);
                        return;
                    case this.Command.Stop:
                        this.setAutoMode(false);
                        return;
                    case this.Command.Bat:
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

        if (this.batImageTile != null) return;
        let img = this.getImage(id);
        new Promise((resolve) => {
            if (img != null) resolve();
            const url = this.makeImageUrl(id);//`img/${id}.png`;
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
            this.batImageTile = new ImageTile(img);
            for (let bat of this.mainScreen.sprites.filter((x) => x instanceof Bat)) {
                bat.refreshTile(this.batImageTile);
                console.log('蝙蝠画像更新');
            }
        });
    }


    changeBackground(id) {

        console.log('背景画像変更指示', id);

        if (isNone(id)) {
            this.backgroundId = null;
            this.backgroundImageTile = null;
            this.updateBgSelected();
            this.mainScreen?.render();
            this.updateLinkUrl();
            return;
        }

        let img = this.getImage(id);
        new Promise((resolve) => {
            if (img != null) resolve();
            const url = this.makeImageUrl(id);
            this.loadImage(id, url).then((msg) => {
                console.log('背景画像変更:', `[${id}]`, url);
                img = this.getImage(id);
                this.backgroundId = id;
                this.updateBgSelected();
                this.updateLinkUrl();
            }).catch((msg) => {
                console.log('エラー:', '背景画像読込失敗', msg);
                img = null;
            }).finally(() => {
                resolve();
            });
        }).then(() => {
            this.backgroundImageTile = new ImageTile(img);
            this.mainScreen?.render();
        });
    }

    loadDogTile(tileNo) {

        if (this.dogImageTiles.has(tileNo)) return;

        const item = this.getItems(this.Field.Kind).find((k) => equals(k.value, tileNo));
        const src = item?.src;
        const id = item?.imageId;

        this.dogImageTiles.set(tileNo, new DrawingTile(256, 256));
        this.loadImage(id, src).then((msg) => {
            const tile = new ImageTile(this.getImage(id), 0, 0, 0, 0, true, true);
            this.dogImageTiles.set(tileNo, tile);
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

        kind = this.getFieldValue(this.Field.Kind, kind);
        this.loadDogTile(kind);

        // const dog = new Dog(this.mainScreen, this.dogImageTiles, kind, 0, 0, 0, 0, 0, getRandom(0, DOG_PATTERN_COUNT - 1));
        const dog = new Dog(this.mainScreen, this.dogImageTiles, kind, 0, 0, 0, 0, 0, Random.get(0, DogCommon.PatternCount - 1));

        dog.directionTranslate = (d) => this.getTextByValue(this.getItems(this.Field.Direction), d);
        dog.sizeTranslate = (s) => this.getTextByValue(this.getItems(this.Field.Size), s);
        dog.speedTranslate = (s) => this.getTextByValue(this.getItems(this.Field.Speed), s);
        dog.kindTranslate = (k) => this.getTextByValue(this.getItems(this.Field.Kind), k);

        this.totalDogCount++;
        dog.tag = `DOG_${this.totalDogCount.toString().padStart(4, '0')}`;

        dog.direction = this.getFieldValue(this.Field.Direction, direction);
        dog.size = this.getFieldValue(this.Field.Size, size);
        dog.speed = this.getFieldValue(this.Field.Speed, speed);

        x = Math.round(x ?? (equals(dog.direction, DogCommon.Direction.Left, false, true) ? this.mainScreen.right + dog.halfWidth - 1 : -dog.halfWidth + 1));
        // y = Math.round(y ?? (getRandom(0, this.mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);
        y = Math.round(y ?? (Random.get(0, this.mainScreen.bottom - Math.floor(dog.height) - 1) + dog.halfHeight) + dog.halfHeight);

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

        console.log('犬を表示:', `[${dog.tag}]`, `座標:(${dog.x}, ${dog.y})`, `種類:${this.getTextByValue(this.getItems(this.Field.Kind), dog.kind)}`, this.getTextByValue(this.getItems(this.Field.Direction), dog.direction), this.getTextByValue(this.getItems(this.Field.Size), dog.size), this.getTextByValue(this.getItems(this.Field.Speed), dog.speed));

        return dog;

    }

    updateDogCount() {
        console.log('総数表示:', this.totalDogCount, `(表示中:${this.visibleDogCount})`);
        for (let countLabel of Html.getByClass(this.ClassName.DogCount, false)) {
            if (isNone(countLabel)) continue;
            countLabel.textContent = this.totalDogCount;
        }
    }


    // 各フィールドの値をコンポーネントに設定
    setFieldValue(fieldId, value) {
        console.log('コンポーネント値設定:', `[${fieldId}]`, value);
        this.getComponent(fieldId)?.setValue(value);
    }

    getFieldValue(fieldId, value) {

        const defaultValue = (isNone(value) || value == DogCommon.RandomValue) ? this.getDefaultValue(fieldId) : value;
        const component = this.getComponent(fieldId);
        if (component == null && value != DogCommon.RandomValue) return defaultValue;

        let items;
        switch (this.widgets.find((c) => equals(c.fieldId, fieldId))?.type) {
            case this.WidgetType.TextBox:
                items = this.getCommandItems(fieldId);
                break;
            case this.WidgetType.RadioButton:
                items = this.getOptionItems(fieldId);
                break;
            case this.WidgetType.CheckBox:
                items = this.getCheckItems(fieldId);
                break;
            default:
                items = this.getListItems(fieldId);
        }

        value = value ?? component?.number ?? items?.find((x) => equals(x.command, this.translateCommand(component?.text), true, false))?.value ?? defaultValue;
        if (equals(component?.text, this.Command.Random) || value == DogCommon.RandomValue) {
            items = items.filter((x) => x.useRandom);
            // value = getRandomSelect(...this.getValues(items));
            value = Random.select(...this.getValues(items));
        }

        if (!this.getValues(items)?.includes(value)) {
            console.log('getFieldValue', fieldId, '不正な値')
            value = defaultValue;
        }

        return value;
    }

    getValues(item) {
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
        return this.getItems(fieldId)?.filter((x) => x?.useOption);
    }
    getCheckItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x?.default || x?.useCheck);
    }
    getListItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x?.useList);
    }
    getCommandItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => !Text.isBlank(x?.command));
    }
    getRandomItems(fieldId) {
        return this.getItems(fieldId)?.filter((x) => x?.useRandom);
    }

    // 入力コンポーネントを作成
    createComponent(fieldId, type, mode = this.Mode.Play) {

        let component = null;

        if (this.isPlayMode(mode)) {
            switch (type) {
                case this.WidgetType.TextBox:
                    component = new TextBox(fieldId, this.getDefaultValue(fieldId, true), this.getCommandItems(fieldId), this.ClassName.Simple);
                    break;
                case this.WidgetType.RadioButton:
                    component = new RadioButtons(fieldId, this.getOptionItems(fieldId), this.getDefaultValue(fieldId), this.ClassName.Composite);
                    break;
                case this.WidgetType.CheckBox:
                    component = new CheckBox(fieldId, this.getFieldById(fieldId)?.checkText, this.getDefaultValue(fieldId), this.getCheckedValue(fieldId), this.ClassName.Composite);
                    break;
                case this.WidgetType.DropDownList:
                    component = new DropDown(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), this.ClassName.Simple);
                    break;
                case this.WidgetType.ListBox:
                    component = new ListBox(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), this.ClassName.Simple, Math.min(this.getListItems(fieldId).length, 5), () => { this.doCommand(this.Command.Dog); });
                    break;
                case this.WidgetType.Slider:
                    component = new Slider(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), this.ClassName.Composite);
                    break;
                case this.WidgetType.ImageList:
                    component = new ImageList(fieldId, this.getListItems(fieldId), this.getDefaultValue(fieldId), this.ClassName.ImageList, () => { this.doCommand(this.Command.Dog); });
                    break;
                case this.WidgetType.FixedLabel:
                    component = new FixedLabel(fieldId, this.getDefaultValue(fieldId), this.getItems(fieldId), this.ClassName.Disabled);
                    break;
                default:
                    break;
            }
        } else {

            // 編集モードの場合はドロップダウンリスト固定
            let items = this.widgetTypes.filter(x => ((equals(x.id, type)) || x.enabled) && (x.usableFields?.includes(fieldId) ?? true)).map(x => [{ value: x.id, text: `${x.icon}${x.text}` }]).flat();
            component = new DropDown(fieldId, items, type, this.ClassName.Simple);
            component.onUpdateValue = (() => {
                this.UpdateWidgetTypes();
                this.updateLinkUrl();
            }).bind(this);
        }
        return component;

    }

    // ウィジェットを構成するHTMLエレメントを生成して取得する
    generateWidgetElement(component, mode = this.Mode.Play, showLabel = true) {

        const CLASS_WIDGET_DESCRIPTION = 'widget-description';
        const CLASS_WIDGET = 'widget';

        const fieldId = component?.id;
        const description = `${this.getTextById(this.fields, fieldId)}${this.isEditMode(mode) ? 'を決めるウィジェット' : Text.Empty}`;
        const label = showLabel ? new FixedLabel(`${fieldId}Label`, description, null, CLASS_WIDGET_DESCRIPTION) : null;

        return Html.createDivElement(`${fieldId}Widget`, CLASS_WIDGET, label?.htmlElement, component?.htmlElement);

    }

    InitializeWidgets(code, hexCode) {

        console.log('ウィジェット初期化', code ?? Text.Empty, hexCode ?? Text.Empty);

        this.resetWidgetTypes(hexCode);
        this.resetWidgets(code);
        this.logWidgetsInfo();

    }

    resetWidgetTypes(hexCode) {
        console.log('ウィジェット種別リセット', hexCode ?? Text.Empty);

        this.widgetTypes.forEach(item => item.enabled = equals(item.id, this.Default.WidgetType, false, true));
        this.defaultWidgetTypesCode = this.getWidgetTypesCode();

        this.setWidgetTypesCode(hexCode);
        console.log('ウィジェット種別復元コード規定値', this.defaultWidgetTypesCode);

    }

    clearWidgetArea() {
        console.log('表示コンポーネント消去')
        Html.clearChildElements(this.widgetArea);
        this.components.clear();
    }
    clearWidgets() {
        console.log('ウィジェット配置情報全消去');
        this.widgets.splice(0);
    }

    resetBackground() {
        this.changeBackground();
    }

    resetWidgets(restoreCode) {

        console.log('ウィジェット配置リセット');
        this.clearWidgets();
        this.clearWidgetArea();

        if (Text.isBlank(restoreCode)) return;

        restoreCode = Text.normalize(restoreCode);
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
            item.command = Text.normalize(item.command);
        }
        console.log('ボタンコマンド正規化', !log ? '' : this.buttonCommands);
    }

    resetButtons(restoreCode) {

        console.log('ボタン配置リセット');
        this.buttonTexts.splice(0);
        this.clearButtonArea();

        restoreCode = Text.normalize(restoreCode, false);
        if (Text.isBlank(restoreCode)) return;

        const codes = restoreCode.split(this.ParamCode.ButtonSeparator);
        if (codes?.filter(x => !Text.isBlank(x)).length == 0) codes.pop();
        for (let text of codes) this.appendButton(text, false);

        console.log('ボタン配置復元', restoreCode, this.buttonTexts);

    }

    getButtonRestoreCode() {
        let result = Text.Empty;
        for (let text of this.buttonTexts.map(x => x.value)) {
            if (Text.isBlank(text)) {
                result += this.ParamCode.ButtonSeparator;
                continue;
            }
            if (!Text.isBlank(result) && !result.endsWith(this.ParamCode.ButtonSeparator)) {
                result += this.ParamCode.ButtonSeparator;
            }
            result += text;
        }

        return result;
    }

    getWidgetsRestoreCode() {

        let result = Text.Empty;
        for (let widget of this.widgets) {
            const fieldCode = this.getFieldById(widget.fieldId).code;
            const typeCode = this.widgetTypes.find(x => equals(x.id, widget.type))?.code;
            result += Text.normalize(`${fieldCode}${typeCode}`);
        }
        return result;
    }

    logWidgetsInfo() {

        console.log('ウィジェット使用可能状況');
        for (let widgetType of this.widgetTypes) {
            console.log(`[${widgetType.id}]${widgetType.text}(${widgetType.code}):`, widgetType.enabled ? '使用可' : '使用不可');
        }
        console.log('フィールド別ウィジェット種類');
        for (let widget of this.widgets) {
            const fieldId = this.getFieldById(widget.fieldId)
            if (isNone(fieldId)) continue;
            console.log(fieldId?.text, this.getTextById(this.widgetTypes, widget.type));
        }
        console.log("ウィジェット復元コード:", this.getWidgetsRestoreCode() ?? Text.Empty);
        console.log('ウィジェット種別復元コード', this.getWidgetTypesCode() ?? Text.Empty);

    }

    getWidgetTypesCode() {
        return this.getWidgetTypesNum().toString(16);
    }
    getWidgetTypesNum() {
        let result = 0;
        for (let enabled of this.widgetTypes.map(x => x.enabled)) {
            result = result << 1;
            if (enabled) result |= 0x1;
        }
        return result;
    }

    setWidgetTypesCode(hexCode) {
        console.log('ウィジェット種別コード設定(16)', hexCode);
        let numValue = Number.parseInt(`0x${hexCode}`) || 0;
        this.setWidgetTypesNum(numValue);
    }
    setWidgetTypesNum(numValue) {
        console.log('ウィジェット種別数値設定', numValue);
        for (let i = this.widgetTypes.length - 1; i >= 0; i--) {
            this.widgetTypes[i].enabled = ((numValue & 0x1) != 0) || equals(this.widgetTypes[i].id, this.Default.WidgetType, false, true);
            numValue = numValue >> 1;
        }
    }

    getWidgetType(typeId) {
        return this.widgetTypes.find(c => equals(c.id, typeId));
    }

    setWidgetTypeEnabled(typeId, value) {
        console.log('ウィジェット使用可否設定', typeId, value);
        const widgetType = this.getWidgetType(typeId);
        if (isNone(widgetType)) return false;
        widgetType.enabled = value;
        return true;
    }

    UpdateWidgetTypes() {
        this.clearWidgets();
        this.components.forEach((component) => {
            const id = component.id;
            const type = component.value ?? this.Default.WidgetType;
            this.addWidgets(id, type);
        });
        console.log('ウィジェット種類更新:', this.getWidgetsRestoreCode());
    }
    addWidgets(fieldId, type) {
        console.log('ウィジェット追加', fieldId, type);
        this.widgets.push({ fieldId: fieldId, type: type });
    }

    getTitleElement(text) {
        const CLASS_TITLE = 'title';
        return Html.createDivElement(null, CLASS_TITLE, text);
    }
    getDescriptionElement(...texts) {
        const CLASS_DESCRIPTION = 'description';
        return Html.createDivElement(null, CLASS_DESCRIPTION, ...texts.map(x => Html.createPElement(null, null, x)));
    }

    buildWidgetTypesInfo(mode) {

        const CLASS_WIDGET_TYPE_TAG = 'widget-type-tag';
        Html.clearChildElements(this.widgetsInfo);
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

            const element = Html.createElement(Html.Tag.Ul);
            for (let item of items) {
                const li = Html.createElement(Html.Tag.Li, null, CLASS_WIDGET_TYPE_TAG, item?.short ?? item?.text);
                li.onclick = () => { this.setAllWidgets(item.id) };

                if (!Text.isBlank(li.textContent)) element.appendChild(li);
            }

            widgetsInfo.appendChild(element);

            Html.setVisible(this.widgetsInfo, true);

        } else {
            Html.setVisible(this.widgetsInfo, false);
        }

    }

    setAllWidgets(typeId) {
        console.log('ウィジェット種別一括変更')
        this.UpdateWidgetTypes();
        for (let widget of this.widgets) {
            const type = this.getWidgetType(typeId);
            if (isNone(type.usableFields) || type.usableFields?.includes(widget.fieldId)) {
                this.setFieldValue(widget.fieldId, typeId);
            }
        }
    }


    buildWidgetArea(mode = this.Mode.Play, update = false, newWidget = false, all = false) {

        console.log('ウィジェットエリア構築');

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

            if (equals(widget.fieldId, this.Field.Kind) && equals(widget.type, this.WidgetType.ImageList)) {
                this.appendExtraKinds();
            }
            let component = this.createComponent(widget.fieldId, widget.type, mode);

            if (all || (newWidget && this.widgets.slice(-1)[0].fieldId == widget.fieldId)) {
                component.addClass('new');
            }

            // テキストボックスの場合はEnterキーで発動できるように
            if (this.isPlayMode(mode) && equals(widget.type, this.WidgetType.TextBox) && component instanceof TextBox) {
                component.textBox.onkeydown = this.onTextBoxKeyDown.bind(this);
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
                // this.appearDog(x, y + getRandom(-8, 8));
                this.appearDog(x, y + Random.get(-8, 8));
                break;
            case 2:
                this.updateFieldValue(this.appearDog(x, y, DogCommon.RandomValue, DogCommon.RandomValue, DogCommon.RandomValue, DogCommon.RandomValue));
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

    onResetButtonClick() {
        if (confirm('すべての設計内容をリセットします。\nこの操作は元に戻せません。\n\nよろしければ[OK]を押してください。')) {
            this.resetAll(this.Mode.Edit);
            this.resetAll(this.Mode.Play);
            this.changeMode(this.isEditMode(this.currentMode));
        }
    }

    buildSelectBgArea() {

        const CLASS_THUMBNAIL = 'thumbnail';

        Html.setVisible(this.selectBgArea, false);

        Html.clearChildElements(this.selectBgArea);
        const clearBg = Html.createDivElement(this.HtmlId.clearBg, CLASS_THUMBNAIL, Html.createPElement(null, null, '背景なし'));
        clearBg.onclick = () => this.changeBackground(null);

        this.selectBgArea.appendChild(clearBg);

        for (let id of this.backgroundIds) {
            const img = Html.createImgElement(this.makeBgId(id), CLASS_THUMBNAIL, this.makeImageUrl(id));
            img.onclick = () => this.changeBackground(id);
            this.selectBgArea.appendChild(img);
        }

        this.updateBgSelected();
        Html.setVisible(this.selectBgArea, true);

    }

    makeBgId(id) {
        return `bg${id}`;
    }

    updateBgSelected() {

        const CLASS_SELECTED = 'selected';
        const id = this.backgroundId == null ? this.HtmlId.clearBg : this.makeBgId(this.backgroundId);

        for (let thumbnail of this.selectBgArea.children) {
            if (thumbnail.id == id) {
                thumbnail.classList.add(CLASS_SELECTED);
            } else {
                thumbnail.classList.remove(CLASS_SELECTED);
            }
        }
    }

    updateLinkUrl() {

        const params = [];

        let flags = Text.Empty;

        if (!equals(this.currentMode, this.Default.Mode, false, false)) flags += this.isEditMode(this.currentMode) ? this.ParamCode.EditMode : this.ParamCode.RunMode;
        if (this.canClickScreen) flags += this.ParamCode.Clickable;
        if (this.isDebugMode) flags += this.ParamCode.DebugMode;

        let bgId = this.backgroundIds.findIndex(x => equals(x, this.backgroundId));
        if (bgId >= 0) {
            flags += (bgId + 1).toString();
        } else {
            params.push({ param: this.ParamCode.background, value: this.backgroundId ?? Text.Empty });
        }

        params.push({ param: this.ParamCode.flags, value: flags });
        params.push({ param: this.ParamCode.Widgets, value: this.getWidgetsRestoreCode() });

        let hexCode = this.getWidgetTypesCode();
        if (equals(hexCode, this.defaultWidgetTypesCode)) hexCode = Text.Empty;
        params.push({ param: this.ParamCode.WidgetsType, value: hexCode });
        params.push({ param: this.ParamCode.Buttons, value: this.getButtonRestoreCode() });

        const queryString = params.filter(x => !Text.isBlank(x.value)).map(y => `${y.param}=${encodeURIComponent(y.value)}`).join('&');
        const newUrl = (location.href.split('?')[0]) + (Text.isBlank(queryString) ? Text.Empty : '?' + queryString);

        this.updateLinkAnchor.setAttribute('href', newUrl);
        console.log('リンクURL更新', newUrl);

    }

    onMenubuttonClick() {
        console.log('イベント:', '[メニューボタン]マウスクリック');
        if (confirm('サンプルを別タブに表示します。\n今作っているものに戻るにはタブを切り替えてください。')) {
            window.open('./?n=c1&w=dczrprkl&u=7f&t=dog.random', '_blank');
        }
    }

    // [一時停止]ボタン
    onPauseButtonClick() {
        console.log('イベント:', '[一時停止ボタン]マウスクリック')
        doPauseCommand();
    }

    onCommandButtonClick() {
        console.log('イベント:', '[コマンドボタン]マウスクリック');
        this.doCommand(this.getCommandBoxText());
    }

    onModeChangeButtonClick() {
        console.log('イベント:', '[モード変更ボタン]マウスクリック');
        this.changeMode(this.isPlayMode(this.currentMode))
    }

    isKeyEnter(event) {
        const KEY_ENTER = 'Enter';
        return (event?.key == KEY_ENTER)
    }

    onCommandTextKeyDown(event) {
        if (this.isKeyEnter(event)) {
            console.log('イベント:', '[コマンドテキストボックス]Enterキー押下');
            event.preventDefault();
            this.doCommand(this.getCommandBoxText());
        }
    }

    onTextBoxKeyDown(event) {
        if (this.isKeyEnter(event)) {
            console.log('イベント:', '[項目テキストボックス]Enterキー入力');
            this.doCommand(this.Command.Dog);
            event.preventDefault();
        }
    }

    onActButtonClick(command, caption) {
        console.log('イベント:', `[${caption}]ボタンクリック`);
        this.doCommand(command);
    }

    isPlayMode(mode = null) { return ((mode ?? this.currentMode) == this.Mode.Play); }
    isEditMode(mode = null) { return !this.isPlayMode(mode); }

    updateDebugArea(visible) {
        if (isNone(debugArea)) return;
        Html.setVisible(this.debugArea, visible);
    }

    updateMainScreen(isDebugMode) {
        this.mainScreen.isDebugMode = isDebugMode
        this.mainScreen.render(isDebugMode);
    }

    prepareHtmlElements() {
        console.log('常用HTMLエレメント事前準備');

        this.layoutArea = Html.getById(this.HtmlId.Layout);
        this.modeText = Html.getById(this.HtmlId.ModeText);
        this.modeDescription = Html.getById(this.HtmlId.ModeDescription);
        this.updateLinkAnchor = Html.getById(this.HtmlId.UpdateLink);
        this.selectBgArea = Html.getById(this.HtmlId.SelectBgArea);
        this.contentArea = Html.getById(this.HtmlId.Content);
        this.widgetArea = Html.getById(this.HtmlId.WidgetArea);
        this.widgetsInfo = Html.getById(this.HtmlId.WidgetsInfo)
        this.buttonArea = Html.getById(this.HtmlId.ButtonArea);
        this.debugArea = Html.getById(this.HtmlId.DebugArea);
        this.commandBox = Html.getById(this.HtmlId.CommandBox);
        if (this.commandBox instanceof HTMLInputElement && this.commandBox.type != 'text') this.commandBox = null;
        this.setEventHandlers();
    }

    appendField(fieldId, rebuild = true) {
        console.log('フィールド項目追加', fieldId);
        const index = this.widgets.findIndex((c) => equals(c.fieldId, fieldId))
        if (index == -1) {
            this.widgets.push({ fieldId: fieldId, type: this.Default.WidgetType });
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
        return this.commandBox?.value ?? Text.Empty;
    }

    appearBat() {

        if (isNone(this.batImageTile)) this.loadBatTile('bat');
        // const bat = new Bat(this.batImageTile, getRandom(this.mainScreen.width / 8, this.mainScreen.width / 8 * 7), getRandom(this.mainScreen.height / 8, this.mainScreen.height / 8 * 7));
        const bat = new Bat(this.batImageTile, Random.get(this.mainScreen.width / 8, this.mainScreen.width / 8 * 7), Random.get(this.mainScreen.height / 8, this.mainScreen.height / 8 * 7));
        this.mainScreen.addSprite(bat, 0);
    }

    setAutoMode(value) {
        if (this.isAutoMode) resetSprites();
        this.isAutoMode = value;
    }
    setClickable(value, updateLink = true) {
        this.canClickScreen = value;
        if (updateLink) this.updateLinkUrl();
    }

    appearDogByCommand(commandLine) {

        let commands = Text.split(commandLine);

        let appear = false;
        let direction = null;
        let speed = null;
        let size = null;
        let kind = null;
        let random = false;

        for (let command of commands) {
            command = this.translateCommand(command);
            switch (command) {
                case this.Command.Random:
                    direction ??= DogCommon.RandomValue;
                    speed ??= DogCommon.RandomValue;
                    size ??= DogCommon.RandomValue;
                    kind ??= DogCommon.RandomValue;
                    random = true;
                    appear = true;
                    break;
                case this.Command.Direction.Left:
                case this.Command.Direction.Right:
                    if (!isNone(direction)) break;
                    direction = this.getItems(this.Field.Direction).find(x => equals(x.command, command, false, false))?.value;
                    appear = true;
                    break;
                case this.Command.Speed.Fast:
                case this.Command.Speed.Slow:
                    if (!isNone(speed)) break;
                    speed = this.getItems(this.Field.Speed).find(x => equals(x.command, command, false, false))?.value;
                    appear = true;
                    break;
                case this.Command.Size.Big:
                case this.Command.Size.Small:
                case this.Command.Size.SuperSmall:
                case this.Command.Size.SuperBig:
                    if (!isNone(size)) break;
                    size = this.getItems(this.Field.Size).find(x => equals(x.command, command, false, false))?.value;
                    appear = true;
                    break;
                case this.Command.Size.Normal:
                case this.Command.Speed.Normal:
                    appear = true;
                    break;
                case this.Command.Dog:
                case this.Command.Play:
                    appear = true;
                    break;
                default:

                    if (this.extraKinds.includes(command)) this.appendExtraKinds();
                    const kindId = this.getItems(this.Field.Kind).find(x => equals(x.command, command, false, false))?.value;
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

        this.setFieldValue(this.Field.Direction, dog.direction);
        this.setFieldValue(this.Field.Size, dog.size);
        this.setFieldValue(this.Field.Speed, dog.speed);
        this.setFieldValue(this.Field.Kind, dog.kind);

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
        console.log('ボタンエリア消去');
        Html.clearChildElements(this.buttonArea);
    }

    buildButtons(mode = this.Mode.Play) {

        const CLASS_REMOVE_BUTTON = 'remove-button';
        const CLASS_APPEND_BUTTON = 'append-button';

        if (isNone(this.buttonArea)) return;

        console.log('ボタンインターフェース構築:', this.isPlayMode(mode) ? '実行モード' : '編集モード');

        this.clearButtonArea();
        if (this.isEditMode(mode)) {
            for (let component of this.buttonTexts) {
                this.buttonArea.appendChild(component.htmlElement);
                const removeButton = new Button(this.HtmlId.RemoveButton, '-', this.removeButton.bind(this, component.id));
                removeButton.button.classList.add(CLASS_REMOVE_BUTTON);
                this.buttonArea.appendChild(removeButton.htmlElement);
            }

            const appendButton = new Button(this.HtmlId.AppendButton, '+', this.appendButton.bind(this, null));
            appendButton.button.classList.add(CLASS_APPEND_BUTTON);
            buttonArea.appendChild(appendButton.htmlElement);

        } else {
            let previousComponent = null;
            let previousConcatLeft = false;
            for (let textBox of this.buttonTexts) {
                const command = this.translateCommand(textBox?.value);
                if (Text.isBlank(command)) continue;
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
                    nodes[index] = Html.createSpanElement(spanId, styleClass)
                }

                console.log('コマンド', command);

                const onClick = this.onActButtonClick.bind(this, command, caption);
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
        this.mainScreen?.clearSprites();
        this.totalDogCount = 0;
        this.visibleDogCount = 0;
        this.isAutoMode = false;
        this.updateDogCount();
    }

    clearCommandBox() {
        if (isNone(this.commandBox)) return;
        this.commandBox.value = Text.Empty;
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

            this.currentMode = this.Mode.Edit;
            this.layoutArea?.classList.add(CLASS_EDIT_MODE);

            body?.classList.add(CLASS_DARK_THEME);
            body?.classList.remove(CLASS_LIGHT_THEME);

            if (Html.isElement(modeText)) modeText.textContent = MODE_TEXT_EDIT;
            if (Html.isElement(modeDescription)) modeDescription.textContent = MODE_DESCRIPTION_EDIT;

        } else {

            this.currentMode = this.Mode.Play;
            this.layoutArea?.classList.remove(CLASS_EDIT_MODE);

            body?.classList.add(CLASS_LIGHT_THEME);
            body?.classList.remove(CLASS_DARK_THEME);

            if (Html.isElement(modeText)) modeText.textContent = MODE_TEXT_PLAY;
            if (Html.isElement(modeDescription)) modeDescription.textContent = MODE_DESCRIPTION_PLAY;

        }

        console.log('モード変更:', this.editMode ? `編集モード(${this.currentMode})` : '再生モード');

        this.buildWidgetArea(this.currentMode, !first && this.isPlayMode(this.currentMode));
        this.buildButtons(this.currentMode);

        commandBox?.focus();

        if (this.isPlayMode(this.currentMode)) {
            this.updateDogCount();
            this.mainScreen?.start();
        }

        this.updateLinkUrl();

    }

    getBackgroundId(code) {
        if (code > 0 && code <= this.backgroundIds.length) {
            const index = Number.parseInt(code) - 1;
            return this.backgroundIds[index];
        }
        return this.backgroundIds.find(x => equals(x, code));
    }

    run() {
        super.run().then(() => {

            const STYLE_VALUE_100PERCENT = '100%';

            overrideConsoleLog(Html.getById(this.HtmlId.LogArea));
            console.log('アプリケーション開始');

            const flags = Text.normalize(Param.get(this.ParamCode.Flags));

            const skipFrame = Param.get(this.ParamCode.SkipFrame) ?? this.DEFAULT_SKIP_FRAME;
            const maxFps = Param.get(this.ParamCode.Fps) ?? this.DEFAULT_MAX_FPS;
            const background = Param.get(this.ParamCode.Background) || flags?.match(/[0-9]/);

            const isDebug = (Param.get(this.ParamCode.DebugMode) || flags?.includes(this.ParamCode.DebugMode)) != 0;
            const widgetsCode = Param.get(this.ParamCode.Widgets);
            const buttonCode = Param.get(this.ParamCode.Buttons);

            const widgetsType = Param.get(this.ParamCode.WidgetsType);

            this.currentMode = Param.get(this.ParamCode.Mode) ?? (flags?.includes(this.ParamCode.EditMode) ? this.Mode.Edit : flags?.includes(this.ParamCode.RunMode) ? this.Mode.Play : this.Default.Mode);
            this.canClickScreen = (Param.get(this.ParamCode.Clickable) || flags?.includes(this.ParamCode.Clickable)) != 0;

            this.onChangeDebugMode = (isDebugMode) => {
                this.updateMainScreen(isDebugMode);
                this.updateDebugArea(isDebugMode);
                this.updateLinkUrl();
            };

            this.prepareHtmlElements();
            this.initializeWidgetItems();
            this.normalizeTranslateTable();
            this.InitializeWidgets(widgetsCode, widgetsType);
            this.initializeButtons(buttonCode);

            this.buildSelectBgArea();

            const screenCanvas = Html.getById(this.HtmlId.Screen);
            if (!(screenCanvas instanceof HTMLCanvasElement)) return;

            screenCanvas.style.width = STYLE_VALUE_100PERCENT;
            screenCanvas.style.height = STYLE_VALUE_100PERCENT;

            this.mainScreen = new ActiveCanvas(screenCanvas, 0, 0, null, maxFps, skipFrame, isDebug);
            this.mainScreen.drawOrders.push((s) => s.bottom);

            this.changeBackground(this.getBackgroundId(background));
            this.changeMode(this.isEditMode(), true);

            this.setDebugMode(isDebug);

            this.mainScreen.onClick = this.onMainScreenClick.bind(this);

            this.mainScreen.onUpdate = () => {

                if (this.isAutoMode && this.isPlayMode() && Math.random() * 100 < 5) {
                    this.doRandomCommand();
                }

            };

            this.mainScreen.onDraw = (ctx, target, debug) => {

                if (this.backgroundImageTile == null || this.backgroundImageTile?.image == null) {
                    target.clear(debug);
                } else {
                    this.backgroundImageTile.draw(ctx, 0, 0, target.width, target.height);
                }

                target.sprites.filter(x => x instanceof Dog).forEach(sprite => {
                    this.dogShadowTile.draw(ctx, sprite, 0, 0);
                });

                target.sprites.forEach(sprite => {
                    sprite.render(ctx, debug);
                });
            };

            Html.setVisible(Html.getById(this.HtmlId.WindowOverlay), false);

        });
    }

}

new YnuTube().run();