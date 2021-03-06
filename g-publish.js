/**
 * 自动使用md5值进行版本迭代
 * Created by laiyq@txtws.com on 2016/11/23.
 */
var GPublish = {};
module.exports = GPublish;
var gulp = GPublish.gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var through = require('through2');
var runSequence = require('run-sequence');
//清空文件夹
var clean = require('gulp-clean');
//更改文件版本名
var rev = require('gulp-rev');
//替换路径
var revReplace = require('gulp-rev-replace');
//正则替换
var replace = require('gulp-replace');
//重命名
var rename = require('gulp-rename');

//从参数中获取的配置
var argv = GPublish.argv = require('minimist')(process.argv.slice(2));
function getArgv(name) {
    if (argv[name] === undefined) {
        console.error('please set param [' + name + ']');
        process.exit();
    }
    return argv[name];
}
var staticSrc = getArgv('static-src');
var staticDist = getArgv('static-dist');
var pagesSrc = getArgv('pages-src');
var pagesDist = getArgv('pages-dist');
getArgv('url-prefix');

//资源地址映射
var resMap = null;
function getResMap() {
    if (resMap == null) {
        resMap = JSON.parse(fs.readFileSync('./rev-manifest.json'));
    }
}

//清理目录
gulp.task('clean', function () {
    return gulp.src([staticDist, pagesDist], {read: false})
        .pipe(clean());
});

// 资源地址加上md5
gulp.task('reversion', function () {
    return gulp.src([staticSrc + '/**/*', '!' + staticSrc + '/**/*.map'])
        .pipe(rev())
        .pipe(gulp.dest(staticDist))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

//替换CSS中的资源地址
var _cssPath = '';
gulp.task('replaceCss', function () {
    getResMap();
    return gulp.src(staticDist + '/**/*.css')
        .pipe(through.obj(function (file, enc, cb) {
            _cssPath = file.relative.substr(0, file.relative.indexOf(path.sep));
            this.push(file);
            cb();
        }))
        .pipe(replace(/(url\(['"]?)((?!['"]|http|\/).*?)(['"]?\))/ig, function ($0, $1, $2, $3) {
            //找到对应目录下的文件索引
            var url = path.normalize(_cssPath + '/' + $2);
            //linux风格
            if (path.sep == '\\') {
                url = url.replace('\\', '/');
            }
            //替换成带hash只的资源地址
            return $1 + $2.replace(path.basename($2), path.basename(resMap[url])) + $3;
        }))
        .pipe(gulp.dest(staticDist));
});

//拷贝js及css的map文件
gulp.task('copyMap', function () {
    getResMap();
    return gulp.src(staticSrc + '/**/*.map')
        .pipe(rename(function (p) {
            var dist = resMap[p.dirname + '/' + p.basename];
            if (dist) {
                p.basename = path.basename(dist);
            }
        }))
        .pipe(gulp.dest(staticDist));
});

//替换页面的资源地址
gulp.task('replace', function () {
    //加上cdn前缀
    var manifest = gulp.src("./rev-manifest.json")
        .pipe(GPublish.htmlReplace)
        .pipe(gulp.dest('./'));

    //替换页面
    return gulp.src(pagesSrc + '/**/*.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(pagesDist));
});

gulp.task('default', function () {
    runSequence('reversion', ['replaceCss', 'copyMap'], 'replace');
});