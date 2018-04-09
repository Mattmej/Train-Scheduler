/*

Game Plan:

1. Create html with Bootstrap
    a. Jumbotron Title
    b. Train schedule table
    c. "Add train" form

2. Create a firebase project and link to it.

3. Set firebase parameters and push local parameters to it.

4. Whenever user enters info in the form, store this info to firebase.

5. Calculate when the next train will arrive based on the first train time, the frequency, and the current time.
    a. First train time = baseline => b
    b. Current time => c
    c. Frequency of trains => f
    d. # of trips => x
    e. Approximate time => d
        i. This will be the next train arrival time.
    f. Equation: b + fx = d ~= c
        i. Note: d > c
        ii. Attempt to get as close to c as possible, just so long as d > c.
        iii. c-b % f > 0

6. Calculate minutes away
    a. See equation for #5
    b. Minutes away = d-c

7. Consider entering a "time entered" section in the table to log when the user made the entry.

*/

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB3V4vIJ966AqRB5TwcXgfAOwnxJ9uRA1E",
    authDomain: "train-scheduler-e8de2.firebaseapp.com",
    databaseURL: "https://train-scheduler-e8de2.firebaseio.com",
    projectId: "train-scheduler-e8de2",
    storageBucket: "train-scheduler-e8de2.appspot.com",
    messagingSenderId: "358054547547"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// function submitForm(e) {
//     e.preventDefault();

// }

function newTrain(trainName, destination, firstTrainTime, frequency) {
    var train = database.ref().push();
    train.set({
        trainName: trainName,
        destination: destination,
        firstTrainTime, firstTrainTime,
        frequency, frequency
    });
}












// When submit button is clicked, anything entered in the form will be stored and displayed
//  in the table

$("#submitBtn").on("click", function(e){
    e.preventDefault();
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();

    newTrain(trainName, destination, firstTrainTime, frequency);

})



