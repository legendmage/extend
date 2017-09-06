(function (factory) {
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.element = {});
    }

}(function (ko, exports) {
    if (typeof (ko) === 'undefined') {
        throw new Error('Knockout is required, please ensure it is loaded before loading this validation plug-in');
    }

    ko.element = exports;

    var ke = ko.element,
        koUtils = ko.utils,
        extend = koUtils.extend;
    var currentBinding = '',
        ignoreElements = ["html", "head", "body", "script", "meta", "title"],
        handlerNames = ["text", "value", "checked", "textInput", "selectedOptions", "click","enable"];

    var def = {
        bindSymbol: ':', // 生成标记字段是  绑定符号替换  默认是 ：
        splitSymbol: ',', // 栏位包含多个绑定是 选择分割符号，默认，
    }

    // 先取到元素 给元素追加新属性   检索时根据新属性  配合ID/class，及其他辅助查询，定位具体元素位置

    var api = (function () {

        /**
         * 获取截取后字符串
         * @param {string} str : 要截取的字符串
         * @param {string} startStr:开始的字符/字符串 
         */
        function getSubstr(str, startStr) {
            var _str = str;
            var _index = _str.indexOf(startStr);
            _str = _str.substring(_index, _str.length);
            var _fIndex = _str.indexOf(",");
            if (_fIndex > -1) {
                _str = _str.substring(_index, _fIndex);
            }
            return _str.replace(':', def.bindSymbol);
        }

        /**
         * 获取data-elem元素属性
         * @param {dom} element 
         */
        function getDataElem(element) {
            var _arr = [];
            var _attr = element.getAttribute("data-bind");
            _attr = _attr.replace(/ /g, "");

            for (var i = 0; i < handlerNames.length; i++) {
                var _str = getSubstr(_attr, handlerNames[i] + ':');
                if (_arr.indexOf(_str) <= -1)
                    _arr.push(_str);
            }
            return _arr.join(def.splitSymbol);
        }


        /**
         * 获取元素
         * @param {array} elems: 元素集合 
         * @param {string} attrValue： 属性值 
         */
        function getElementsByAttr(elems, attrValue) {
            var _elems = [];
            for (var i = 0; i < elems.length; i++) {
                if (ignoreElements.indexOf(elems[i].tagName.toLowerCase()) <= -1) {
                    var _attrs = elems[i].getAttribute("data-elem") || '';
                    if (_attrs.indexOf(def.splitSymbol) <= -1) {
                        if (_attrs === attrValue)
                            _elems.push(elems[i]);
                    } else {
                        _attrs = _attrs.split(def.splitSymbol);
                        if (_attrs.indexOf(attrValue) > -1)
                            _elems.push(elems[i]);
                    }
                }
            }
            _elems = _elems.length > 0 ? (_elems.length == 1 ? _elems[0] : _elems) : '';
            return _elems;
        }

        return {
            init: function (options) {
                options = options || {};
                extend(def, options);
            },

            /**
             * 重载默认绑定
             * @param {string} handlerName: 绑定名称  value/checked/textInput/selectedOptions
             */
            overrideBindingHandler: function (handlerName) {
                var init = ko.bindingHandlers[handlerName].init;
                ko.bindingHandlers[handlerName].init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    currentBinding = handlerName;
                    if (init instanceof Function) {
                        init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                    }
                    return ko.bindingHandlers['elementCore'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                };
            },

            setElementAttribute: function (element) {
                var dataElem = getDataElem(element);
                if (!element.hasAttribute("data-elem")) {
                    element.setAttribute("data-elem", dataElem);
                }
            },

            /**
             * 根据属性值，类名查找元素
             * 类名可不传。传类名后，优先根据类名查找，根据属性名对结果进行筛选
             * @param {string} attrValue: 属性名
             * @param {string} className: 类名
             */
            find: function (attrValue, className) {
                var elems = '';
                if (className) {
                    var es = document.getElementsByClassName(className);
                    if (es.length > 0) {
                        elems = getElementsByAttr(es, attrValue);
                    }
                } else {
                    var es = document.getElementsByTagName("*");
                    if (es.length > 0) {
                        elems = getElementsByAttr(es, attrValue);
                    }
                }
                return elems;
            }

        }

    }());

    extend(ko.element, api);


    ko.bindingHandlers["elementCore"] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ke.setElementAttribute(element);
        }
    };

    // override for KO's default 'value', 'checked', 'textInput' and selectedOptions... bindings

    for (var i = 0; i < handlerNames.length; i++) {
        var _handlerName = handlerNames[i];
        if (ko.bindingHandlers.textInput && _handlerName === "textInput") {
            ke.overrideBindingHandler("textInput");
        } else {
            ke.overrideBindingHandler(_handlerName);
        }
    }

    // ke.overrideBindingHandler("value");
    // ke.overrideBindingHandler("checked");
    // if (ko.bindingHandlers.textInput) {
    //     ke.overrideBindingHandler("textInput");
    // }
    // ke.overrideBindingHandler("selectedOptions");

}))