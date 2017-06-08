/*
 * created by Kelly Miklas (7 June 2017)
 */

 /*
 // Initialize the default app
firebase.initializeApp(defaultAppConfig);

// Initialize another app with a different config
var otherApp = firebase.initializeApp(otherAppConfig, "other");

console.log(firebase.app().name);  // "[DEFAULT]"
console.log(otherApp.name);        // "other"

// Use the shorthand notation to retrieve the default app's services
var defaultStorage = firebase.storage();
var defaultDatabase = firebase.database();

// Use the otherApp variable to retrieve the other app's services
var otherStorage = otherApp.storage();
var otherDatabase = otherApp.database();
  */

// Init
firebase.initializeApp(defaultAppConfig);
console.log(firebase.app().name); // "DEFAULT"