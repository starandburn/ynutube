'use strict';

class Component {

    #id = null;
    #rootElement = null;

    get id() { return this.#id; }
    get element() { return this.#rootElement; }
    get coreNode() { return this.element; }

    _isNone(obj) { return (obj == null || obj == undefined || obj == NaN); }
    _isElement(obj) { return (obj instanceof HTMLElement); }

    addClass(className) {
        if (this._isNone(className)) return;
        this.#rootElement?.classList.add(className);
    }
    removeClass(className) {
        if (this._isNone(className)) return;
        this.#rootElement?.classList.remove(className);
    }

    constructor(id, className) {
        this.#id = id;
        this.#rootElement = this._createDiv(className);
        if (!this._isElement(this.#rootElement)) return;
        this.#rootElement.id = `${id}Component`;
    }

    _appendChild(node) {
        if (this._isNone(node)) return;
        this.#rootElement?.appendChild(node);
    }

    _createElement(tagName, className) {
        const element = document.createElement(tagName) || null;
        if (!this._isNone(className)) element?.classList.add(className);
        return element;
    }

    _createTextNode(text) {
        return document.createTextNode(text ?? '');
    }
    _createDiv(className) {
        return this._createElement('div', className);
    }
    _createParagraph(text) {
        const element = this._createElement('p');
        if (!this._isElement(element)) return;
        element.textContent = text;
        return element;
    }
    _createLabel(forName) {
        const label = this._createElement('label');
        if (!this._isNone(forName)) label?.setAttribute('for', forName);
        return label;
    }
    _createInput(type) {
        const input = document.createElement('input');
        if (this._isNone(input)) return;
        input.type = type;
        return input;
    }
    _createOption(value, text, selected = false) {
        const option = this._createElement('option');
        if (this._isNone(option)) return null;
        option.value = value;
        option.selected = selected;
        option.appendChild(this._createTextNode(text));
        return option;
    }

    appendTo(parent) {
        parent?.appendChild(this.#rootElement);
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

    _update() {
        if (this.onUpdateValue == null) return;
        this.onUpdateValue();
    }

    onUpdateValue = () => { };

}

class Button extends Component {

    #button = null;
    #textNode = null;
    #text = null;

    #updateTextNode() {
        this.#textNode.textContent = this.#text?.toString().trim() ?? '';
    }

    constructor(id, text, onclick, className, before, after) {

        super(id, className);
        this.#button = this._createElement('button', className);
        if (!this._isNone(onclick)) {
            this.#button.onclick = onclick;
        }
        this.#text = text;
        this.#textNode = this._createTextNode();
        this.#updateTextNode();

        let isBefore = true;
        for (let option of [before, after]) {
            if (!isBefore) this.#button.appendChild(this.#textNode);
            isBefore = false;
            if (isNone(option)) continue;
            if (option instanceof HTMLElement) {
                this.#button.appendChild(option);
            } else {
                this.#button.appendChild(this._createTextNode(option?.toString()));
            }
        }

        this._appendChild(this.#button);
    }

    get coreNode() { return this.#button; }
    get text() { return this.#text; }
    set text(value) {
        this.#text = value;
        this.#updateTextNode();
    }
}

class FixedLabel extends Component {

    #textNode = null;
    #text = null;
    #value = null;
    #textMap = null;

    constructor(id, value, textMap, className) {
        super(id, className);

        this.#textNode = this._createTextNode();
        this._appendChild(this.#textNode);

        if (textMap instanceof Array) {
            this.#textMap = textMap;
        } else {
            this.#textMap = null;
            this.text = textMap;
        }

        this.value = value;
    }

    get text() {
        return this.#text;
    }
    set text(value) {
        this.#text = value;
        this.#textNode.textContent = this.#text?.toString().trim() ?? '';
    }

    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
        if (this.#textMap instanceof Array) {
            this.text = this.#textMap?.find((t) => t?.value == this?.value)?.text ?? this.value;
        } else {
            this.text = this.value;
        }
    }
}


class TextBox extends Component {

    #textBox = null;
    #items = null;
    #placeholder = null;

    constructor(id, value, commandMap, className, placeholder) {
        super(id, className)
        this.#textBox = this._createInput('text');
        this.#textBox.value = value ?? '';
        this.#textBox.addEventListener('change', this._update.bind(this));

        this.#items = commandMap;
        this.placeholder = placeholder;
        this._appendChild(this.#textBox);
    }

    get placeholder() {
        return this.#placeholder ?? '';
    }
    set placeholder(value) {
        this.#placeholder = value;
        if (this.#textBox instanceof HTMLInputElement) {
            this.#textBox.setAttribute('placeholder', this.#placeholder ?? '');
        }
    }

    get coreNode() { return this.#textBox };

    get value() {
        return this.#textBox?.value;
    }

    set value(value) {
        if (this.#textBox instanceof HTMLInputElement) {
            // let text = this._items?.find((x) => x?.id == value)?.command ?? null;
            let text = this.#items?.find((x) => x?.value == value)?.command ?? null;
            this.#textBox.value = text ?? value;
        }
    }

}


class RadioButtons extends Component {

    #radioButtons = [];

    constructor(id, options, defaultValue, className) {
        super(id, className)

        this.#radioButtons = [];

        for (let opt of options) {
            const childId = `${id}_${opt.value}`
            const paragraph = this._createParagraph();

            const radioButton = this._createInput('radio');
            radioButton.name = id;
            radioButton.id = childId;
            radioButton.value = opt.value;
            radioButton.checked = (opt.value == defaultValue);
            // radioButton.addEventListener('change', this._update.bind(this));
            radioButton.onchange = this._update.bind(this);

            this.#radioButtons.push(radioButton);
            paragraph.appendChild(radioButton);

            const label = this._createLabel(childId);
            label.appendChild(this._createTextNode(opt.text));
            paragraph.appendChild(label);
            this._appendChild(paragraph);
        }

    }

    get value() {
        for (let radioButton of this.#radioButtons) {
            if (radioButton.checked) return radioButton.value;
        }
        return null;
    }

    set value(value) {
        for (let radioButton of this.#radioButtons) {
            radioButton.checked = (radioButton.value == value);
        }
    }

}


class CheckBox extends Component {

    #checkBox = null;
    #defaultValue = null;
    #checkedValue = null;

    constructor(id, text, defaultValue, checkedValue, className) {
        super(id, className);

        this.#defaultValue = defaultValue;
        this.#checkedValue = checkedValue;

        this.#checkBox = this._createInput('checkbox');

        this.#checkBox.name = id;
        this.#checkBox.id = id;
        this.#checkBox.value = checkedValue;
        this.#checkBox.checked = (defaultValue == checkedValue);

        // this.#checkBox.addEventListener('change', this._update.bind(this));
        this.#checkBox.onchange = this._update.bind(this);

        const paragraph = this._createParagraph();
        paragraph.appendChild(this.#checkBox);

        const label = this._createLabel(id);
        label.appendChild(this._createTextNode(text));
        paragraph.appendChild(label);

        this._appendChild(paragraph);

    }

    get coreNode() { return this.#checkBox; }

    get value() {
        return (this.#checkBox.checked) ? this.#checkedValue : this.#defaultValue;
    }

    set value(value) {
        this.#checkBox.checked = (this.#checkedValue == value);
    }

}

class DropDown extends Component {

    #selectBox = null;
    #options = [];

    constructor(id, listItems, defaultValue, className) {
        super(id, className)

        this.#selectBox = this._createElement('select');
        this.#selectBox.addEventListener('change', this._update.bind(this));

        this._appendChild(this.#selectBox);

        for (let item of listItems) {
            const option = this._createOption(item.value, item.text, (item.value == defaultValue));
            this.#options.push(option);
            this.#selectBox.appendChild(option);
        }

    }

    get coreNode() { return this.#selectBox; }

    get value() {

        for (let option of this.#options) {
            if (option.selected) return option.value;
        }
        return null;
    }

    set value(value) {
        for (let option of this.#options) {
            option.selected = (option.value == value);
        }
    }

}


class ListBox extends DropDown {

    #ondblclick = () => { };

    constructor(id, listItems, defaultValue, className, size, ondblclick) {
        super(id, listItems, defaultValue, className)
        super.coreNode.size = size || listItems.length;
        this.#ondblclick = ondblclick;

        if (isNone(ondblclick)) return;
        // super.coreNode.addEventListener('dblclick', this.#ondblclick?.bind(this));
        super.coreNode.ondblclick = this.#ondblclick?.bind(this);
    }

}

class Slider extends Component {

    #range = null;
    #values = null;

    constructor(id, values, defaultValue, className) {
        super(id, className)

        this.#values = values.slice();

        this.#range = this._createInput('range');
        this.#range.min = 0;
        this.#range.max = (values?.length ?? 1) - 1;
        this.#range.step = 1;

        this._currentText = this._createTextNode();
        const paragraph = this._createParagraph();
        paragraph.appendChild(this._currentText);

        this.value = defaultValue;

        this._appendChild(this.#range);
        this._appendChild(paragraph);

        // this.#range.addEventListener('input', this._update.bind(this));
        this.#range.oninput = this._update.bind(this);

    }

    get coreNode() { return this.#range; }

    get value() {
        const index = this.#range.value;
        // return this._values[index].id;
        return this.#values[index].value;
    }

    set value(value) {
        for (let i = 0; i < this.#values.length; i++) {
            // if (this._values[i].id == value) {
            if (this.#values[i].value == value) {
                this.#range.value = i;
                this._update();
                return;
            }
        }
    }
    _update() {
        this._currentText.textContent = this.#values[this.#range.value]?.text;
        this.onUpdateValue();
    }
}


class ImageList extends Component {

    #listItems = [];
    #list = null;
    #images = [];
    #value = null;
    #ondblclick = () => { };

    constructor(id, listItems, defaultValue, className, ondblclick) {

        super(id, className)

        this.#list = this._createElement('ul');
        this._appendChild(this.#list);
        this.#ondblclick = ondblclick;

        for (let item of listItems) {
            const liElement = this._createElement('li');
            const image = this._createElement('img');

            image.src = item?.src;
            // image.id = item?.id;
            image.id = item?.value;
            image.alt = item?.text;

            // image.addEventListener('click', this._onClick.bind(this));
            image.onclick = this.#onclick.bind(this);

            // image.addEventListener('dblclick', this.#ondblclick?.bind(this));
            image.ondblclick = this.#ondblclick?.bind(this);

            this.#images.push(image);

            liElement.appendChild(image);
            this.#listItems.push(liElement);
            this.#list.appendChild(liElement);

        }
        this._update(defaultValue);

    }

    #onclick(e) {
        const image = (e?.target) ?? null;
        if (image instanceof HTMLImageElement) {
            this._update(image.id);
        }
    }

    _update(value) {

        const CLASS_SELECTED = 'selected'

        for (let image of this.#images) {
            if (image.id == value) {
                image.classList.add(CLASS_SELECTED);
            } else {
                image.classList.remove(CLASS_SELECTED);
            }
        }
        this.#value = value;

        this.onUpdateValue();
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
        this._update(this.#value);
    }

}

