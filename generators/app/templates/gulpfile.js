const { src, dest, lastRun, series, watch } = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const browserSync = require('browser-sync').create();
const reload = browserSync.reload
const imagemin = require('gulp-imagemin');
const svgo = require('gulp-svgo');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const rename = require("gulp-rename");

function js(cb) {
    src('src/js/*.js')
        .pipe(babel())
        // .pipe(browserify({
        //     insertGlobals: true
        // }))
        .pipe(dest('./dist/js'))
        .pipe(plugins.uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('./dist/js'))
        .pipe(reload({ stream: true }))
    cb()
    console.log(process.env.NODE_ENV);
}

function css(cb) {
    src('src/css/*.sass')
        .pipe(plugins.sass({ outputStyle: "compressed" }))
        .pipe(plugins.autoprefixer({
            cascade: false,
            remove: false
        }))
        .pipe(dest('./dist/css'))
        .pipe(reload({ stream: true }))
    cb()
}

function images(cb) {
    src('./src/images/*', { since: lastRun(images) })
        .pipe(imagemin())
        .pipe(dest('./dist/images'))
    cb()
}

function svgs(cb) {
    src('./src/svg/**')
        .pipe(svgo())
        .pipe(dest('./dist/svg'))
    cb()
}

function html(cb) {
    src('index.html')
        .pipe(dest('./dist'))
        .pipe(reload({ stream: true }))
    cb()
}

function watcher(cb) {
    watch('src/js/*.js', js)
    watch('src/css/*.sass', css)
    watch('src/images/**', images)
    watch('src/svg/**', svgs)
    watch('*.html', html)
    cb()

}

async function clean(cb) {
    await del('./dist')
    cb()
}

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    cb()
}
exports.scripts = js
exports.clean = clean
exports.styles = css
exports.watcher = watcher
exports.html = html
exports.serve = serve
exports.images = images
exports.svgs = svgs
exports.default = series([
    clean,
    images,
    svgs,
    js,
    html,
    css,
    watcher,
    serve,
])