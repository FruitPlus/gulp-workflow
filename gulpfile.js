var gulp  = require('gulp');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var streamify = require('gulp-streamify')
var source = require('vinyl-source-stream');
var sourcemaps = require("gulp-sourcemaps");
var buffer = require('vinyl-buffer');
var reload = browserSync.reload;


gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  console.log('ok')
});


var less = require('gulp-less');


//less 编译
gulp.task('less', function () {
  return gulp.src('./src/style/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('./dist/css'))
    .pipe(csso())
    .pipe(rename({
    	extname:'.min.css'
    }))
    .pipe(gulp.dest('./dist/css'))

});

//JS合并 压缩混淆
gulp.task('script',function(){
	gulp.src('./src/js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(uglify())
		.pipe(rename({
			extname:'.min.js'
		}))
		.pipe(gulp.dest('./dist/js'))
})

//图片压缩复制
gulp.task('imagemin',function(){
	gulp.src('./src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
})


//HTML
gulp.task('html', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
});


//打包JS
gulp.task('bundle', function() {  
  return browserify({
    entries: "./src/js/main.js",
    debug: true //debug: true是告知Browserify在运行同时 生成 内联sourcemap 用于调试。
  })
    .bundle() 
    .pipe(source('bundle.min.js'))//vinyl-source-stream用于将Browserify的bundle()的输出转换为Gulp可用的[vinyl][]（一种虚拟文件格式）流。
    .pipe(buffer())//vinyl-buffer用于将vinyl流转化为buffered vinyl文件（gulp-sourcemaps及大部分Gulp插件都需要这种格式）。
    .pipe(sourcemaps.init({loadMaps: true}))//引入gulp-sourcemaps并设置loadMaps: true是为了读取上一步得到的内联sourcemap，并将其转写为一个单独的sourcemap文件。
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/js'));
});

//启动服务
gulp.task('serve', ['less','bundle','imagemin','html'],function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
    });

    gulp.watch('src/img/*',['imagemin']).on('change',reload)
    gulp.watch('src/js/*.js',['bundle']).on('change',reload)
    gulp.watch('src/style/*.less',['less']).on('change',reload)
    gulp.watch('src/*.html',['html']).on('change',browserSync.reload)

});