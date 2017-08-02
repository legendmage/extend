(function (factory) {
    "use strict"
    var autoVal, dataSource;

    // GLOBAL
    var defalut = {
        class: 'aaaa'
    };

    //BUILD DIV
    var buildDiv = {

    }

    // DATA SOURCE
    var dataSource = {

    }

    //SELECTED ITEM
    var autoVal = {

    }

    //turnOn turnOff 
    var setAutoList = function (ev) {
        ev.onfocus = function () {
            console.log('open')
            ev.nextElementSibling.className = ev.nextElementSibling.className.replace('close', '');
            ev.nextElementSibling.className += ' open'
            if (!ev.nextElementSibling.hasClickEvent) {
                utility.registerClickEvent(ev);
            }
        }

        //    document.body.onfocus=function(){
        //          ev.nextElementSibling.className = ev.nextElementSibling.className.replace('open', '');
        //         ev.nextElementSibling.className += ' close'
        //     }

        document.body.onmousedown = function (e) {
            if (!e) {
                e = window.event;
            }
            var tagName = e.target.tagName;
            var className = e.target.className;
            if (tagName == 'DIV' && className == 'autocomplete-item') {

            } else {
                ev.nextElementSibling.className = ev.nextElementSibling.className.replace('open', '');
                ev.nextElementSibling.className += ' close'
            }
        }

        // ev.onblur = function () {
        //     console.log('open')
        //     // ev.nextElementSibling.className = ev.nextElementSibling.className.replace('open', '');
        //     // ev.nextElementSibling.className += ' close'

        // }

        function dropDown(ev) {
            ev.parentElement.style.display = 'none';
        }
    }

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
        registerClickEvent: function (ev) {
            var items = document.querySelectorAll('div.autocomplete-item');
            for (var i = 0; i < items.length; i++) {
                !function (item, index) {
                    item.addEventListener('click', function () {
                        var val = this.innerText;
                        //alert(val);
                        ev.value = val;
                        ev.nextElementSibling.className = ev.nextElementSibling.className.replace('open', '');
                        ev.nextElementSibling.className += ' close'
                    })
                }(items[i], i);
            }
            soutceElem.hasClickEvent = true; 
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
    window.autocomplete = function (ev) {
        //var parent= dv.parentNode;
        setAutoList(ev);
    };

    return autocomplete;
})(window)