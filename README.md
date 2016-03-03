# Copper

Utility library for working with Node Streams.

## BufferStream

```
var toobusy = require('toobusy');
var BufferStream = require('copper').BufferStream;

inputStream
    .pipe(new BufferStream(toobusy, 100))
    .pipe(outputStream)

```

## fanout

```

var copper = require('copper');

inputStream
    .pipe(copper.fanout((src, dest) => {
        var workers = 100;
        while (--workers > -1) {
            startWorker();
        };

        function startWorker() {
            var chunk = src.read();
            processChunk(chunk)
                .then(processed => {
                    if (!dest.write(processed)) {
                        dest.once('drain', () => {
                            dest.write(processed);
                            startWorker();
                        });
                    }
                    else {
                        startWorker();
                    }
                });
        };
    }))
    .pipe(outputStream);

```
