onmessage = function(e) {
  setTimeout(function(){
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script', workerResult);
  postMessage(workerResult);
  }, 5000)
}
