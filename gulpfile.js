var gulp  = require('gulp');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
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


//启动服务
gulp.task('serve', ['less','script','imagemin','html'],function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
    });

    gulp.watch('src/img/*',['imagemin']).on('change',reload)
    gulp.watch('src/js/*.js',['script']).on('change',reload)
    gulp.watch('src/style/*.less',['less']).on('change',reload)
    gulp.watch('src/*.html',['html']).on('change',browserSync.reload)

});