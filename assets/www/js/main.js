function init() {
    document.addEventListener("deviceready", deviceready, true);
}

var db;

function deviceready() {
    alert("Device Ready");
    db = window.openDatabase("test", "1.0", "test", 1000000);
    alert("Database Open");
    db.transaction(setup, errorHandler, dbReady);
    alert("Database Setup.");
}

function setup(tx) {
    tx.executeSql('create table if not exists log(id INTEGER PRIMARY KEY AUTOINCREMENT, '+
                  'log TEXT, created DATE)');
}

function errorHandler(e) {
    alert(e.message);
}

function dbReady() {

    $("#addButton").on("touchstart", function (e) {
        db.transaction(function (tx) {
            var msg = "Log it...";
            var d = new Date();
            d.setDate(d.getDate() - randRange(1,30));
            tx.executeSql("insert into log(log, created) values (?,?)", [msg, d.getTime()]);
        }, errorHandler, function () { $("#result").html("Added new row"); });
    });
    
    $("#deleteButton").on("touchstart", function(e) {
        db.transaction(function(tx) {
            tx.executeSql("delete from log");
        }, errorHandler, function () { $("#result").html("Delete all rows"); });
    });
    
    $("#testButton").on("touchstart", function(e) {
        db.transaction(function (tx) {
            tx.executeSql("select * from log order by created desc", [], gotlog, errorHandler);
        }, errorHandler, function () {});
    });
}

function gotlog(tx, results) {
    if(results.rows.length == 0 ) {
        $("#result").html("No data");
        return false;
    }
    
    var s = "";
    for (var i=0; i<results.rows.length; i++) {
        var d = new Date();
        d.setTime(results.rows.item(i).created);
        s += d.toDateString() + " " + d.toTimeString() + "<br/>";
    }
    $("#result").html(s);
}

function randRange(lowVal, highVal) {
    return Math.floor(Math.random()*(highVal - lowVal + 1)) + lowVal;
}



    
        
    
    
        
    



