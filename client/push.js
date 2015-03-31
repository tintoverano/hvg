Push.addListener ('error', function (err) {
  if (error.type == 'gcm.cordova') {
    alert (err.error);
  }
});

Push.addListener ('alert', function (notification) {
  // Called when message got a message in forground
  alert ("push foreground message: " + notification.message);
});

Push.addListener ('startup', function (notification) {
  // Called when message recieved on startup (cold+warm)
  alert ("push startup message: " + notification.message);
});

Push.addListener ('message', function (notification) {
  // Called on every message
  alert ("push any message: " + notification.message);
});