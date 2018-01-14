(function(){
  var element = function(id){
    return document.getElementById(id);
  }

  var status = element('status');
  var messages = element('messages');
  var textarea = element('textarea');
  var username = element('username');

  // статус по умолчанию
  var statusDefault = status.textContent;

  var setStatus = function(s){

    status.textContent = s;

    if(s !== statusDefault){
      var delay = setTimeout(function(){
        setStatus(statusDefault);
      }, 4000);
    }
  }

  // соединение с сокетом
  var socket = io.connect('http://127.0.0.1:4000');

  // проверка соединения
  if(socket !== undefined){
    console.log('Соединение установлено');

    socket.on('output', function(data){
      if(data.length){
        for(var x = 0; x < data.length; x++){
          var message = document.createElement('div');
          message.setAttribute('class', 'chat-message');

          message.textContent = data[x].name + ": " + data[x].message;
          messages.appendChild(message);
          // messages.insertBefore(message, messages.firstChild);
          messages.insertBefore(message, messages.lastChild);

          if(x % 2 == 0) {
            message.classList.add('bg-odd');
          }
        }
      }
    });

    // получение статуса с сервера
    socket.on('status', function(data){
      setStatus((typeof data === 'object') ? data.message : data);

      if(data.clear){
        textarea.value = '';
      }
    });

    // прослушиваем поле textarea
    textarea.addEventListener('keydown', function(event){
      if(event.which === 13 && event.shiftKey == false){
        socket.emit('input', {
          name: username.value,
          message: textarea.value
        });
        event.preventDefault();
      }
    });

    var sumbmit = document.getElementById('sumbmit');
    sumbmit.addEventListener('click', function(event){
      socket.emit('input', {
        name: username.value,
        message: textarea.value
      });
      event.preventDefault();


      var currentdate = new Date(); 
      function formatDate(date) {
        var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        var timestamp =  currentdate.getHours() + ':' + currentdate.getMinutes() + ' ' + day + '.' + monthNames[monthIndex] + '.' + year;
        return timestamp;
      }

    });

  }

})();