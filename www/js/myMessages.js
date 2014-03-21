var keyCommentStore = [];
var parentId = "";

var adress = "";
var port = "";

var json;

/*
* Initialisiert die Serveradresse und den Port.
*/
$(document).ready(function() {
    window.openDatabase("cirs", "0.01a", "CirsDatabase", 200000).transaction(query, errorCB);
    
    function query(tx){
      tx.executeSql('SELECT * FROM LOCATION', [], querySuccess, errorCB);
    }

    function querySuccess(tx, results) {
        adress = results.rows.item(0).address;
        port = results.rows.item(0).port;   
        readyFunction();
    }

    function errorCB(tx, err) {
        alert("Bitte stellen Sie in den Einstellungen Adresse und Port ein!");
    }    
});

/*
* Zeigt den gewünschten Report an
*/
function readyFunction(){
    var id = getParam("id").toString();
    parentId = id.toString();
    $("#headline").text("Mitteilung " + id);
    $.getJSON("http://" + adress + ":" + port + "/RisikousRESTful/rest/publication/id/" + id, function(data) {
        json = data;
        $.each(data, function(id, value) {
            if (id == 'title') {
                $("#headline").text("Mitteilung " + value);
                $('#report').append('<span class="text headline">Titel</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'incidentReport') {
                $('#report').append('<span class="text headline">Ereignisbeschreibung der Veröffentlichung</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'minRPZofReporter') {
                $('#report').append('<span class="text headline">minimale RPZ des Meldenden</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'avgRPZofReporter') {
                $('#report').append('<span class="text headline">durchschnittliche RPZ des Meldenden</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'maxRPZofReporter') {
                $('#report').append('<span class="text headline">maximale RPZ des Meldenden</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'minRPZofQMB') {
                $('#report').append('<span class="text headline">minimale RPZ des QMBs</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'avgRPZofQMB') {
                $('#report').append('<span class="text headline">durchschnittliche RPZ des QMBs</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'maxRPZofQMB') {
                $('#report').append('<span class="text headline">maximale RPZ des QMBs</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'differenceStatement') {
                $('#report').append('<span class="text headline">Begründung der Differenz zwischen den RPZs des Meldenden und denen des QMBs</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'category') {
                $('#report').append('<span class="text headline">Kategorie der Veröffentlichung</span><br/><span class="text">' + value + '</span><br/>');
            }
            if (id == 'action') {
                $('#report').append('<span class="text headline">Maßnahme der Veröffentlichung</span><br/><span class="text">' + value + '</span><br/>');
            }
        });
        $.getJSON("http://" + adress + ":" + port + "/RisikousRESTful/rest/comments/id/" + id, function(commentData) {
            if (commentData.comment.length != 0) {
                $('#report').append('<span class="text headline">Kommentare</span></br>');
                var comments = "";
                comments = printComment(0, commentData.comment, id);
                $('#report').append(comments);
            }
            $('#report').append('<input type="button" class="commentButton" onclick="addComment(\'' + id + '\')" value="Kommentieren"></input>');
        });
    });
}

/*
* holt einen spezifischen Parameter aus der URL
*/
function getParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return(false);
}

/*
* Schreibt die Kommentare rekursiv unter den Report
*/
function printComment(depth, jsonObject, parentId) {
    var output = "";
    $.each(jsonObject, function(idA, all) {
        var id = "";
        var author;
        var timestamp;
        var text;
        var comment;
        var button = "";
        var jsonComment;

        $.each(all, function(key, value) {
            if (key == "author") {
                author = '<span class="text">Autor: ' + value + '</span><br/>';
            }
            if (key == "timeStamp") {
                timestamp = '<span class="text">Zeitpunkt: ' + value + '</span><br/>';
            }
            if (key == "text") {
                if (depth == 0) {
                    text = '<span class="text">Kommentar:<br/>' + value + '</span><br/>';
                } else {
                    text = '<span class="text">Antwort:<br/>' + value + '</span><br/>';
                }
            }
            if (key == "id") {
                id = value;
            }
            if (key == "comment") {
                jsonComment = value;
            }
        });
        keyCommentStore.push({"id": id, "comment": all});
        if (depth + 1 < 3 && jsonComment instanceof Object) {
            comment = '<span class="text headline">Antworten<br/></span>' + printComment(depth + 1, jsonComment, id);
        }
        if (depth != 1 && id != null) {
            button = '<input type="button" class="answerButton" onclick="addComment(' + id + ')" value="Antworten"></input><br/>';
        }
        if (comment != null) {
            output += author + timestamp + text + button + comment;
        } else {
            output += author + timestamp + text + button;
        }
    });
    return output;
}

/*
* Zeigt den Dialog für das hinzufügen eines Kommentars an
*/
function addComment(ownId) {
    var jsonComment;

    $.each(keyCommentStore, function(arrKey, jsonObject) {
        if (jsonObject.id == ownId.toString()) {
            jsonComment = jsonObject.comment;
        }
    });

    $('#report').addClass("hidden");
    $('#comment').removeClass("hidden");

    //zu kommentierendes Kommentar anzeigen
    if (ownId != parentId) {
        $('#comment').append('<span class="text">Autor: ' + jsonComment.author + '</span><br/>');
        $('#comment').append('<span class="text">Zeitpunkt: ' + jsonComment.timeStamp + '</span><br/>');
        $('#comment').append('<span class="text">Kommentar:<br/>' + jsonComment.text + '</span><br/><br/>');
        //Kommentar Felder

        $('#comment').append('<span class="text">Autor:</span><br/>');
        $('#comment').append('<input type="text" name="name"><br/>');
        $('#comment').append('<span class="text">Kommentar:</span><br/>');
        $('#comment').append('<textarea id="commentText" rows="6"></textarea><br/>');

        $('#comment').append('<input class="menuButton" type="submit" value="Absenden" onclick="sendComment(' + ownId + ')">');
    }else{
        //Kommentar Felder

        $('#comment').append('<span class="text">Autor:</span><br/>');
        $('#comment').append('<input type="text" name="name"><br/>');
        $('#comment').append('<span class="text">Kommentar:</span><br/>');
        $('#comment').append('<textarea id="commentText" rows="6"></textarea><br/>');

        $('#comment').append('<input class="menuButton" type="submit" value="Absenden" onclick="sendComment()">');
    }
}

/*
* sendet das erzeugte Kommentar
*/
function sendComment(commentParentId) {
    var answer = true;


    if (commentParentId == null) {
        answer = false;
        commentParentId = parentId;
    }

    var author = "";
    author = $("input:text[name ='name']").val();

    var text = "";
    text = $("#commentText").val();

    if (answer){
        $.ajax({
        headers: {Accept: "application/json; charset=utf-8", "Content-Type": "application/json; charset=utf-8"},
        type: "POST",
        url: "http://" + adress + ":" + port + "/RisikousRESTful/rest/comment/addAnswer",
        data: JSON.stringify({"id": commentParentId.toString(), "author": author, "text": text}),
        statusCode: {
            201: function(data, textStatus, jqXHR) {
            commentSuccessPage();
            },
            404: function(data, textStatus, jqXHR) {
                alert("Fehler" + JSON.stringify(data));
            }
        },
                dataType: "json"
    });
    }else{
        $.ajax({
        headers: {Accept: "application/json; charset=utf-8", "Content-Type": "application/json; charset=utf-8"},
        type: "POST",
        url: "http://" + adress + ":" + port + "/RisikousRESTful/rest/publication/addComment",
        data: JSON.stringify({"id": parentId.toString(), "author": author, "text": text}),
        statusCode: {
            201: function(data, textStatus, jqXHR) {
            commentSuccessPage();
            },
            404: function(data, textStatus, jqXHR) {
                alert("Fehler" + JSON.stringify(data));
            }
        },
                dataType: "json"
    });
    }
}

/*
* Erzeugt einen Success-Bereich wenn das senden geklappt hat
*/
function commentSuccessPage() {
    $("#comment").html('<span class="text">Ihr Kommentar wurde erfolgreich gesendet!</span><br/>');
    $("#comment").append('<input type="button" class="menuButton" value="Zurück zur Meldung" onclick="window.location.reload()">');
}