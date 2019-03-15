var config = {
    apiKey: "AIzaSyCYnjIc6WFvRaQB-NN2iShAWL4H_KxG8OI",
    authDomain: "trainscheduler-48aca.firebaseapp.com",
    databaseURL: "https://trainscheduler-48aca.firebaseio.com",
    projectId: "trainscheduler-48aca",
    storageBucket: "trainscheduler-48aca.appspot.com",
    messagingSenderId: "949592116310"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    var train = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstTime = $("#trainFirstTime").val().trim();
    var frequency = $("#trainFrequency").val().trim();

    //Math to do the next arrival and minutes away

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "day");
    console.log("The new converted time is: " + firstTimeConverted); 
    var currentTime = moment().format("HH:mm");
    console.log("The current time is: " + currentTime);

    var diffTime = moment().diff(moment(firstTimeConverted, "HH:mm"), "minutes");
    console.log("Difference: " + diffTime+" minutes");

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    var tMinsNextTrain = frequency - tRemainder;
    console.log("Minutes until next train: " + tMinsNextTrain);

    var nextTrain = moment().add(tMinsNextTrain, "m").format("HH:mm");
    // console.log(nextTrain);
    console.log("Arrival time: " + nextTrain);

    var newTrain = {
        name: train,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        timeLeft: tMinsNextTrain,
        arrivalTrain: nextTrain
    };

    database.ref().push(newTrain);

    $(".form-control").val("");
});

database.ref().on("child_added", function (snapshot) {

    var newRow = $("<tr>").append(
        $("<td>").text(snapshot.val().name),
        $("<td>").text(snapshot.val().destination),
        $("<td>").text(snapshot.val().frequency),
        $("<td>").text(snapshot.val().arrivalTrain),
        $("<td>").text(snapshot.val().timeLeft)
    )
    $("#trains-added").append(newRow);
})