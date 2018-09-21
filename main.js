var interval = document.querySelector('#interval');

interval.addEventListener("change", () => {
  Array.prototype.forEach.call(document.getElementsByClassName("interval"), element => {
    element.textContent = interval.value;
  })
})

var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var resultArea = document.querySelector('.result');

var uploadFolder = document.querySelector('#uploadFolder');
var showDetailButton = document.querySelector('#showDetailButton');
var fileDetailArea = document.querySelector('#fileDetails');

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
    var workingJobs = 0;

    console.log("main.js #3 navigator.serviceWorker.controller: ", navigator.serviceWorker.controller)

    const eventNames = ["statechange", "error", "install", "activate"];
    eventNames.forEach(eventName => {
      navigator.serviceWorker.addEventListener(eventName, e => console.log(`main.js ${eventName} event:`, e))
    });

    const requestCalculation = () => {
      console.log('main.js navigator.serviceWorker: ', navigator.serviceWorker);
      const params = {
        interval: interval.value,
        first: first.value,
        second: second.value
      }
	    navigator.serviceWorker.controller.postMessage({type: "CALCULATE", params}); // Sending message as an array to the worker
	    console.log('main.js Message posted to worker');
      workingJobs++;
    }

    const showCalculation = ({number1, number2, result}) => {
      workingJobs--;
      first.value = number1;
      second.value = number2;
		  resultArea.textContent = result;
    }

	  first.addEventListener("change", requestCalculation)
	  second.addEventListener("change", requestCalculation)


    const requestFileDetail = (e) => {
      e.preventDefault()
      const params = {
        files: document.querySelector("#uploadFolder").files
      }
	    navigator.serviceWorker.controller.postMessage({type: "FILE_DETAIL", params}); // Sending message as an array to the worker
    }
    const showFileDetail = ({lines}) => {
      fileDetailArea.innerHTML = "";
      lines.forEach(line => {
        const div = document.createElement("li");
        div.textContent = line;
        fileDetailArea.appendChild(div);
      })
    }

    showDetailButton.addEventListener('click', requestFileDetail)

	  navigator.serviceWorker.addEventListener("message", e => {
      console.log("main.js message event: ", e)
      const f = dispatch(e.data.type)
      f(e.data.result)
		  console.log('main.js Message received from worker');
	  });

    const dispatch = (type) => {
      switch (type) {
      case "CALCULATE_RESULT":
        return showCalculation;
      case "FILE_DETAIL_RESULT":
        return showFileDetail;
      default:
        throw `Unknown result type: ${type}`
      }
    }

    window.addEventListener('beforeunload', e => {
      console.log("main.js beforeunload event: ", e);
      console.log("main.js beforeunload workingJobs: ", workingJobs)
      if (workingJobs < 1) {
        return;
      }
      var confirmationMessage = "\o/";
      e.returnValue = confirmationMessage;     // Gecko and Trident
      return confirmationMessage;              // Gecko and WebKit
    });

  }).catch(err => console.log('Error: ', err));
}
