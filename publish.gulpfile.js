/**
 * Created by laiyq@txtws.com on 2016/11/25.
 */
var replace = require('gulp-replace');
var publish = require('./g-publish');
publish.htmlReplace = replace(/( ")|(: ?")/g, function ($0) {
    if ($0 == ' "') {
        return ' "${contextPath}/static/';
    } else {
        return ': "' + publish.argv['url-prefix']
    }
});