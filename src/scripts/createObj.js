// function Person(name) {
//   this.name = name;
//   console.log('this :>> ', this);
//   return {name}
// }
// Person.prototype.name = 'Alice';
// var person1 = new Person('Bob');
// var person2 = Person('Alice2');

// console.log('person1 :>> ', person1);
// console.log('person2 :>> ', person2);

// 面试笔试题
// 已知Counter的实现如下，请写出执行 `new Counter()` 后控制台的前十条输出，以及
// 执行 `Counter()` 后控制台的前十条输出（被执行的代码分别在非严格模式的独立JS环境中运行）
function Counter() {
  var start = Date.now()
  this.num = 0

  this.timer = setInterval(function() {
    this.num ++
    var gap = Date.now() - start
    console.log('timer1 : ', this.num, gap);
  }, 996)

  JSON.parse(`{"desc":"..."}`)
  // eslint-disable-next-line no-constant-condition
  while(true) {
    if (Date.now() - start == 1024) {
      // console.log('Date.now() :>> ', Date.now());
      break;
    }
  }
  // 解析耗时1024毫秒
  this.timer2 = setTimeout(() => {
    this.num++
    var gap = Date.now() - start
    console.log('timer2 :>> ', this.num, gap);
  }, 0)
}

// var counter = new Counter();
// console.log('counter :>> ', counter);
// new Counter();

// timer1 :  NaN 1024
// VM94:23 timer2 :>>  1 1026
// VM94:8 timer1 :  NaN 1994
// VM94:8 timer1 :  NaN 2990
// VM94:8 timer1 :  NaN 3999
// VM94:8 timer1 :  NaN 4981
// VM94:8 timer1 :  NaN 5977
// VM94:8 timer1 :  NaN 6973
// VM94:8 timer1 :  NaN 7969

Counter();

// timer1 :  1 1025
// VM115:23 timer2 :>>  2 1025
// VM115:8 timer1 :  3 1994
// VM115:8 timer1 :  4 2989
// VM115:8 timer1 :  5 3999
// VM115:8 timer1 :  6 4986
// VM115:8 timer1 :  7 5977
// VM115:8 timer1 :  8 6973
// VM115:8 timer1 :  9 7969
// VM115:8 timer1 :  10 8966