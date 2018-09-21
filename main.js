var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result = document.querySelector('.result');

if ('serviceWorker' in navigator) {

  let controllerChange = new Promise((resolve, reject) => {
    console.log("main.js #2 controllerChange")
    // Assign oncontrollerchange instead of calling addEventListener with controllerchange.
    // controllerchange event doesn't work yet.
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/oncontrollerchange
    navigator.serviceWorker.oncontrollerchange = () => {
      resolve(navigator.serviceWorker.controller);
    };
  });

  navigator.serviceWorker.register('worker.js').then(reg => {
    console.log("main.js #1 reg: ", reg)
    console.log("main.js #1 navigator.serviceWorker.controller: ", navigator.serviceWorker.controller)
    if (navigator.serviceWorker.controller) {
      // 既にコントロール状態 (二回目以降のロード時)
      return navigator.serviceWorker.controller;
    }

    // コントロールされるのを待つ (初回ロード時)
    return controllerChange;
  }).then((controller) => {

    console.log("main.js #3 navigator.serviceWorker.controller: ", navigator.serviceWorker.controller)

    const eventNames = ["statechange", "error", "install", "activate"];
    eventNames.forEach(eventName => {
      navigator.serviceWorker.addEventListener(eventName, e => console.log(`main.js ${eventName} event:`, e))
    });

	  first.addEventListener("change", () => {
      console.log('main.js navigator.serviceWorker: ', navigator.serviceWorker);
	    navigator.serviceWorker.controller.postMessage([first.value,second.value]); // Sending message as an array to the worker
	    console.log('main.js Message posted to worker');
	  });

	  second.addEventListener("change", () => {
      navigator.serviceWorker.controller.postMessage([first.value,second.value]);
	    console.log('main.js Message posted to worker');
	  });

	  navigator.serviceWorker.addEventListener("message", e => {
      console.log("main.js message event: ", e)
      first.value = e.data.number1;
      second.value = e.data.number2;
		  result.textContent = e.data.result;
		  console.log('main.js Message received from worker');
	  });
  }).catch(err => console.log('Error: ', err));
}
