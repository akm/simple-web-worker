var interval = document.querySelector('#interval');

interval.addEventListener("change", () => {
  Array.prototype.forEach.call(document.getElementsByClassName("interval"), element => {
    element.textContent = interval.value;
  })
})

var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result = document.querySelector('.result');

var uploadFolder = document.querySelector('#uploadFolder');

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

    const handler = () => {
      console.log('main.js navigator.serviceWorker: ', navigator.serviceWorker);
      const message = {
        interval: interval.value,
        first: first.value,
        second: second.value,
        files: document.querySelector("#uploadFolder").files
      }
	    navigator.serviceWorker.controller.postMessage(message); // Sending message as an array to the worker
	    console.log('main.js Message posted to worker');
    }

	  first.addEventListener("change", handler)
	  second.addEventListener("change", handler)

	  navigator.serviceWorker.addEventListener("message", e => {
      console.log("main.js message event: ", e)
      first.value = e.data.number1;
      second.value = e.data.number2;
		  result.textContent = e.data.result;
		  console.log('main.js Message received from worker');
	  });
  }).catch(err => console.log('Error: ', err));
}
