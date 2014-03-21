var adress = "";
var port = "";

/*
* Initialisiert die Serveradresse und den Port.
*/
$(document).ready(function() {
  window.openDatabase("cirs", "0.01a", "CirsDatabase", 200000).transaction(query, errorCB);
  
  function query(tx){
    tx.executeSql('SELECT * FROM LOCATION', [], querySuccess, errorCB);
  }

  function querySuccess(tx, results) {
      address = results.rows.item(0).address;
      port = results.rows.item(0).port;   
      readyFunction();
  }

  function errorCB(tx, err) {
      alert("Bitte stellen Sie in den Einstellungen Adresse und Port ein!");
  }
});

/*
* holt alle publications und zeigt deren Titel an
*/
function readyFunction(){
  $.getJSON('http://' + address + ':' + port + '/RisikousRESTful/rest/publications', function (data){
        $.each(data, function(key, value){
            if(key == "publication"){
                $.each(value, function(publicationKey, publications){
                    var title;
                    var date;
                    var idOfReport;
                    $.each(publications, function(id, val) {
                       if(id == "title"){
                           title = val;
                       }
                       if(id == "entryDate"){
                           date = val;
                       }
                       if(id == "id"){
                           idOfReport = val;
                       }
                    });
                    $('#reports').append('<a href="../sites/report.html?id=' + idOfReport + '"><button class="menuButton" type="button"><p>' + title + '</p></button></a><br />', $('#reports'));
                });
            }
        });
    });
}