var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

var paths = {
	scripts: ['src/*.js']
};


gulp.task('default', function() {
	return gulp.src(paths.scripts)
		.pipe(concat('all.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});