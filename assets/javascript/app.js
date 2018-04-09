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
        firstTrainTime, ft,
        frequency, fr
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

    console.log(snapshot);

    var newEntry = $("<tr class = 'new-entry'></tr>");
    // $(newEntry).append(snapshot.val().trainName);
    // var trainName = $("<td")
})


