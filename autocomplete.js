(function (factory) {
    "use strict"
    var autoVal, dataSource;

    /**
     * Q1:可定制显示条数
     * Q2:支持远程数据源
     * Q3:支持手动输入筛选 自动过滤  
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
                    debugger
                    //window.eventList();
                    item.addEventListener('mousedown', function () {
                                    utility.setValue(this, sourceElem, resultCallback);
                                })
                    var ls=item.eventList;
                    // for(var key in item.eventList){
                    //     if(key!='mousedown'){
                    //         item.addEventListener('mousedown', function () {
                    //             utility.setValue(this, sourceElem, resultCallback);
                    //         })
                    //     }
                    //     if(key!='mouseover'){
                    //         item.addEventListener('mouseover', function () {
                    //             utility.addClass(this, 'active');
                    //             utility.setValue(this, sourceElem, resultCallback);
                    //         })
                    //     }
                    //     if(key!='mouseout'){
                    //         item.addEventListener('mouseout', function () {
                    //             utility.removeClass(this, 'active');
                    //         })
                    //     }
                    // }
                    //alert(i);
                }(items[i], i);
            }
            sourceElem.hasClickEvent = true;
        },
        dataHandler: function (opt, autoData, index) {
            var _rData = [];
            autoData = autoData || [];
            if (!opt.visibelLimt) {
                return autoData;
            }

            var _startIndex = (index - 1) * (opt.visibelLimt),
                _endIndex = (index * opt.visibelLimt);
            _endIndex = _endIndex >= autoData.length - 1 ? autoData.length - 1 : _endIndex;
            for (var i = _startIndex; i < _endIndex; i++) {
                _rData.push(autoData[i]);
            }
            return _rData;
        },
        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },
        hasClass: function (elem, className) {
            return elem.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },
        addClass: function (elem, className) {
            if (!utility.hasClass(elem, className)) {
                elem.className = elem.className + ' ' + className;
            }
        },
        removeClass: function (elem, className) {
            if (utility.hasClass(elem, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                elem.className = elem.className.replace(reg, ' ');
            }
        },
        setValue: function (elem, sourceElem, resultCallback) {
            var _rval = elem.getAttribute('data-autoval');
            var _rtitle = elem.innerText;
            sourceElem.previousElementSibling.value = _rtitle;
            sourceElem.previousElementSibling.focus();

            if (resultCallback
                && (resultCallback instanceof Function))
                resultCallback(_rval);

        }
    }

    //BUILD DIV
    /**
     * 
     * @param {elem} ev 当前元素 
     * @param {*} opt 操作属性
     * @param {*} index 当前页
     * @param {*} isFirst 是否第一次加载
     */
    var buildDiv = function (ev, opt, index, isFirst) {
        index = index || 1;
        if (isFirst) {
            var parentElem = ev.parentElement;
            var mainNode = document.createElement('div');
            mainNode.className = 'autocomplete-main';
            mainNode.style.cssText = 'width:auto;display:inline-block;position: relative;';
            parentElem.appendChild(mainNode);
            mainNode.appendChild(ev);

            var itemsNode = document.createElement('div');
            itemsNode.className = 'autocomplete-source autocomplete-dropdown autocomplete-close';
            mainNode.appendChild(itemsNode);
        }

        //Data Handler
        var dpElem=ev.nextElementSibling;
        var data = utility.dataHandler(opt, opt.data, index);
        var title = utility.stringTrim(String(opt.autoTitle)) || '',
            val = utility.stringTrim(String(opt.autoVal)) || '',
            limt = data.length == opt.visibelLimt ? opt.visibelLimt : data.length;

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
            itemNode.setAttribute('data-index', index);
            dpElem.appendChild(itemNode);
        }
        
    }

    // DATA SOURCE
    var dataSource = {

    }

    //SELECTED ITEM
    var autoVal = {

    }

    //setting turnOn turnOff 
    /**
     * 
     * @param {elem} ev 当前元素 
     * @param {object} opt 操作属性
     * @param {function} resultCallback 回调函数 return 选中值 
     */
    var setAutoList = function (ev, opt, resultCallback) {
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
            var keynum
            var keychar
            var numcheck
            if (window.event) // IE
            {
                keynum = e.keyCode
            }
            else if (e.which) // Netscape/Firefox/Opera
            {
                keynum = e.which
            }

            if (keynum == 40) {
                nextP(this, opt, resultCallback);
                /**
                 * 临时调整
                 * @param {*} _self 
                 * @param {*} opt 
                 * @param {*} resultCallback 
                 */
                function nextP(_self, opt, resultCallback) {
                    var activeElem = _self.nextElementSibling.getElementsByClassName('active');
                    var nds = _self.nextElementSibling.getElementsByClassName('autocomplete-item');
                    if (activeElem.length == 0) {
                        utility.addClass(nds[0], 'active');
                        utility.setValue(nds[0], _self.nextElementSibling, resultCallback);
                    } else {
                        for (var i = 0; i < nds.length; i++) {
                            if (utility.hasClass(nds[i], 'active')) {
                                var _index = parseInt(nds[i].getAttribute('data-index'));
                                utility.removeClass(nds[i], 'active');
                                if (i == (nds.length - 1)) {
                                    var _arr = utility.dataHandler(opt, opt.data, (_index + 1));
                                    if (_arr.length > 0) {
                                        //追加元素
                                        buildDiv(_self, opt, (_index + 1), false);
                                        //绑定事件
                                        utility.registerClickEvent(_self.nextElementSibling, resultCallback);
                                        //递归调用
                                        nextP(_self, opt, resultCallback);
                                    } else {
                                        utility.addClass(nds[0], 'active');
                                        utility.setValue(nds[0], _self.nextElementSibling, resultCallback);
                                    }
                                } else {
                                    utility.addClass(nds[i + 1], 'active');
                                    utility.setValue(nds[i + 1], _self.nextElementSibling, resultCallback);
                                }
                                break;
                            }
                        }
                    }
                }


                // var _lastActiveElem = this.nextElementSibling.getElementsByClassName('.active');
                // utility.setValue(_lastActiveElem,this,resultCallback);
                return true;
            }
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
            buildDiv(ev, opt, 1, true);
            setAutoList(ev, opt, resultCallback);
        } else {
            console.log('autocomplete: default Not NULL!');
        }
    };

})(window)