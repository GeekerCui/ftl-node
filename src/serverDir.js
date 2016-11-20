// 解析目录，将目录解析成一个html文件，方便访问
// 解析url模块
var path = require('path');
var fs = require('fs');
var Promise = require('promise');
var log = require('../src/log');
var url = require('url');
var getFileInfo, parseDir;
exports = module.exports = function serveStatic() {
	return function serveStatic(req, res, next) {
		var pathObject = req.pathObject;
		var absPath = pathObject.fullPath;
		if (!pathObject.isDirectory) {
			next();
			return;
		} else {
			return parseDir(res, req, next, absPath);
		}
	};
};
parseDir = function(res, req, next, absPath) {
	// 第一步读取目录下的所有文件的文件名称
	return new Promise(function(resolve, reject) {
		fs.readdir(absPath, function(err, files) {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	})
	// 第三部根据文件名循环遍历得到文件信息
	.then(function(files) {
		return getFileInfo(files, absPath);
		// 第四部渲染页面
	}).then(function(filesInfo) {
		res.render("list", {
			locationUrl: url.parse(req.url),
			data: filesInfo
		});
	}).catch(function(e) { // 出错，直接抛出到页面
		if (typeof(e) === "string") {
			e = new Error(e);
		}
		log.error(e);
		next(e);
	});
};
/*
 *  读取指定列表的所有文件的文件信息
 * @param {Array} files
 * @return {Array} 返回一个带有每个文件描述的数组列表 如[{name: "", size: "", mtime: ""}]
 */
getFileInfo = function(files, basePath) {
	var index = 0;
	var get = function(result) {
		if (!files || !files.length || !files[index]) {
			return new Promise(function(resolve) {
				resolve(result);
			});
		} else {
			return new Promise(function(resolve) {
				var one = files[index];
				var nameTest = /^\.+/;
				index = index + 1;
				fs.lstat(path.resolve(basePath, one), function(err, status) {
					// 当前目录如果读取错误，直接忽略
					if (err) {
						resolve(result);
					} else {
						if (!nameTest.test(one)) {
							result.push({
								name: one,
								size: status.size,
								mtime: status.mtime,
								isDirectory: status.isDirectory()
							});
						}
						resolve(result);
					}
				});
			}).then(get);
		}
	};
	return get([]);
};
