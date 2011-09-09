var sys = require('sys');
var fs = require('fs');
var util = require('util');

if (process.argv.length != 4) {
  sys.puts('Require the following command line arguments:' +
    ' http_port webm_file');
  sys.puts(' e.g. 9001 /home/foo/file.webm');
  process.exit();
}

var port = process.argv[2];
var file = process.argv[3];

var express = require('express')

var app = express.createServer();

app.get('/', function(req, res){
  sys.puts(util.inspect(req.headers, showHidden=false, depth=0));

  var stat = fs.statSync(file);
  if (!stat.isFile()) return;

  var start = 0;
  var end = 0;
  var range = req.header('Range');
  if (range != null) {
    start = parseInt(range.slice(range.indexOf('bytes=')+6,
      range.indexOf('-')));
    end = parseInt(range.slice(range.indexOf('-')+1,
      range.length));
  }
  if (isNaN(end) || end == 0) end = stat.size-1;

  if (start > end) return;

  sys.puts('Browser requested bytes from ' + start + ' to ' +
    end + ' of file ' + file);

  var date = new Date();

  res.writeHead(206, { // NOTE: a partial http response
    // 'Date':date.toUTCString(),
    'Connection':'close',
    // 'Cache-Control':'private',
    // 'Content-Type':'video/webm',
    // 'Content-Length':end - start,
    'Content-Range':'bytes '+start+'-'+end+'/'+stat.size,
    // 'Accept-Ranges':'bytes',
    // 'Server':'CustomStreamer/0.0.1',
    'Transfer-Encoding':'chunked'
    });

  var stream = fs.createReadStream(file,
    { flags: 'r', start: start, end: end});
  stream.pipe(res);
});

app.listen(port);

process.on('uncaughtException', function(err) {
  sys.puts(err);
});
