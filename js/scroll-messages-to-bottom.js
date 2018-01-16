window.onload = function() {
  setTimeout(scrollBottom, 1000);
};

function scrollBottom() {
  var messagesList = document.getElementById("messages");
  messagesList.scrollTop = messagesList.scrollHeight;
}