var Promise = require('bluebird');
var fs = require("fs");
var path = require('path');

// new Promise(function(resolve, reject) {
// 	setTimeout(function() {
// 		resolve('哈哈哈哈', "啦啦啦啦啦啦啦");
// 	}, 300)
// }).then(function(a, b) {
//    console.log(a, b);
// })

var mycmd = require('../src/parseCommand');

console.log(mycmd);
