self.addEventListener('message', function(e) {
  setTimeout(function(){
    console.log("message", e);
    console.log('Message received from main script');
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    console.log('Posting message back to main script', workerResult);
    self.clients.matchAll().
      then(clients => clients.forEach(client => client.postMessage(workerResult)));
  }, 5000)
})

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});
