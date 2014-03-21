var address = "";
var port = "";


$(document).ready(function () {
	getAllItems();
});

/*
* wird aufgerufen um die Daten in der Datenbank zu speichern
*/
function saveLocationToDatabase(){
	address = $("#url").val();
	port = $("#port").val();
	
	var db = window.openDatabase("cirs", "0.01a", "CirsDatabase", 200000);
	db.transaction(transactionPutAddress, errorCB);
}

/*
* Speichert die Daten in die SQLite Datenbank
*/
function transactionPutAddress(tx){
	tx.executeSql('DROP TABLE IF EXISTS LOCATION');
	tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION(IndexId INTEGER NOT NULL PRIMARY KEY, address TEXT, port TEXT);');
    tx.executeSql('INSERT INTO LOCATION (address, port) VALUES (?,?)',[address,port]);
}

/*
* wird aufgerufen um die Daten aus der Datenbank zu holen
*/
function getAllItems(){
	var db = window.openDatabase("cirs", "0.01a", "CirsDatabase", 200000);
	db.transaction(query, errorCB);
}

/*
* Holt die Daten aus der SQLite Datenbank
*/
function query(tx){
	tx.executeSql('SELECT * FROM LOCATION', [], querySuccess, errorCB);
}

/*
* wird aufgerufne wenn die Daten erfolgreich geholt wurden
*/
function querySuccess(tx, results) {
    address = results.rows.item(0).address;
    port = results.rows.item(0).port;   
    updateLocation();
}

/*
* wird aufgerufne wenn es Fehler gab
*/
function errorCB(tx, err) {
    alert("Bitte stellen Sie Adresse und Port ein!");
}

/*
* Fügt die Daten in die Felder ein
*/
function updateLocation(){
	$("#url").val(address);
	$("#port").val(port);
}