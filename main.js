var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result = document.querySelector('.result');

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('/worker.js').then(function(registration) {
    console.log('ServiceWorker registration: ', registration);
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err);
  });


  var messages = 0;

	first.onchange = function() {
    console.log('navigator.serviceWorker: ', navigator.serviceWorker);
	  navigator.serviceWorker.controller.postMessage([first.value,second.value]); // Sending message as an array to the worker
    messages++;
	  console.log('Message posted to worker');
	};

	second.onchange = function() {
    navigator.serviceWorker.controller.postMessage([first.value,second.value]);
    messages++;
	  console.log('Message posted to worker');
	};

	navigator.serviceWorker.controller.onmessage = function(e) {
    messages--;
		result.textContent = e.data;
		console.log('Message received from worker');
	};

  window.addEventListener("beforeunload", function (e) {
    if (messages > 0) {
      var confirmationMessage = "\o/";

      e.returnValue = confirmationMessage;     // Gecko and Trident
      return confirmationMessage;              // Gecko and WebKit
    }
  });
}
