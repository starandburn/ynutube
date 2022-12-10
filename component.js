'use strict';

class Component {

    _id = null;
    _topElement = null;

    get id() { return this._id; }
    get htmlElement() { return this._topElement; }

    addClass(styleClass) {
        if (styleClass == null || styleClass == undefined) return;
        this._topElement.classList.add(styleClass);
    }
    removeClass(styleClass) {
        if (styleClass == null || styleClass == undefined) return;
        this._topElement.classList.remove(styleClass);
    }

    constructor(id, styleClass) {
        this._id = id;
        this._topElement = this._createDiv(styleClass);
        this._topElement.id = `${id}Component`;
    }

    _appendChild(element) {
        if (element == null || element == undefined) return;
        this._topElement?.appendChild(element);
    }

    _createElement(htmlTag, styleClass) {
        const element = document.createElement(htmlTag) ?? null;
        if (styleClass != null && styleClass != undefined) element?.classList.add(styleClass);
        return element;
    }
    _createTextNode(text) {
        return document.createTextNode(text ?? '');
    }
    _createDiv(styleClass) {
        return this._createElement('div', styleClass);
    }
    _createParagraph(text) {
        const element = this._createElement('p');
        element.textContent = text;
        return element;
    }
    _createLabel(forName) {
        const label = this._createElement('label');
        if (forName != null || forname != undefined) {
            label.setAttribute('for', forName);
        }
        return label;
    }
    _createInput(type) {
        const input = document.createElement('input');
        input.type = type;
        return input;
    }
    _createOption(value, text, selected = false) {
        const option = this._createElement('option');
        option.value = value;
        option.selected = selected;
        option.appendChild(this._createTextNode(text));
        return option;
    }

    appendTo(parent) {
        parent?.appendChild(this._topElement);
    }

    get value() { return null; }
    set value(value) { }

    get text() { return (this.value?.toString().trim().toLowerCase() ?? ''); }
    get number() {
        const value = parseInt(this.value);
        if (isNaN(value)) return null;
        return value;
    }

    setValue(value) {
        this.value = value;
    }

}

class Button extends Component {

    button = null;
    _textNode = null;
    _text = null;

    constructor(id, text, onClick, styleClass) {
        super(id, styleClass);
        this.button = this._createElement('button', styleClass);
        if (onClick != null && onClick != undefined) {
            this.button.setAttribute('onClick', onClick);
        }
        this._text = text;
        this._textNode = this._createTextNode();
        this._textNode.textContent = this._text?.toString().trim() ?? '';
        this.button.appendChild(this._textNode);
        this._appendChild(this.button);
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
        this._textNode.textContent = this._text?.toString().trim() ?? '';
    }
}

class FixedLabel extends Component {

    _textNode = null;
    _text = null;
    _value = null;
    _texts = null;

    constructor(id, value, texts, styleClass) {
        super(id, styleClass);

        this._textNode = this._createTextNode();
        this._appendChild(this._textNode);

        if (texts instanceof Array) {
            this._texts = texts;
        } else {
            this._texts = null;
            this.text = texts;
        }

        this.value = value;
    }

    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
        this._textNode.textContent = this._text?.toString().trim() ?? '';
    }

    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this._texts instanceof Array) {
            this.text = this._texts?.find((t) => t?.id == this?.value)?.text ?? this.value;
        } else {
            this.text = this.value;
        }
    }
}

class TextBox extends Component {

    textBox = null;
    _items = null;
    _placeholder = null;

    constructor(name, value, items, styleClass, placeholder) {
        super(name, styleClass)
        this.textBox = this._createInput('text');
        this.textBox.value = value ?? '';
        this._items = items;
        this.placeholder = placeholder;
        this._appendChild(this.textBox);
    }

    get placeholder() {
        return this._placeholder ?? '';
    }
    set placeholder(value) {
        this._placeholder = value;
        if (this.textBox instanceof HTMLInputElement) {
            let text = this._items?.find((x) => x?.id == value)?.command ?? null;
            this.textBox.setAttribute('placeholder', this._placeholder ?? '');
        }
    }

    get value() {
        return this.textBox?.value;
    }

    set value(value) {
        if (this.textBox instanceof HTMLInputElement) {
            let text = this._items?.find((x) => x?.id == value)?.command ?? null;
            this.textBox.value = text ?? value;
        }
    }

}

class RadioButtons extends Component {

    _radioButtons = [];

    constructor(name, options, defaultValue, styleClass) {
        super(name, styleClass)

        this._radioButtons = [];

        for (let opt of options) {
            const id = `${name}_${opt.id}`
            const paragraph = this._createParagraph();

            const radioButton = this._createInput('radio');
            radioButton.name = name;
            radioButton.id = id;
            radioButton.value = opt.id;
            radioButton.checked = (opt.id == defaultValue);

            this._radioButtons.push(radioButton);
            paragraph.appendChild(radioButton);

            const label = this._createLabel(id);
            label.appendChild(this._createTextNode(opt.text));
            paragraph.appendChild(label);
            this._appendChild(paragraph);
        }
    }

