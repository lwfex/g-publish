/**
 * Created by laiyq@txtws.com on 2016/11/25.
 */
var replace = require('gulp-replace');
var publish = require('./g-publish');
publish.htmlReplace = replace(/( ")|(: ?")/g, function ($1) {
    if ($1 == ' "') {
        return ' "${contextPath}/static/';
    } else {
        return ': "http://localhost:63343/g-publish/dist/'
    }
});