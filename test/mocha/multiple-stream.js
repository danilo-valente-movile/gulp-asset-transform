var at = require('../../index')
    , rev = require('gulp-rev')
    , gutil = require('gulp-util')
    , path = require('path')
    , fs = require('fs')
;

describe('js transformation', function(){

    var indexHtml;

    before(function(){
        var filePath = path.join(__dirname, '../assets/multiple-stream.html');

        indexHtml = new gutil.File({
            path:     filePath,
            base:     path.dirname(filePath),
            contents: fs.readFileSync(filePath)
        });
    })

    it('should support gulp-rev', function(done){

        var stream = at({
            js: {
              tasks: [
                'concat',
                function () { return rev(); }
              ]
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

})
