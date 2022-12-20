'use strict'

const Html = Object.freeze({

    Tag: {
        Div: 'div',
        P: 'p',
        Span: 'span',
        Img: 'img',
        Ul: 'ul',
        Ol: 'ol',
        Li: 'li',
    },

    DisplayStyleValue: {
        None: 'none',
        Block: 'block',
        Flex: 'flex',
    },

    createElement: (tagName, id, className, ...nodes) => {
        const element = document.createElement(tagName);
        if (!Html.isElement(element)) return null;
        if (!Html.isNone(id)) element.id = id?.toString();
        if (!Html.isBlank(className)) element.classList.add(className?.toString());

        for (let node of nodes) {
            if (Html.isElement(node)) {
                element.appendChild(node);
            } else if (!isNone(node)) {
                element.textContent = node?.toString();
            }
        }
        return element;
    },

    createDivElement: (id, className, ...nodes) => {
        return Html.createElement(Html.Tag.Div, id, className, ...nodes);
    },

    createPElement: (id, className, ...nodes) => {
        return Html.createElement(Html.Tag.P, id, className, ...nodes);
    },

    createSpanElement: (id, className, ...nodes) => {
        return Html.createElement(Html.Tag.Span, id, className, ...nodes);
    },

    createImgElement: (id, className, src, alt) => {
        const element = Html.createElement(Html.Tag.Img, id, className);
        element.src = src?.toString();
        element.alt = alt?.toString();
        return element;
    },

    clearChildElements: (parent) => {
        while (parent?.firstChild) parent.removeChild(parent.firstChild);
    },

    setVisible: (element, visible, isFlex = true) => {
        element.style.display = visible ? (isFlex ? Html.DisplayStyleValue.Flex : Html.DisplayStyleValue.Block) : Html.DisplayStyleValue.None;
    },

    getById: (id) => {
        const PREFIX_HTML_ID = '#';
        let selector = id?.toString().trim() ?? '';
        if (Html.isBlank(selector)) return null;
        if (!selector.startsWith(PREFIX_HTML_ID)) selector = `${PREFIX_HTML_ID}${selector}`;
        return document.querySelector(selector);
    },

    getByClass: (className, single = false) => {
        const PREFIX_HTML_CLASS = '.';
        let selector = className?.toString().trim() ?? '';
        if (Html.isBlank(selector)) return single ? null : [];
        if (!selector.startsWith(PREFIX_HTML_CLASS)) selector = `${PREFIX_HTML_CLASS}${selector}`;
        if (single) document.querySelector(selector);
        return document.querySelectorAll(selector);
    },

    isElement: (element) => (element instanceof HTMLElement),
    isNone: (obj) => (obj == null || obj == undefined || obj == NaN),
    isBlank: (str) => (Html.isNone(str) || ((str?.toString().trim().length ?? 0) == 0)),

});
