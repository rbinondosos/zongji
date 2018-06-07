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
  console.log('evt: ',evt);
  var name = evt.constructor.name;
  if(name == 'UpdateRows'){
    var tableName = '';
    for(var i in evt.tableMap){
      if(i == evt.tableId){
        tableName = evt.tableMap[i].tableName;
        break;
      }
    }

    if(monitor_tables.indexOf(tableName) != -1)
    {
      console.log('evt: ',evt);
      console.log('name: ',evt.constructor.name);
      console.log('tableName: ',tableName);
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
