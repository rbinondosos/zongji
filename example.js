const exec = require('child_process').exec;

// Client code
var ZongJi = require('./');

var zongji = new ZongJi({
  host     : 'localhost',
  user     : 'root',
  password : '',
  // debug: true
});

var monitor_tables = [
  'review_detail'
];

zongji.on('binlog', function(evt) {
  
  var name = evt.constructor.name;
  
  if(name == 'UpdateRows' || name == 'WriteRows' || name == 'DeleteRows'){
    var tableName = '';
    for(var i in evt.tableMap){
      if(i == evt.tableId){
        tableName = evt.tableMap[i].tableName;
        break;
      }
    }

    console.log('tableName: ',tableName);
    var a = monitor_tables.filter(e => e == tableName);
    if(a.length)
    {

      var yourscript = exec('php /var/www/html/laravel/artisan sync:dispatcher '+tableName+ ' ' + name + ' \'' + JSON.stringify(evt.rows)+'\'',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
      console.log('name: ', name);
      console.log('inside: ',evt);
    }
  }
  
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
