/**
 * gulp build - builds prod assets
 * gulp watch - builds dev assets and watches files
 * gulp server - builds dev assets, watches files and reloads page through proxy
**/
const { watch, src, dest, series, parallel } = require('gulp');
const  del          = require('del');
const  sass         = require('gulp-sass');
const  uglify       = require('gulp-uglify-es').default;
const  jsImport     = require('gulp-js-import');
const  concat       = require('gulp-concat');
const  browserSync  = require('browser-sync').create();
const  rename       = require('gulp-rename');
const  autoprefixer = require('gulp-autoprefixer');
const  image        = require('gulp-image');
const  svgmin       = require('gulp-svgmin');
const  svgstore     = require('gulp-svgstore');
const  rsp          = require('remove-svg-properties').stream;

const config = {
    app: {
        js:     'src/js/**/*.js',
        scss:   'src/sass/**/*.scss',
        fonts:  './src/font/**/*.{eot,svg,ttf,woff,woff2,otf}',
        images: './src/img/**/*.{png,jpg,gif,svg,ico,jpeg}',
        svg:    './src/svg/**/*.svg',
        sprite: './src/sprite/**/*.svg'
    },
    dist: {
        base:   './dist',
        fonts:  './dist/font',
        images: './dist/img',
        scss:   './dist/css',
        js:     './dist/js',
        svg:    './dist/svg',
    }
}

function jsTask(done){
    src('./src/js/app.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(dest(config.dist.js))
    done();
}

function cssTask(done) {
    src(config.app.scss)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('> 0.5%', 'last 7 versions', 'Firefox ESR', 'not dead', 'not ie < 10'))
        .pipe(rename('app.css'))
        .pipe(dest(config.dist.scss))
    done();
}

function fontTask(done) {
    src(config.app.fonts)
        .pipe(dest(config.dist.fonts))
    done();
}

function imagesTask(done) {
    src(config.app.images)
        .pipe(image())
        .pipe(dest(config.dist.images))
    done();
}

function svgTask(done) {
    src(config.app.svg)
        .pipe(image())
        .pipe(dest(config.dist.svg))
    done();
}

function svgMin(done) {
	  src(config.app.sprite)
    .pipe(svgmin({
        plugins: [{
            removeDesc: true
        }]
    }))
    .pipe(rsp.remove({
        properties: [rsp.PROPS_FILL]
    }))
	  .pipe(svgstore())
	  .pipe(rename({ basename: 'icon' }))
    .pipe(dest(config.dist.svg));
    done();
}


function watchFiles() {
    watch(config.app.js, series(jsTask, reload));
    watch(config.app.scss, series(cssTask, reload));
    watch(config.app.fonts, series(fontTask, reload));
    watch(config.app.images, series(imagesTask, reload));
    watch(config.app.svg, series(svgTask, reload));
}

function reload (done) {
    browserSync.reload();
    done();
}

function serve(done) {
    browserSync.init({
        server: {
            baseDir: '.'
        }
    });
    done();
}

function cleanUp() {
    return del([config.dist.base]);
}

function cleanUpJsCss() {
    del([config.dist.scss]);
    return del([config.dist.js]);
}

function watchTask(){
    watch('*.html', reload);
    watch([config.app.scss, config.app.js], series(cssTask, jsTask, reload));
}

exports.server = parallel( watchFiles, serve, watchTask);
exports.watch = series(watchFiles);
exports.build = series(cleanUp, parallel(jsTask, cssTask, fontTask, imagesTask, svgTask, svgMin ));
exports.build_noimg = series(cleanUpJsCss, parallel(jsTask, cssTask ));