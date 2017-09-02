"use strict";

const gulp = require('gulp')
const libDb = require('./lib/db')


/*** Framework Tasks ***/
gulp.task('db:init', () => libDb.init(false))