(function (factory) {
    "use strict"
    var autoVal, dataSource;

    /**
     * Q1:可定制显示条数
     * Q2:支持远程数据源
     * Q3:支持手动输入筛选  
     */

    // GLOBAL
    /**
     * class: 新增类
     * data： 数据源 数组  //后期扩展支持 url，静态文件 . !!不支持深度数组 [ [] ]
     */
    var defalut = {
        class: '',
        data: [],
        autoTitle: '',
        autoVal: '',
        visibelLimt: 10,

    };

    var utility = {
        getElementByClassNames: function (Element, className, defaultFirstNode) {
            defaultFirstNode = defaultFirstNode || true;
            var classArray = new Array();
            var parentNode = Element.parentElement;
            var nodes = parentNode.children;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].className.indexOf(className) >= 0) {
                    classArray.push(nodes[i]);
                }
            }
            if (defaultFirstNode && classArray) {
                return classArray[0]
            } else {
                return classArray;
            }
        },
        registerClickEvent: function (sourceElem, resultCallback) {
            var items = sourceElem.querySelectorAll('div.autocomplete-item');
            for (var i = 0; i < items.length; i++) {
                !function (item, index) {
                    item.addEventListener('mousedown', function () {
                        var _rval = this.getAttribute('data-autoval');
                        var _rtitle = this.innerText;
                        sourceElem.previousElementSibling.value = _rtitle;
                        if (resultCallback
                            && (resultCallback instanceof Function))
                            resultCallback(_rval);
                    })
                }(items[i], i);
            }
            sourceElem.hasClickEvent = true;
        },
        dataHandler: function (autoData) {
            autoData = autoData || [];

            // check data

            // if (autoData instanceof Object && autoData instanceof Array) {
            //     if (autoData.length <= 0)
            //         return [];

            //     if (autoData[0] instanceof Object) {

            //     }

            //     if (typeof (autoData[0]) == 'number'
            //         || typeof (autoData[0]) == 'string'
            //         || typeof (autoData[0]) == 'boolean') {

            //     }

            //     if (autoData.length > 0) {
            //         if (autoData[0] instanceof Object) {

            //         } else {
            //             console.log('Depth array is not supported!');
            //         }
            //     } else {
            //         console.log('this is empty array!');
            //     }
            // }

            return autoData;
        },
        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },
    }

    //BUILD DIV
    var buildDiv = function (ev, opt) {
        var parentElem = ev.parentElement;
        var mainNode = document.createElement('div');
        mainNode.className = 'autocomplete-main';
        mainNode.style.cssText = 'width:auto;display:inline-block;position: relative;';
        parentElem.appendChild(mainNode);
        mainNode.appendChild(ev);

        var itemsNode = document.createElement('div');
        itemsNode.className = 'autocomplete-source autocomplete-dropdown autocomplete-close';

        //Data Handler
        var data = utility.dataHandler(opt.data);
        var title = utility.stringTrim(String(opt.autoTitle)) || '',
            val = utility.stringTrim(String(opt.autoVal)) || '',
            limt = data.length > opt.visibelLimt ? opt.visibelLimt : data.length;


        for (var i = 0; i < limt; i++) {
            var _title = '',
                _val = '';
            if (title instanceof Function) {
                _title = title(data[i]);
            }
            if (val instanceof Function) {
                _val = val(data[i]);
            }

            if (data[i] instanceof Object && !(data[i] instanceof Array)) {
                if (title) {
                    _title = eval('data[i].' + title);
                } else {
                    console.log('autocomplete: autoTitle not null!');
                }
                if (title) {
                    _val = eval('data[i].' + val);
                } else {
                    console.log('autocomplete: autoVal not null!');
                }

                _val = val ? eval('data[i].' + val) : val;
            }
            if (typeof (data[i]) == 'string'
                || typeof (data[i]) == 'number'
                || typeof (data[i]) == 'boolean') {
                _title = data[i];
                _val = data[i];
            }

            var itemNode = document.createElement('div');
            itemNode.className = 'autocomplete-item';
            itemNode.innerText = _title;
            itemNode.setAttribute('data-autoval', _val);
            itemsNode.appendChild(itemNode);
        }
        mainNode.appendChild(itemsNode);
    }

    // DATA SOURCE
    var dataSource = {

    }

    //SELECTED ITEM
    var autoVal = {

    }

    //setting turnOn turnOff 
    var setAutoList = function (ev, resultCallback) {
        ev.onfocus = function () {
            ev.nextElementSibling.className = ev.nextElementSibling.className.replace('autocomplete-close', '');
            ev.nextElementSibling.className += ' autocomplete-open'
            if (!ev.nextElementSibling.hasClickEvent) {
                utility.registerClickEvent(ev.nextElementSibling, resultCallback);
            }
        }

        ev.onblur = function () {
            this.nextElementSibling.className = this.nextElementSibling.className.replace('autocomplete-open', '');
            this.nextElementSibling.className += ' autocomplete-close'
        }

        ev.onkeydown = function (e) {
            // var keynum
            // var keychar
            // var numcheck
            // if (window.event) // IE
            // {
            //     keynum = e.keyCode
            // }
            // else if (e.which) // Netscape/Firefox/Opera
            // {
            //     keynum = e.which
            // }
            

            // keychar = String.fromCharCode(keynum)
            // numcheck = /\d/
            // return !numcheck.test(keychar)
        }
    }



    //Event Trigger 事件触发器
    /**
     * @param {object} element  dom元素
     * @param {object/string} event 事件
     */
    var trigger = function (element, event) {

    }

    //SETTING
    window.autocomplete = function (ev, opt, resultCallback) {
        // clone defaluts
        if (opt instanceof Object) {
            buildDiv(ev, opt);
            setAutoList(ev, resultCallback);
        } else {
            console.log('autocomplete: default Not NULL!');
        }
    };

})(window)