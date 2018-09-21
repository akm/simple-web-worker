self.addEventListener('message', function(e) {
  console.log("worker.js message", e);
  const f = dispatch(e.data.type);
  f(e.data.type, e.data.params);
})

const dispatch = (type) => {
  switch (type) {
  case "CALCULATE":
    return calculate;
  default:
    throw `Unknown type "${e.data.type}"`
  }
}

const calculate = (type, data) => {
  data.files.forEach = Array.prototype.forEach;
  data.files.forEach(f => console.log(f))

  console.log('worker.js Message received from main script');
  const interval = data.interval;
  const number1 = data.first;
  const number2 = data.second;
  setTimeout(function(){
    var result = number1 * number2;
    console.log('worker.js Posting message back to main script', result);
    self.clients.matchAll().
      then(clients => {
        clients.forEach(client => {
          console.log("worker.js client: ", client);
          client.postMessage({number1, number2, result});
        })
      });
  }, interval * 1000)
}

self.addEventListener('install', function(event) {
  console.log("worker.js install")
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
  console.log("worker.js activate")
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('statechange', function(event) {
  console.log("worker.js statechange")
});

self.addEventListener('error', function(event) {
  console.log("worker.js error")
});
