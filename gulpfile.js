var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var less = require('gulp-less');
var minimist = require('minimist');
var browserSync = require('browser-sync').create();
var http = require('http');
var fs = require('fs');
var ssi = require('browsersync-ssi');
var includer = require('gulp-html-ssi');

//代理
/*var proxyMiddleware = require('http-proxy-middleware');
var proxy = proxyMiddleware('/api', {
  target: '',//端口域名
  changeOrigin: true
});*/

//服务器域名根路径
var BASE_PATH = (__dirname + '/' + 'src').replace(/\\/g, '/');

//开发任务，开启一个本地服务
gulp.task('dev', ['less'], function() {
  browserSync.init({
    server: {
      baseDir: ['src', 'less'],
      directory: true
    },
    middleware: [
      //proxy,
      ssi({
        baseDir: __dirname + '/src',
        ext: '.html',
        version: '1.4.0'
      })
    ],
    port: 3005,
    ui: {
      port: 3002, // UI界面的端口
      weinre: 3003
    },
    files: ['src/**/*.+(html|css|js|jpg|png|gif)', 'less/**/*.css'],
    ghostMode: {
      scroll: true
    }
  });
  gulp.watch('src/**/*.less', ['less']);
});
gulp.task('less', function() {
  gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('less'));
});

//打包生产环境
gulp.task('build', function() {
  //命令：gulp live --version=v1.0.1 必须带版本号，否则不能编译
  var args = require('minimist')(process.argv);
  /*if (!args.urlPrefix) {
    throw new Error("缺少CDN域名和路径！");
  }*/
  //压缩处理JS文件
  if(args.env === 'beta') {
    gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'));
  } else {
    gulp.src('src/**/*.js')
    .pipe(uglify())
    .on('error', function (err) {console.log(err)})
    .pipe(gulp.dest('dist'));
  }

  //复制CSS文件，编译LESS
  gulp.src('src/**/*.css')
    .pipe(gulp.dest('dist'));
  gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist'));

  //复制图片
  gulp.src('src/**/*.+(jpg|png|gif)')
    .pipe(gulp.dest('dist'));

  //复制FONT文件
  gulp.src('src/**/*.+(eot|svg|ttf|woff|woff2|otf)')
    .pipe(gulp.dest('dist'));

  gulp.src('src/**/*.html')
    //.pipe(replace(/src="(.*.js)"/g, callback))
    //.pipe(replace(/href="(.*.css)"/g, callback))
    //.pipe(replace(/src="(.*.[jpg|png|gif])"/g, callback))
    .pipe(includer())
    .pipe(gulp.dest('dist'));

  function callback(match, p1, offset, string) {
    /*if (p1.indexOf('http') === 0 || p1.indexOf('https') === 0 || p1.indexOf('//') === 0) {
      return match;
    }
    if (p1.indexOf('/') === 0) {
      return match.replace(p1, args.urlPrefix + p1);
    } else {
      return match.replace(p1, args.urlPrefix + rToA(this.file.path, p1).replace(BASE_PATH, ''));
    }*/
  }
});

//相对地址转绝对地址
function rToA(currPath, relaPath) {
  currPath = currPath.replace(/\\/g, '/'); // 处理win系统
  var currArr = currPath.split('/');
  var counter = 1 // 几层相对路径
  var matchArr = relaPath.match(/\.\.\//g);
  if (matchArr) {
    counter += matchArr.length;
  }
  currArr = currArr.slice(0, currArr.length - counter);
  return currArr.join('/') + '/' + relaPath.replace('../', '');
}