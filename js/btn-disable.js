var textarea = document.getElementById('textarea');

var limitNum = 140;
function limitText(limitField, limitCount, limitNum) {
  if (limitField.value.length > limitNum) {
    limitField.value = limitField.value.substring(0, limitNum);
  } else {
    limitCount.value = limitNum - limitField.value.length;
  }
}

var submit = document.getElementById('submit');
var textarea = document.getElementById('textarea');
function disable() {
	var textarea_value = textarea.value.length;
  if(textarea_value > 0) {
  	submit.disabled = false;
  } 
  if(textarea_value <= 0) {
  	submit.disabled = true;
  }
}
textarea.addEventListener('keyup', disable);