    get value() {
        for (let radioBUtton of this._radioButtons) {
            if (radioBUtton.checked) return radioBUtton.value;
        }
        return null;
    }

    set value(value) {
        for (let radioButton of this._radioButtons) {
            radioButton.checked = (radioButton.value == value);
        }
    }

}


class CheckBox extends Component {

    _checkBox = null;
    _defaultValue = null;
    _checkedValue = null;

    constructor(name, text, defaultValue, checkedValue, styleClass) {
        super(name, styleClass);

        this._defaultValue = defaultValue;
        this._checkedValue = checkedValue;

        this._checkBox = this._createInput('checkbox');

        this._checkBox.name = name;
        this._checkBox.id = name;
        this._checkBox.value = checkedValue;
        this._checkBox.checked = (defaultValue == checkedValue);

        const paragraph = this._createParagraph();
        paragraph.appendChild(this._checkBox);

        const label = this._createLabel(name);
        label.appendChild(this._createTextNode(text));
        paragraph.appendChild(label);

        this._appendChild(paragraph);
    }

    get value() {
        return (this._checkBox.checked) ? this._checkedValue : this._defaultValue;
    }

    set value(value) {
        this._checkBox.checked = (this._checkedValue == value);
    }

}

class DropDown extends Component {

    _selectBox = null;
    _options = [];

    constructor(name, listItems, defaultValue, styleClass) {
        super(name, styleClass)

        this._selectBox = this._createElement('select');
        this._appendChild(this._selectBox);

        for (let item of listItems) {
            const option = this._createOption(item.id, item.text, (item.id == defaultValue));
            this._options.push(option);
            this._selectBox.appendChild(option);
        }

    }

    get value() {
        for (let option of this._options) {
            if (option.selected) return option.value;
        }
        return null;
    }

    set value(value) {
        for (let option of this._options) {
            option.selected = (option.value == value);
        }
    }

}


class ListBox extends DropDown {

    _onDoubleClick = () => { };

    constructor(name, listItems, defaultValue, styleClass, size, onDoubleClick) {
        super(name, listItems, defaultValue, styleClass)
        this._selectBox.size = size || listItems.length;
        this._onDoubleClick = onDoubleClick;

        this._selectBox.addEventListener('dblclick', this._onDoubleClick.bind(this));
    }

}

class Slider extends Component {

    _range = null;
    _values = null;

    constructor(name, values, defaultValue, styleClass) {
        super(name, styleClass)

        this._values = values.slice();

        this._range = this._createInput('range');
        this._range.min = 0;
        this._range.max = (values?.length ?? 1) - 1;
        this._range.step = 1;

        this._currentText = this._createTextNode();
        const paragraph = this._createParagraph();
        paragraph.appendChild(this._currentText);

        this.value = defaultValue;

        this._appendChild(this._range);
        this._appendChild(paragraph);

        this._range.addEventListener('input', this._update.bind(this));

    }

    get value() {
        const index = this._range.value;
        return this._values[index].id;
    }

    set value(value) {
        for (let i = 0; i < this._values.length; i++) {
            if (this._values[i].id == value) {
                this._range.value = i;
                this._update();
                return;
            }
        }
    }
    _update() {
        this._currentText.textContent = this._values[this._range.value]?.text;
    }
}


class ImageList extends Component {

    _listItems = [];
    _list = null;
    _images = [];
    _value = null;
    _onDoubleClick = () => { };

    constructor(name, listItems, defaultValue, styleClass, onDoubleClick) {

        super(name, styleClass)

        this._list = this._createElement('ul');
        this._appendChild(this._list);
        this._onDoubleClick = onDoubleClick;

        for (let item of listItems) {
            const liElement = this._createElement('li');
            const image = this._createElement('img');

            image.src = item?.src;
            image.id = item?.id;
            image.alt = item?.text;

            image.addEventListener('click', this._onClick.bind(this));
            image.addEventListener('dblclick', this._onDoubleClick?.bind(this));
            this._images.push(image);

            liElement.appendChild(image);
            this._listItems.push(liElement);
            this._list.appendChild(liElement);

        }
        this._update(defaultValue);

    }

    _onClick(e) {
        const image = (e?.target) ?? null;
        if (image instanceof HTMLImageElement) {
            this._update(image.id);
        }
    }

    _update(id) {

        const CLASS_SELECTED = 'selected'

        for (let image of this._images) {
            if (image.id == id) {
                image.classList.add(CLASS_SELECTED);
            } else {
                image.classList.remove(CLASS_SELECTED);
            }
        }
        this._value = id;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this._update(this._value);
    }

}

