// ES3实现bind方法

Function.prototype.myBind = function(o) {
	// 闭包无法获取this
	var self = this;
	var boundArgs = arguments;
	return function() {
		var args = [];
		for (var i = 1; i < boundArgs.length; i++) {
			args.push(boundArgs[i]);
		}
		for (var j = 0; j < arguments.length; j++) {
			args.push(arguments[j]);
		}
		self.apply(o, args);
	};
};

// // ES5实现继承
// // 1. call，只能继承字段
// function Parent1() {
// 	this.name = 'parent1';
// }

// function Child1() {
// 	Parent1.call(this);
// 	this.type = 'Child1';
// }

// console.log('new Child1() :>> ', new Child1());

// // 2. prototype
// function Parent2() {
// 	this.name = 'parent2';
// 	this.play = [1, 2, 3];
// }

// function Child2() {
// 	this.type = 'Child2';
// }

// Child2.prototype = new Parent2();
// console.log('new Child2() :>> ', new Child2());
// // 测试
// var s1 = new Child2();
// var s2 = new Child2();
// s1.play.push(4);
// console.log(s1.play, s2.play);

// // 3. call prototype
// function Parent3() {
// 	this.name = 'parent3';
// 	this.play = [1, 2, 3];
// }

// function Child3() {
// 	Parent3.call(this);
// 	this.type = 'Child3';
// }

// Child3.prototype = new Parent3();
// console.log('new Child3() :>> ', new Child3());
// // 测试
// var s3 = new Child3();
// var s4 = new Child3();
// s3.play.push(4);
// console.log(s3.play, s4.play);

// 4.
function Parent4() {
	this.name = 'parent4';
	this.play = [1, 2, 3];
}

function Child4() {
	Parent4.call(this);
	this.type = 'child4';
}

Child4.prototype = Parent4.prototype;
var s3 = new Child4();
console.log(s3);

// 5.
function Parent5() {
  this.name = 'parent5';
  this.play = [1, 2, 3]
}

function Child5() {
  Parent5.call(this)
  this.type = 'Child5'
}

Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5

var a = new Child5();
console.log('a :', a)

