var gulp = require('gulp'); // переменная для вызова Gulp

// доп. переменные для вызова плагинов
var rename = require('gulp-rename'); // плагины видны в package.json в devDependencies
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create(); // вызываем и сразу создаем

// тестовая задача или шаблон для новой
function test(done) {
  console.log("Все работает нормально!");
  done();
}

// задача scssToCss
function css_style(done) {

gulp.src('./scss/**/*.scss')                      // указываю с какими файлами работать
    .pipe(sourcemaps.init())                      // инициализируем плагин sourcemaps
    .pipe(sass({                                  // конвертируем scssToCss
    errorLogToConsole: true,                      // если в консоли нет ошибок
    outputStyle: 'compressed'                     // убираем пробелы в CSS (оптимизируем)
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({                           // доп. стили для разных браузеров
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(rename({suffix: '.min'}))                // переименовываем и добавляем суффикс
    .pipe(sourcemaps.write('./'))                  // делаем sourcemaps для удобства читаемости из Google-консоли
    .pipe(gulp.dest('./css/'))                     // путь, куда копируем файл
    .pipe(browserSync.stream());                   // записываем новые изменения

  done();
}

// отображение локального сервера
function sync(done) {
  browserSync.init({
    server: {
      baseDir: "./"                                // отслеживаемая директория
    },
    port: 3000                                     // порт
  });
  done();
}

// обновление страницы в браузере в автоматическом режиме
function browerReload(done) {
  browserSync.reload();
  done();
}

// отслеживание на изменение указанных файлов
function watchFiles() {
  gulp.watch("./scss/**/*", css_style);              // все папки и все файлы в папке scss
  gulp.watch("./**/*.html", browerReload);           // все файлы .html во всем проекте
  gulp.watch("./**/*.php", browerReload);
  gulp.watch("./**/*.js", browerReload);
}

// экспорт наших задач
gulp.task('default', gulp.parallel(watchFiles, sync)); // задача по умолчанию, parallel - параллельно, series - последовательно
gulp.task(test);

// выход из watch-тасков ctrl+C
