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
  console.log('name: ', name);
  if(name == 'UpdateRows' || name == 'WriteRows'){
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
