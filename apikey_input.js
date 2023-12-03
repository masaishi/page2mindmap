// Save API Key to Chrome storage
document.getElementById('save').addEventListener('click', function() {
  var apiKey = document.getElementById('apiKey').value;
  chrome.storage.local.set({apiKey: apiKey}, function() {
    console.log('API Key saved');
    window.close();
  });
});

// Load existing API Key if available
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['apiKey'], function(result) {
    if (result.apiKey) {
      document.getElementById('apiKey').value = result.apiKey;
    }
  });
});
