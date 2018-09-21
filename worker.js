self.addEventListener('message', function(e) {
  setTimeout(function(){
    console.log("worker.js message", e);
    console.log('worker.js Message received from main script');
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    console.log('worker.js Posting message back to main script', workerResult);
    self.clients.matchAll().
      then(clients => {
        clients.forEach(client => {
          console.log("worker.js client: ", client);
          client.postMessage(workerResult);
        })
      });
  }, 5000)
})

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});
