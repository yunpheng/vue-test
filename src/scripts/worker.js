// 二、概念
// Web Worker的作用，就是为JavaScript创造多线程环境，
// 允许主线程创建Worker线程，将一些任务分配给后者运行，
// 在主线程运行的同时，Worker线程在后台运行，两者互不干扰。
// 等到Worker线程完成计算任务，再把结果返回给主线程。
// Web Worker有以下几个使用注意点
// (1) 同源限制
// 分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
// (2) DOM限制
// Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，
// 也无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象。
// (3) 通信限制
// Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
// (4) 脚本限制
// Worker 线程不能执行alert()方法和confirm()方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
// (5) 文件限制
// Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。
// 二、基本用法
// 2.1 主线程
var work = new Worker('work.js');

work.postMessage('Hello World');
work.postMessage({ method: 'echo', args: ['Work'] });

work.onmessage = function(event) {
	console.log('Received message :>> ', event.data);
	doSomething();
};

function doSomething() {
  // 执行任务
	work.postMessage('Work done!');
}

work.terminate();
// 2.2 Worker线程
self.addEventListener('message', function(e) {
  this.self.postMessage('You said: ', e.data)
})

// 写法一
work.addEventListener(
	'message',
	function(e) {
		this.postMessage('You said: ', e.data);
	},
	false
);

// 写法二
addEventListener('message', function(e) {
	postMessage('You said: ', e.data);
});

self.addEventListener(
	'message',
	function(e) {
		var data = e.data;
		switch (data.cmd) {
			case 'start':
				self.postMessage('WORKER STARTED: ', data.msg);
				break;
			case 'stop':
				self.postMessage('WORKER STOPPED: ', data.msg);
				break;
			default:
				self.postMessage('Unknown command: ', data.msg);
		}
	},
	false
);

// 2.3 Worker加载脚本
	importScripts('script1.js');
  importScripts('script1.js', 'script2.js');

  // 2.4 错误处理
  work.onerror(function (e) {
    console.log([
      'ERROR: Line ', e.lineno, ' in ', e.filename, ':', e.message
    ].join());
  })

  // 2.5 关闭Worker
  // 主线程
  Worker.terminate();
  // Worker 线程
  self.close();

  // 三、数据通信
//  主线程
var uInt8Array = new Uint8Array(new ArrayBuffer(10));
for (var i = 0; i < uInt8Array.length, ++i) {
  uInt8Array[i] = i * 2;  // [0, 2, 4, 6, 8, ...]
}
work.postMessage(uInt8Array)
// Worker线程
self.onmessage = function (e) {
  var uInt8Array = e.data
  this.postMessage('Inside worker.js: uInt8Array.toString() = ', uInt8Array.toString())
  this.postMessage('Inside worker.js: uInt8Array.toString() = ', uInt8Array.byteLength);
}

// Transferable Objects 格式
work.postMessage(uInt8Array, [uInt8Array])

// 例子
var ab = new ArrayBuffer(1);
work.postMessage(ab, [ab])

// 四、同页面Web Worker
var blob = new Blob([document.querySelector('#worker').textContent])
var url = window.URL.createObjectURL(blob)
var worker = new Worker(url)

worker.onmessage = function (e) {
  e.data == 'dome message'
}

// 五、实例：Worker线程完成轮询
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()'])
  var url = window.URL.createObjectURL(blob)
  var worker = new Worker(url)
  return worker
}

var pollingWorker = createWorker(function(e) {
  var cache;
  function compare(newVal, oldVal) {
    // ...
  }
  setInterval(function() {
    fetch('/my-api-endpoint').then(function(res) {
      var data = res.json();
      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data)
      }
    }, 1000)
  })
})

pollingWorker.onmessage = function() {
  // render data
}

pollingWorker.postMessage('init')

// 六、实例：Worker新建Worker
var worker = new Worker('worker.js')
worker.onmessage = function (event) {
  document.getElementById('result').textContent = event.data
}

// worker.js

// settings
var num_workers = 10
var items_per_worker = 1000000

// start the workers
var result = 0;
var pending_workers = num_workers;
for (var i = 0; i < num_workers; i +=1) {
  var worker = new Worker('core.js');
  worker.postMessage(i * items_per_worker);
  worker.postMessage((i + 1) * items_per_worker)
  worker.onmessage = storeResult;
}

// handle the results
function storeResult(event) {
  result += event.data;
  pending_workers -= 1;
  if ( pending_workers <=0)
  postMessage(result); // finished!
}

// core.js
var start 
onmessage = getStart
function getStart(event) {
  start = event.data
  onmessage = getEnd
}

var end
function getEnd(event) {
  end = event.data
  onmessage = null
  work()
}

function work() {
  var result = 0;
  for (var i = start; i < end; i++) {
    // perform some complex calculation here
    result +=1;
  }
  postMessage(result)
  close();
}

// 七、API
// 7.1 主线程
// 浏览器原生提供Worker()构造函数，用来供主线程生成 Worker 线程。


// var myWorker = new Worker(jsUrl, options);
// Worker()构造函数，可以接受两个参数。第一个参数是脚本的网址（必须遵守同源政策），
// 该参数是必需的，且只能加载 JS 脚本，否则会报错。第二个参数是配置对象，
// 该对象可选。它的一个作用就是指定 Worker 的名称，用来区分多个 Worker 线程。

// // 主线程
// var myWorker = new Worker('worker.js', { name : 'myWorker' });

// // Worker 线程
// self.name // myWorker
// Worker()构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下。

// Worker.onerror：指定 error 事件的监听函数。
// Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
// Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
// Worker.postMessage()：向 Worker 线程发送消息。
// Worker.terminate()：立即终止 Worker 线程。

// 7.2 Worker线程
// Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象。
// 因此定义在window上面的对象和方法不是全部都可以使用。
// Worker 线程有一些自己的全局属性和方法。

// self.name： Worker 的名字。该属性只读，由构造函数指定。
// self.onmessage：指定message事件的监听函数。
// self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
// self.close()：关闭 Worker 线程。
// self.postMessage()：向产生这个 Worker 线程发送消息。
// self.importScripts()：加载 JS 脚本。