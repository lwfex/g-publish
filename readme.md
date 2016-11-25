用于自动部署gulp的脚本：使用文件的md5的hash作为版本迭代标识

+ 静态资源添加版本迭代标识
+ 替换样式文件中的资源地址
+ 拷贝js及css的map文件
+ 替换页面的资源地址

### 用法

创建 gulpfile.js
```js
var replace = require('gulp-replace');
var publish = require('g-publish');
publish.htmlReplace = replace(/( ")|(: ?")/g, function ($0) {
    if ($0 == ' "') {
        return ' "${contextPath}/static/';
    } else {
        return ': "' + publish.argv['url-prefix']
    }
});
```
执行gulpfile
```bash
gulp --static-src static --static-dist dist --pages-src pages --pages-dist pagesDist --url-prefix http://cdn.example/myproject/
```

参数说明

+ --static-src 静态资源目录
+ --static-dist 静态资源加版本标识后的目录
+ --pages-src 页面的目录
+ --pages-dist 经过替换后的页面目录
+ --url-prefix 静态资源的前缀