var at = require('../../index')
    , less = require('gulp-less')
    , minifyCss = require('gulp-minify-css')
    , uglify = require('gulp-uglify')
    , concat = require('gulp-concat')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
    , chai = require('chai')
    , expect = chai.expect
    , sinon = require('sinon')
    , gutil = require('gulp-util')
;

describe('tag-template transformation', function(){

    var indexHtml, sandbox;

    before(function(){
        var filePath = path.join(__dirname, '../assets/tag-template.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    beforeEach(function(){
        sandbox = sinon.sandbox.create();
    })

    afterEach(function(){
        sandbox.restore();
    })

    describe.skip('using non-reentrant tasks', function(){

        it('should use the default tag templates', function(done){

            var stream = at({
                id1: {
                    tasks:[less(), minifyCss(), 'concat']
                },
                id2: {
                    tasks:[uglify(), 'concat']
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should allow the tag templates to be overridden globally', function(done){

            var stream = at({
                id1: {
                    tasks:[less(), minifyCss(), 'concat']
                },
                id2: {
                    tasks:[uglify(), 'concat']
                }
            }, {
                tagTemplates: {
                    css: function () {
                        return '<css-tag></css-tag>'
                    },
                    js: function () {
                        return '<js-tag></js-tag>'
                    }
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should allow the tag templates to be overridden at the block level', function(done){

            var stream = at({
                id1: {
                    tasks:[less(), minifyCss(), 'concat'],
                    tagTemplate:function(){ return '<css-tag></css-tag>'}
                },
                id2: {
                    tasks:[uglify(), 'concat'],
                    tagTemplate:function(){ return '<js-tag></js-tag>'}
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should warn if tag templates is set on the block config object when using non-reentrant tasks', function(done){

            var spy = sandbox.spy(gutil, 'log');

            var stream = at({
                id1: {
                    tasks:[less(), minifyCss(), 'concat']
                },
                id2: {
                    tasks:[uglify(), 'concat']
                },
                tagTemplates:{
                    css:function(){ return '<css-tag></css-tag>'},
                    js:function(){ return '<js-tag></js-tag>'}
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                sinon.assert.called(spy)
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

    })

    describe('using stream strategy', function(){

        it('should use the default tag templates', function(done){

            var stream = at({
                id1: {
                    stream:function(filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename));
                    }
                },
                id2: {
                    stream:function(filestream, outputFilename){
                        return filestream
                            .pipe(uglify())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    }
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should allow the tag templates to be overridden globally', function(done){

            var stream = at({
                id1: {
                    stream:function(filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename));
                    }
                },
                id2: {
                    stream:function(filestream, outputFilename){
                        return filestream
                            .pipe(uglify())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    }
                }
            }, {
                tagTemplates: {
                    css: function () {
                        return '<css-tag></css-tag>'
                    },
                    js: function () {
                        return '<js-tag></js-tag>'
                    }
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should allow the tag templates to be overridden at the block level ', function(done){

            var stream = at({
                id1: {
                    stream:function(filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename));
                    },
                    tagTemplate:function(){ return '<css-tag></css-tag>'}
                },
                id2: {
                    stream:function(filestream, outputFilename){
                        return filestream
                            .pipe(uglify())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    },
                    tagTemplate:function(){ return '<js-tag></js-tag>'}
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

        it('should warn if tag templates is set on the block config object', function(done){

            var spy = sandbox.spy(gutil, 'log');

            var stream = at({
                id1: {
                    stream:function(filestream, outputFilename) {
                        return filestream
                            .pipe(less())
                            .pipe(minifyCss())
                            .pipe(concat(outputFilename));
                    }
                },
                id2: {
                    stream:function(filestream, outputFilename){
                        return filestream
                            .pipe(uglify())
                            .pipe(concat(outputFilename)); //concat is gulp-concat
                    }
                },
                tagTemplates:{
                    css:function(){ return '<css-tag></css-tag>'},
                    js:function(){ return '<js-tag></js-tag>'}
                }
            });

            stream.on('data', function(newFile) {
                //do assertions?
            });

            stream.on('end', function() {
                sinon.assert.called(spy)
                done();
            });

            stream.write(indexHtml);
            stream.end();

        })

    })

})