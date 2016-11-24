/**
 * 自动使用md5值进行版本迭代
 * Created by laiyq@txtws.com on 2016/11/23.
 */
var gulp = require('gulp');
var runSequence = require('run-sequence');
//清空文件夹
var clean = require('gulp-clean');
//更改文件版本名
var rev = require('gulp-rev');
//替换路径
var revReplace = require('gulp-rev-replace');
var replace = require('gulp-replace');

//清理目录
gulp.task('clean', function () {
    return gulp.src(["dist", "distPages"], {read: false})
        .pipe(clean());
});

// 资源地址加上md5
gulp.task('rev', function () {
    return gulp.src('static/**/**/*')
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'))
});
//替换CSS中的地址，不好替换呐！

//替换页面的资源地址
gulp.task('replace', function () {
    //加上cdn前缀
    var manifest = gulp.src("dist/rev-manifest.json")
        .pipe(replace(/( ")|(: ?")/g, function ($1) {
            if ($1 == ' "') {
                return ' "${contextPath}/static/';
            } else {
                return ': "http://cdn.example.com/xxxx/'
            }
        }))
        .pipe(gulp.dest('dist'));
    //替换页面
    return gulp.src("pages/**/*.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest('distPages'));
});

gulp.task('default', function () {
    runSequence('clean', 'rev', 'replace');
});