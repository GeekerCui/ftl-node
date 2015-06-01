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

var d = new Date();
console.log(Date.prototype.format);
 

var TemplateRun = require('./TemplateRun');
var config = require('../config');
var assign = require('object-assign');

//ftl目录为配置的base字段，如果未配置则为当前工作目录
var ftlConfig = config.ftl;
var base = ftlConfig.base || process.cwd();
var globalDataModel = ftlConfig.global || {};

exports.render = function render(path, args, callback) {
    var settings = {
        encoding: 'utf-8',
        viewFolder: base
    };
    var index = path.lastIndexOf('\/') === -1 ? 
        path.lastIndexOf('\\') : path.lastIndexOf('\/');
    var fileName = path.substring(index + 1);
    var dataModel;
    if (typeof ftlConfig[fileName] === 'function') {
        dataModel = ftlConfig[fileName](args.req, args.res);
    } else {
        dataModel = ftlConfig[fileName];
    }
    dataModel = assign(globalDataModel, dataModel);
    path = path.replace(base, '');
    TemplateRun.processTemplate(path, dataModel, settings, callback);
}

