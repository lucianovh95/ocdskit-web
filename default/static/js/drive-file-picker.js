$(document).ready(function(){
  var developerKey = 'AIzaSyAkl--pUpfgzBemq3Q9tU2iWqxjjPCMHs8';

  // The Client ID obtained from the Google API Console. Replace with your own Client ID.
  var clientId = "671350890404-p5pjamuog0c174daqmgkbjqkknkvgqp3.apps.googleusercontent.com"

  // Replace with your own project number from console.developers.google.com.
  // See "Project number" under "IAM & Admin" > "Settings"
  var appId = "671350890404";

  // Scope to use to access user's Drive items.
  var scope = ['https://www.googleapis.com/auth/drive'];

  var pickerApiLoaded = false;
  var oauthToken;

  // Use the Google API Loader script to load the google.picker script.
  $("#drive").click(function loadPicker() {
    gapi.load('auth', {'callback': onAuthApiLoad});
    if (!pickerApiLoaded){
      gapi.load('picker', {'callback': onPickerApiLoad});
    }
  });

  function onAuthApiLoad() {
    window.gapi.auth.authorize(
        {
          'client_id': clientId,
          'scope': scope,
          'immediate': false
        },
        handleAuthResult);
  }

  function onPickerApiLoad() {
    pickerApiLoaded = true;
    createPicker();
  }

  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      createPicker();
    }
  }

  // Create and render a Picker object for searching images.
  function createPicker() {
    if (pickerApiLoaded && oauthToken) {
      var view = new google.picker.DocsView()
        .setIncludeFolders(true) 
        .setMimeTypes('application/json');
      var picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId(appId)
          .setOAuthToken(oauthToken)
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setDeveloperKey(developerKey)
          .setCallback(pickerCallback)
          .build();
       picker.setVisible(true);
    }
  }

  // A simple callback implementation.
  function pickerCallback(data) {
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      var doc = data[google.picker.Response.DOCUMENTS][0];
      var url = doc[google.picker.Document.URL];
      var name = doc[google.picker.Document.NAME];
      var id = doc[google.picker.Document.ID];
    }
    var message = 'You picked: ' + name;
    document.getElementById('result').innerHTML = message;
  }
});