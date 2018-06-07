// Client code
var ZongJi = require('./');

var zongji = new ZongJi({
  host     : 'localhost',
  user     : 'root',
  password : '',
  // debug: true
});

zongji.on('binlog', function(evt) {
  var name = evt.constructor.name;
  if(name == 'UpdateRows'){
    var tableName = '';
    for(var i in evt.tableMap){
      if(i == evt.tableId){
        tableName = evt.tableMap[i].tableName;
        break;
      }
    }
    console.log('evt: ',evt);
    console.log('name: ',evt.constructor.name);
    console.log('tableName: ',tableName);
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
