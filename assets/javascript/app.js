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

var now = moment();

function newTrain(t, d, ft, fr) {

    // Whatever will be in this variable will be "pushed" to a new reference,
    //  instead of replacing an old reference.
    var train = database.ref().push();

    // sets the following parameters.
    // The parameter names is the name on the left of the colon.
    // The parameter value is the name on the right of the colon.
    train.set({
        trainName: t,
        destination: d,
        firstTrainTime: ft,
        frequency: fr
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

    // $("#train-name").empty();
    // $("#destination").empty();
    // $("#first-train").empty();
    // $("#frequency").empty();

    document.getElementById("form").reset();

})

// Get the data from Firebase and add it to the webpage
/* 
Steps:

1. Create a new table row element (<tr></tr>)
2. Insert <td> elements inside.
    a. Train Name
    b. Destination
    c. Frequency
    d. Current Time
    e. Next Arrival
    f. Minutes Away
3. Each of the above elements should either retrieve data from the database or retrieve and manipulate the data.
4. Append the table row element into the table.


*/

database.ref().on("value", function(snapshot){

    $("#table-body").empty();

    // shows the various database entries that are currently stored
    console.log(snapshot.val());
    var trainEntries = snapshot.val();

    // var newEntry = $("<tr class = 'new-entry'></tr>");
    // $(newEntry).append(snapshot.val().trainName);
    // var trainName = $("<td")

    // turns these database entries into an array consisting of these entries' ids
    // var keys = Object.keys(snapshot.val());
    var keys = Object.keys(trainEntries);
    console.log(keys);

    for (i = 0; i < keys.length; i++) {
        var id = keys[i];                                               // multiple info will be stored in one id.

        var newTrainName = trainEntries[id].trainName;                  // newTrainName = snapshot.val()
        console.log("Train Name: " + newTrainName);

        var newDestination = trainEntries[id].destination;              // will be displayed
        console.log("Train Destination: " + newDestination);

        var newFrequency = trainEntries[id].frequency;                  // will be displayed
        console.log("Frequency: " + newFrequency);

        var newFTT = trainEntries[id].firstTrainTime;                   // will NOT be displayed.
        console.log("First Train Time: " + newFTT);

        var nextArrivalMoment = calculateNextArrival(newFrequency, newFTT);
        var nextArrival = calculateNextArrival(newFrequency, newFTT).format("kk:mm");
        console.log("Train's next arrival: " + nextArrival);

        var minutesAway = calculateMinutesAway(now, nextArrivalMoment);
        console.log("Minutes Away: " + minutesAway);

        console.log("----------");

        ///// Will now display the info to the webpage's table /////

        var $newTrain = $("<tr></tr>");

        // var $trainName, $trainDestination, $trainFrequency, $nextArrival, $minutesAway = $("<td></td>");
        var $trainName = $("<td></td>");
        var $trainDestination =  $("<td></td>");
        var $trainFrequency =  $("<td></td>");
        var $nextArrival =  $("<td></td>");
        var $minutesAway =  $("<td></td>");


        $($trainName).html(newTrainName);
        $($trainDestination).html(newDestination);
        $($trainFrequency).html(newFrequency);
        $($nextArrival).html(nextArrival);
        $($minutesAway).html(minutesAway);

        // $($newTrain).append($trainName, $trainDestination, $trainFrequency, $nextArrival, $minutesAway);
        $($newTrain).append($trainName);
        $($newTrain).append($trainDestination);
        $($newTrain).append($trainFrequency);
        $($newTrain).append($nextArrival);
        $($newTrain).append($minutesAway);
        $("#table-body").append($newTrain);


    }
})

function calculateNextArrival(freq, ftt) {
    // ftt: first train time
    // we need to convert ftt to a moment.js variable
    // ftt will be in military time HH:mm format

    var today = moment().format("YYYY-MM-DD");

    // for display, not for manipulation. didn't use these.
    // var formattedFTT = moment(today ftt).format("kk:mm");               // first train time.
    // var currentTime = moment().format("kk:mm");

    var diffTime = today + " " + ftt;

    // var formattedFTT = moment(today ftt);
    var formattedFTT = moment(diffTime);
    var currentTime = moment();

    // while (formattedFTT < currentTime) {
    //     formattedFTT = formattedFTT + freq;
    // }

    while (formattedFTT.isBefore()) {
        formattedFTT.add(freq, "minutes");
    }

    // return formattedFTT.format("kk:mm");
    return formattedFTT;

}

function calculateMinutesAway(timeA, timeB) {
    return timeB.diff(timeA, "minutes");
}
////////////////////// Moment.js Testing //////////////////////

// console.log("Current Time: " + moment());
// console.log("Formatted Current Time: " + moment().format("kk:mm:ss"));

// var testTime = "18:20";

var today = moment().format("YYYY-MM-DD");
console.log(today);

// var parsedTime = moment(testTime, "kk:mm");

// var formatted = moment(testTime).format("kk:mm");
// console.log(parsedTime);

// console.log("formatted time -> " + formatted);

//////////////////////////////////////////////////////////////////


/* 
Game Plan for manipulating the time data

1. Retrieve stored time value from Firebase (first train time)
2. Format the stored time for manipulation with Moment.js
    a. var varName = moment(TODAY_DATE STORED_TIME)
3. Calculate next arrival time for train.
    a. Use a while loop
    b. Add the "frequency" of train arrival to the first train time until fTT > currentTime
4. Calculate minutes away
    a. currentTime - fTT

*/