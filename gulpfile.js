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
var gutil = require('gulp-util');
var reload = browserSync.reload;
var smile = gutil.colors.bgBlue(' ^_^ ');
var autoprefixer = require('gulp-autoprefixer');
var babelify    = require('babelify');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  console.log('ok')
});


var less = require('gulp-less');


//less 编译
gulp.task('less', function () {
  gutil.log(smile + ' -> ' +'less')
  return gulp.src('./src/style/*.less')
    .pipe(plumber())
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true 
    }))
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
  gutil.log(smile + ' -> ' +'script')
	return gulp.src('./src/js/*.js')
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
  gutil.log(smile + ' -> ' +'imagemin')
	return gulp.src('./src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
})


//HTML
gulp.task('html', function() {
  gutil.log(smile + ' -> ' +'html')
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'))
});


//打包JS
gulp.task('bundle', function() { 
gutil.log(smile + ' -> ' +'bundle') 
  return browserify({
    entries: "./src/js/main.js",
    debug: true //debug: true是告知Browserify在运行同时 生成 内联sourcemap 用于调试。
  })
    .transform("babelify", { presets: ["es2015"] })
    .bundle() 
    .pipe(source('bundle.min.js'))//vinyl-source-stream用于将Browserify的bundle()的输出转换为Gulp可用的[vinyl][]（一种虚拟文件格式）流。
    .pipe(buffer())//vinyl-buffer用于将vinyl流转化为buffered vinyl文件（gulp-sourcemaps及大部分Gulp插件都需要这种格式）。
    .pipe(sourcemaps.init({loadMaps: true}))//引入gulp-sourcemaps并设置loadMaps: true是为了读取上一步得到的内联sourcemap，并将其转写为一个单独的sourcemap文件。
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/js'));

});

gulp.task('browserify',['bundle'],function(){
  browserSync.reload();
})

//启动服务
gulp.task('serve', ['less','bundle','imagemin','html'],function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
    });

    gulp.watch('src/img/*',['imagemin']).on('change',reload)
    gulp.watch('src/js/*.js',['browserify'])
    gulp.watch('src/style/*.less',['less']).on('change',reload)
    gulp.watch('src/*.html',['html']).on('change',browserSync.reload)

});