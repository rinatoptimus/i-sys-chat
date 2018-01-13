const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// соединяемся с mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
  if(err){
    throw err;
  }

  console.log('Соединение с MongoDB прошло успешно...');

  // соединяемся с Socket.io
  client.on('connection', function(socket){
    let chat = db.collection('chats');

    // посылаем статус
    sendStatus = function(s){
      socket.emit('status', s);
    }

    // получаем статусы из mongo
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err){
        throw err;
      }

      // выводим сообщения
      socket.emit('output', res);
    });

    // события инпутов
    socket.on('input', function(data){
      let name = data.name;
      let message = data.message;

      // проверяем "имя" и "сообщение"
      if(name == '' || message == ''){
        sendStatus('Введите имя и сообщение');
      } else {
        // вводим сообщение
        chat.insert({name: name, message: message}, function(){
          client.emit('output', [data]);

          sendStatus({
            message: 'Сообщение отправлено',
            clear: true
          });
        });
      }
    });

  });
});