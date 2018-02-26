## knockout.js 进阶 
### 首先明确
> 1. konockout是一款很优秀的JavaScript库，它可以帮助你仅使用一个清晰整洁的底层数据模型（data model）即可创建一个富文本且具有良好的显示和编辑功能的用户界面。下文统一称**ko**。  
> 2. ko不需要依赖jqery库，一般项目中配合jqery一起使用。  
> 3. ko是MVVM模式，所以当任何绑定了某个属性的地方修改该属性值时，其它地方也会随之变化。  
> 4. 本文主要讲的是一些ko的进阶语法，computed，extend，bindingHandler，fn，常用插件  
> 5. 主要参考[http://knockoutjs.com](http://knockoutjs.com) 
### 计算属性 computed
* **计算属性  Computed Observable**  
	`<div>
		<div>
		    <span>fristName:</span>
		    <input type="text" data-bind="value:fristName" />
		</div>
		<div>
		    <span>lastName:</span>
		    <input type="text" data-bind="value:lastName" />
		</div>
		<div>
		    <span> fullName:</span>
		    <span data-bind="text:fullName"></span>
		</div>
	</div>`

	    //计算 computed
	    var viewModel = {
	        fristName: ko.observable("Hello"),
	        lastName: ko.observable("world")
	    }
	    viewModel.fullName = ko.computed(function () {
	        return this.fristName() + " " + this.lastName();
	    }, viewModel);
	
	    ko.applyBindings(viewModel);
 ![](https://i.imgur.com/c9PfGMM.gif)
	* _fristName和lastName若不是受监控(observable)的字段，ko.computed只会在loading时加载一次。改变值不会再次触发。字段是否受监控，需根据实际业务场景_。
	* _计算栏位是不允许主动赋值的。若要主动赋值，需要使用可写的计算函数。不使用可写计算算数将会报错误_。
	![](https://i.imgur.com/Kys5BBK.png)
* **可写计算属性  Computed Observable**
    `<div>
        <div>
            <span>fristName:</span>
            <input type="text" data-bind="value:fristName" />
        </div>
        <div>
            <span>lastName:</span>
            <input type="text" data-bind="value:lastName" />
        </div>
        <div>
            <span> fullName:</span>
            <input type="text" data-bind="value:fullName" />
        </div>
    </div>`
<pre class="prettyprint lang-javascript">  
    //计算 computed
    var viewModel = {
        fristName: ko.observable("Hello"),
        lastName: ko.observable("world")
    }
    viewModel.fullName = ko.computed({
        read: function () {
            return this.fristName() + " " + this.lastName();
        },
        write: function (value) {
            //根据fullName 填充fristName和lastName
            var arr = value.split(' ');
            this.fristName(arr[0]);
            this.lastName(arr[1]);
            //this.fullName(value); //不允许在write中当前计算栏位赋值，无限循环
        },
        owner: viewModel  //类似apply,call,bind改变this指向
    });
    ko.applyBindings(viewModel);
</pre>
![](https://i.imgur.com/6mMqxDd.gif)

* **计算栏位 依赖属性**
	* dispose()–释放依赖属性，清除所有的依赖订阅。此方法非常有用，当你想停止一个依赖属性以避免其更新或者清除一个内存中的依赖属性而那些存在依赖关系的监控值是不会被清除的。
	* extend(extenders)–用于扩展依赖属性。
	* getDependenciesCount()–返回依赖属性当前依赖关系数量。 
	* getSubscriptionsCount()–返回依赖属性当前订阅数量（无论是其他的依赖属性或手动订阅）。 
	* isActive ()–返回依赖属性在以后是否会被更新，一个依赖属性如果没有依赖关系是无效的。 
	* peek ()–返回当前依赖属性的值而无需创建依赖关系（可以参考peek）。 
	* subscribe( callback [,callbackTarget, event] )–注册一个手动订阅来通知依赖属性的变化。
<pre class="prettyprint lang-javascript">  
	//click
	viewModel.click_message = function () {
	    var message = "";
	    var referNum = viewModel.fullName.getDependenciesCount();
	    message += "依赖数量：" + referNum + "；";  // 2个依赖项 分别为  fristName，lastName。若fristName/lastName中为非ko的字段。则依赖项会减少
	
	    var subscriptNum = viewModel.fullName.getSubscriptionsCount();
	    message += "订阅数量：" + subscriptNum + "；"; //1个订阅 computed
	
	    var isReferMod = viewModel.fullName.isActive();
	    message += "依赖属性是否会被更新：" + isReferMod + "；";  // 若依赖字段均为非ko字段，则为false
	
	    var peekValue = viewModel.fullName.peek();
	    message += "依赖属性的值：" + peekValue + "；";  // 若依赖字段均为非ko字段，则为false
	
	    viewModel.fullName.subscribe(function (value) {
	        alert(value);
	    });  //修改fullName的值，再点击按钮，订阅数量会变成2
	
	    viewModel.message(message);
	}
</pre>  

### 自定义扩展 extend 
* **extenders**主要功能是在值发生变化时，对observable添加附加功能。如截断，只允许数字等操作
* logchange，required这些都可以[官网](http://knockoutjs.com/documentation/extenders.html)上查到，自定义新的扩展**readonly**，在observable状态下，实现无法修改值

### 自定义绑定 bindingHandlers

### 用 fn 添加自定义函数

### 插件
* **mapping**  

 

