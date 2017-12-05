## setTimeout 
### 定义和用法
* **setTimeout()** 方法用于在指定的毫秒数后调用函数或计算表达式
### 语法
* **setTimeout(code,millisec,...)**
	> **code：**必需，要调用的函数后要执行的 JavaScript 代码串   
	> **millisec：**在执行代码前需等待的毫秒数。  
	> **... ：**支持多个参数  
	> **注意** _**millisec不传**时会使用浏览器默认的时间，不同浏览器时间不同。浏览器自动配置时间，在IE，FireFox中，第一次配可能给个很大的数字，100ms上下，往后会缩小到最小时间间隔，Safari，chrome，opera则多为10ms上下。**也可以传0**。_
### 原理
* **setTimeout**函数是异步代码，但其实setTimeout并不是真正的异步操作。由于JS线程的工作机制：当线程中没有执行任何同步代码的前提下才会执行异步代码，setTimeout是异步代码，所以setTimeout只能等js空闲才会执行。也就是说setTimeout只是在指定时间将任务插入队列等候，并不能保证任务在什么时候执行，所以 setTimeout 并不能保证执行的时间，是否及时执行取决于 JavaScript 线程是拥挤还是空闲。javascript通过这种队列机制，给我们制造一个异步执行的假象。
### 广泛应用场景
* 定时器，轮播图，动画效果，自动滚动等等
### 0秒延迟
* <del>0秒延迟，此回调将会放到一个能立即执行的时段进行触发。javascript代码大体上是自顶向下的，但中间穿插着有关DOM渲染，事件回应等异步代码，他们将组成一个队列，零秒延迟将会实现插队操作</del>。《javascript框架设计》中的答案
* 设置0秒的作用是为了改变事件的执行顺序**(可用来解决事件冲突的问题)**，虽然设置了0秒延迟，但是setTimeout有自己的最小延迟时间，不同浏览器的最小延迟时间不同，具体可见**语法**millisec参数
### 0秒延迟 Code

	//输出结果为： 测试2    测试1
	setTimeout(function(){
                console.log("测试1");
     },0);
	console.log("测试2");

### setTimeout的this指向
* setTime回调函数中的this是指向window，但我们可以利用apply()、call()和bind()来改变this的指向。参考： [http://https://www.cnblogs.com/pssp/p/5215621.html](http://https://www.cnblogs.com/pssp/p/5215621.html)
### setTimeout的this指向 Code
	var obj = {
		name: "张三",
        show:function(){
            console.log(this);
        },
        show1: function () {
            setTimeout(function () {
                console.log(this);
            }, 10);
        }
    }
    obj.show();  //当前obj对象
    obj.show1();  //window 对象

![](https://i.imgur.com/OKFeh8w.png)
### setTimeout传参 Code 
	//setTimeout通常是两个参数，但是它可以由多个参数
	setTimeout(function(a,b,c){
        console.log(a); // 1
        console.log(b); // 2
        console.log(c); // undefined
        console.log(a+b); // 3
    },100,1,2);



### setTimeout和单线程 
* JavaScript引擎是单线程机制，容易出现阻塞。如果一段程序处理时间很长，很容易导致整个页面hold住。可以采取的方式有"简化复杂度"、"复杂逻辑后端处理"、"html5的多线程"。除了这些还可以使用setTimeout的另一种用法，**分片**，将一段复杂的逻辑拆分成处理，分片插入队列(注意插入顺序，这将决定着你程序执行的顺序)。
* 还可以使用setTimeout实现伪多线程概念。 具体可以参考[https://www.cnblogs.com/woodk/articles/5199536.html](https://www.cnblogs.com/woodk/articles/5199536.html "Concurrent.Thread")

### setTimeout回收
> window对象中提供了专门的回收方法 clearTimeout。是否调用分使用场景：如果循环调用了，或者递归调用了，都需要清理，不然就一直调用，那就会占cpu，如果执行的很频繁，cpu使用率会很高。如果不是递归形式的，就是延迟执行作用，可以不clear

	//不清理setTimeout
    var func = function (i) {
        console.log("aaa");
        console.log(i);
    }
    for (var i = 0; i < 10000; i++) {
         setTimeout(func, 100, i);
    }

> 增加清理setTimeout方法

	//清理setTimeout
	var func = function (i) {
        console.log("aaa");
        console.log(i);
    }
    for (var i = 0; i < 10000; i++) {
        var st;
        if (st) {
            clearTimeout(st);
        }
        st = setTimeout(func, 100, i);
    }

### setTimeout 使用建议
* setTimeout不建议在项目使用，主要的原因有以下两点
	* setTimeout会打乱模块的执行周期。 可参考《[软件生命周期](http://tangguangyao.github.io/2015/10/27/%E5%85%B3%E4%BA%8E%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/)》
	* 出现问题时setTimeout难以调试