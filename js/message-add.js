(function(){
  var element = function(id){
    return document.getElementById(id);
  }

  var status = element('status');
  var messages = element('messages');
  var textarea = element('textarea');
  var username = element('username');
  var countdown = element('countdown');
  // статус по умолчанию
  var statusDefault = status.textContent;

  var setStatus = function(s) {

    status.textContent = s;

    if(s !== statusDefault){
      var delay = setTimeout(function() {
        setStatus(statusDefault);
      }, 4000);
    }
  }

  // соединение с сокетом
  var socket = io.connect('http://127.0.0.1:4000');

  var username = document.getElementById('username');
  var userAction = document.getElementById('userAction');

  // проверка соединения
  if(socket !== undefined){
    console.log('Соединение установлено');
    socket.on('output', function(data){
      if(data.length){
        for(var x = 0; x < data.length; x++) {
          var message = document.createElement('div');
          message.setAttribute('class', 'chat-message');

          message.textContent = data[x].name + ": " + data[x].message;
          messages.appendChild(message);
          messages.insertBefore(message, messages.lastChild);

          if(x % 2 == 0) {
            message.classList.add('bg-odd');
          }
        }
      }
    });

    // получение статуса с сервера
    socket.on('status', function(data) {
      setStatus((typeof data === 'object') ? data.message : data);

      if(data.clear){
        textarea.value = '';
      }
    });

    // прослушиваем поле textarea
    textarea.addEventListener('keydown', function(event) {
      if(event.which === 13 && event.shiftKey == false) {
        socket.emit('input', {
          name: username.value,
          message: textarea.value
        });
        event.preventDefault();
      }
    });

    var submit = document.getElementById('submit');
    submit.addEventListener('click', function(event) {
      socket.emit('input', {
        name: username.value,
        message: textarea.value
      });
      var maxCharNumber = '140';
      if(countdown.value != maxCharNumber) {
        return;
      } else {
        countdown.value = maxCharNumber;
      }
      event.preventDefault();
    });

    textarea.addEventListener('keypress', function() {
      socket.emit('typing', username.value);
    });

    socket.on('typing', function(data) {
      userAction.innerHTML = 
        '<p>Пользователь' 
        + ' '
        + '<b>'
        + data
        + '</b>'
        + ' печатает сообщение...</p>';
    });

  }

})();