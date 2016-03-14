'use strict';

const gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-cssnano'),
  rimraf = require('rimraf'),
  livereload = require('gulp-livereload'),
  babel = require('gulp-babel');

const path = {
  build: {
    html: 'public/',
    js: 'public/js/',
    css: 'public/css/',
    img: 'public/images/',
    fonts: 'public/fonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/app/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    favicon: 'src/favicon.*',
    fonts: 'src/font/**/*.*',
    libFonts: [
      'node_modules/bootstrap/dist/fonts/*.*',
      'node_modules/font-awesome/fonts/*.*'
    ],
    libCss: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/font-awesome/css/font-awesome.min.css'
    ],
    libJs: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/angular2/bundles/angular2-polyfills.min.js',
      'node_modules/rxjs/bundles/Rx.umd.min.js',
      'node_modules/angular2/bundles/angular2-all.umd.min.js'
    ]
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/app/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/font/**/*.*'
  },
  clean: './public'
};

function errorAlert(err) {
  console.log(err.toString());
  this.emit("end");
}

gulp.task('html', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(livereload());
});

gulp.task('js', function () {
  gulp.src(path.src.js)
    .pipe(rigger().on('error', errorAlert))
    .pipe(babel({
      "plugins": [
        "angular2-annotations",
        "transform-decorators-legacy",
        "transform-class-properties",
        "transform-flow-strip-types"
      ],
      "presets": [
        "es2015"
      ]
    }))
    //.pipe(sourcemaps.init().on('error', errorAlert))
    //.pipe(uglify().on('error', errorAlert))
    //.pipe(sourcemaps.write('.').on('error', errorAlert))
    .pipe(gulp.dest(path.build.js))
    .pipe(livereload());
});

gulp.task('style', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init().on('error', errorAlert))
    .pipe(sass({style: 'expanded'}).on('error', errorAlert))
    .pipe(prefixer({
      browsers: ['last 2 version', 'ios 6', 'android 4']
    }).on('error', errorAlert))
    //.pipe(cssmin().on('error', errorAlert))
    .pipe(sourcemaps.write('.').on('error', errorAlert))
    .pipe(gulp.dest(path.build.css))
    .pipe(livereload());
});

gulp.task('image', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(livereload());
});

gulp.task('favicon', function () {
  gulp.src(path.src.favicon)
    .pipe(gulp.dest(path.build.html))
    .pipe(livereload());
});

gulp.task('fonts', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(livereload());
});

gulp.task('css:lib', function () {
  gulp.src(path.src.libCss)
    .pipe(concat('libs.css').on('error', errorAlert))
    .pipe(gulp.dest(path.build.css));
});

gulp.task('js:lib', function () {
  gulp.src(path.src.libJs)
    .pipe(concat('libs.js').on('error', errorAlert))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('fonts:lib', function () {
  gulp.src(path.src.libFonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('lib', [
  'css:lib',
  'js:lib',
  'fonts:lib'
]);

gulp.task('build', [
  'html',
  'js',
  'style',
  'fonts',
  'lib',
  'image',
  'favicon'
]);

gulp.task('watch', function () {
  livereload.listen();
  watch([path.watch.html], function () {
    gulp.start('html');
  });
  watch([path.watch.style], function () {
    gulp.start('style');
  });
  watch([path.watch.js], function () {
    gulp.start('js');
  });
  watch([path.watch.img], function () {
    gulp.start('image');
  });
  watch([path.watch.fonts], function () {
    gulp.start('fonts');
  });
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'watch']);