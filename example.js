// Client code
var ZongJi = require('./');

var zongji = new ZongJi({
  host     : 'localhost',
  user     : 'root',
  password : '',
  // debug: true
});

zongji.on('binlog', function(evt) {
  console.log('evt: ',evt);
  console.log('evt: ',evt.constructor.name);
  evt.dump();
});

zongji.start({
  includeEvents: ['tablemap','writerows', 'updaterows', 'deleterows']
});

process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  zongji.stop();
  process.exit();
});
