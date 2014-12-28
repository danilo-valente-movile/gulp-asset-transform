var through = require('through2')
    , gutil = require('gulp-util')
    , PluginError = gutil.PluginError
    , PLUGIN_NAME = 'gulp-asset-transform'
    , parser = require('./lib/parser')
    , processor = require('./lib/processor')
    , path = require('path')
    ;



module.exports = function(config){

    var stream = through.obj(function(file, enc, cb) {
        var push = this.push.bind(this);

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        var parseBlocks = parser(config);

        var processBlocks = processor(config, push);

        parseBlocks(String(file.contents), file.base, function(err, blocks){
            if(err){
                this.emit('error', new PluginError(PLUGIN_NAME, err));
                return cb();
            }

            processBlocks(blocks, function(err, processedFile){

                var gFile = new gutil.File({
                    path: path.basename(file.path),
                    contents: new Buffer(processedFile)
                });

                // make sure the file goes through the next gulp plugin
                push(gFile);

                // tell the stream engine that we are done with this file
                cb();
            })
        })


    });

    // returning the file stream
    return stream;

}