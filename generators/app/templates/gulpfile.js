const { src, dest, series, watch } = require('gulp')
const plugins = require('gulp-load-plugins')()
const del = require('del')
const browserSync = require('browser-sync').create();
const reload = browserSync.reload

function js(cb) {
    src('src/js/*.js')
        .pipe(plugins.uglify())
        .pipe(dest('./dist/js'))
        .pipe(reload({ stream: true }))
    cb()
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

function html(cb) {
    src('./index.html')
        // .pipe(validator())
        .pipe(dest('./dist'))
        .pipe(reload({ stream: true }))
    cb()
}

function watcher(cb) {
    watch('src/js/*.js', js)
    watch('src/css/*.sass', css)
    watch('*.html', html)
    cb()

}

function clean(cb) {
    del('./dist')
    cb()
}

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
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
exports.default = series([
    clean,
    js,
    html,
    css,
    serve,
    watcher
])