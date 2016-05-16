var paths = {
    src: {
        dir: 'src/assets',
        scssDir: 'src/assets/scss',
        scssAll: 'src/assets/scss/**/*.scss',
        jsDir: 'src/assets/js',
        jsAll: 'src/assets/js/**/*.js',
        plugins: 'src/assets/js/vendor/**/*.js',
        imgDir: 'src/assets/img',
        imgAll: 'src/assets/img/**/*',
        twig: 'src/*.twig',
        twigAll: 'src/**/*.twig'
    },
    dest: {
        dir: 'public',
        css: 'public/assets/css',
        js: 'public/assets/js',
        img: 'public/assets/img',
        templates: 'public'
    }
};

// Include gulp
var gulp = require('gulp');

// Include Plugins
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var twig = require('gulp-twig');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

// Minify Images
gulp.task('imagemin', function(){
    return gulp.src(paths.src.imgAll)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest(paths.dest.img))
        .pipe(notify({message: 'Images minified'}));
});

// Compile SASS
gulp.task('sass', function(){
	return gulp.src(paths.src.scssAll)
		.pipe(sass({
            outputStyle: 'compressed',
        }).on('error', function(err){
            notify().write(err);
            this.emit('end');
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
	.pipe(gulp.dest(paths.dest.css))
        .pipe(notify({message: 'SCSS compiled'}))
        .pipe(browserSync.stream());
});

// Concatenate & Minify Main JS
gulp.task('scripts', function() {
    return gulp.src([
            '!' + paths.src.jsDir + '/*.min.js',
            paths.src.jsDir + '/*.js'
    ])
        .pipe(uglify())
        .on('error', function(err){
            notify().write(err);
            this.emit('end');
        })
        .pipe(rename(function(path){
            path.basename += '.min';
            path.extname = '.js';
        }))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(notify({message: 'Scripts minified'}));
});

// Concatenate & Minify JS Plugins
gulp.task('plugins', function() {
    return gulp.src(paths.src.plugins)
        .pipe(concat('plugins.js'))
        .pipe(uglify())
        .on('error', function(err){
            notify().write(err);
            this.emit('end');
        })
        .pipe(rename('plugins.min.js'))
        .pipe(gulp.dest(paths.dest.js))
        .pipe(notify({message: 'Plugins minified'}));
});

// Compile Twig
gulp.task('twig', function(){
    return gulp.src(paths.src.twig)
        .pipe(twig({
            data: {
                assets: '/assets'
            }
        }))
        .pipe(gulp.dest(paths.dest.templates))
        .pipe(notify({message: 'Twig compiled'}));
});

// BrowserSync
gulp.task('serve', function(){
    browserSync.init({
      baseDir: paths.dest.dir,
      proxy: 'starterkit.dev'
    });

    gulp.watch(paths.dest.templates + '/**/*.html').on('change', reload);
    gulp.watch(paths.dest.js + '/*.js').on('change', reload);
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths.src.imgAll, ['imagemin']);
    gulp.watch(paths.src.plugins, ['plugins']);
    gulp.watch(paths.src.jsAll, ['scripts']);
    gulp.watch(paths.src.scssAll, ['sass']);
    gulp.watch(paths.src.twigAll, ['twig']);
});

// Default Task
gulp.task('default', ['serve', 'imagemin', 'plugins', 'sass', 'scripts', 'twig', 'watch']);
