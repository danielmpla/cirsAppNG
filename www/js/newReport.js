var jsonObject;

var adress = "";
var port = "";

var pictureSource;
var destinationType;

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
* Erzeugt den Fragebogen
*/
function readyFunction(){

    function simpleTextarea(text, required) {
        if (required) {
            return '<textarea name="' + text + '" rows="6" required></textarea>';
        } else {
            return '<textarea name="' + text + '" rows="6"></textarea>';
        }
    }

    function simpleTextarea(id, text, required) {
        if (required) {
            return '<textarea id="' + id + '" name="' + text + '" rows="6" required></textarea>';
        } else {
            return '<textarea id="' + id + '" name="' + text + '" rows="6"></textarea>';
        }
    }

    var reportingOptions;
    $.getJSON('http://' + adress + ':' + port + '/RisikousRESTful/rest/reportingareas', function(reportingAreaData) {
        $.each(reportingAreaData, function(a, b) {
            $.each(b, function(akey, array) {
                var nameR;
                var shortcutR;
                $.each(array, function(keyR, valueR) {
                    if (keyR == "name") {
                        nameR = valueR;
                    }
                    if (keyR == "shortcut") {
                        shortcutR = valueR;
                    }
                });
                if (reportingOptions == null) {
                    reportingOptions = '<option value="' + shortcutR + '">' + nameR + '</option>';
                } else {
                    reportingOptions = reportingOptions + '<option value="' + shortcutR + '">' + nameR + '</option>';
                }
            });
        });
    });

    $.getJSON('http://' + adress + ':' + port + '/RisikousRESTful/rest/questionnaire', function(data) {
        jsonObject = data;
        var options = {
            allowFutureDates: false
        };

        var dateTime;
        $.each(data, function(key, value) {
            if (key == "contactInformation" || key == "contactInformation ") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.contactInformation.text + '</span><br>' + simpleTextarea(data.contactInformation.text, data.contactInformation.required) + '</div>', $('#report'));
                $('#report').append('<input class="menuButton" type="submit" value="Absenden" onclick="send()">', $('#report'));
            }
            if (key == "immediateMeasure") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.immediateMeasure.text + '</span><br>' + simpleTextarea(data.immediateMeasure.text, data.immediateMeasure.required) + '</div>', $('#report'));
            }
            if (key == "opinionOfReporter") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.opinionOfReporter.text + '</span>' + '<br><span class="text">' + data.opinionOfReporter.organisationalFactors.text + '</span>' + '<br />' + simpleTextarea("organisationalFactors", data.opinionOfReporter.organisationalFactors.text, data.opinionOfReporter.organisationalFactors.required) + '<br><span class="text">' + data.opinionOfReporter.personalFactors.text + '</span>' + '<br />' + simpleTextarea("personalFactors", data.opinionOfReporter.personalFactors.text, data.opinionOfReporter.personalFactors.required) + '<br><span class="text">' + data.opinionOfReporter.additionalNotes.text + '</span><br />' + simpleTextarea("additionalNotes", data.opinionOfReporter.additionalNotes.text, data.opinionOfReporter.additionalNotes.required) + '</div>', $('#report'));
            }
            if (key == "incidentDescription") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.incidentDescription.text + '</span><br>' + simpleTextarea(data.incidentDescription.text, data.incidentDescription.required) + '</div>', $('#report'));
            }
            if (key == "location") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.location.text + '</span><br>' + simpleTextarea(data.location.text, data.location.required) + '</div>', $('#report'));
            }
            if (key == "consequences") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.consequences.text + '</span><br>' + simpleTextarea(data.consequences.text, data.consequences.required) + '</div>', $('#report'));
            }
            if (key == "pointOfTime") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.pointOfTime.text + '</span><br />' + '<input type="datetime" id="datetimeBox" class="textInput" data-clear-btn="false" value="">' + '</div>', $('#report'));
            }
            if (key == "riskEstimation") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.riskEstimation.text + '</span><br /><span class="text">' + data.riskEstimation.detectionRating.text + '</span><br />' + '<input id="lowDetectionRating" class="bad" type="radio" name="detectionRating" value="3"><label class="bad" for="lowDetectionRating">Niedrig</label><input id="normalDetectionRating" class="normal" type="radio" name="detectionRating" value="2" checked><label class="normal" for="normalDetectionRating">Mittel</label><input id="highDetectionRating" class="good" type="radio" name="detectionRating" value="1"><label class="good" for="highDetectionRating">Hoch</label>' + '<br /><span class="text">' + data.riskEstimation.occurrenceRating.text + '</span><br />' + '<input id="highOccurenceRating" class="bad" type="radio" name="occurrenceRating" value="3"><label class="bad" for="highOccurenceRating">Hoch</label><input id="normalOccurenceRating" class="normal" type="radio" name="occurrenceRating" value="2" checked><label class="normal" for="normalOccurenceRating">Mittel</label><input id="lowOccurenceRating" class="good" type="radio" name="occurrenceRating" value="1"><label class="good" for="lowOccurenceRating">Niedrig</label>' + '<br /><span class="text">' + data.riskEstimation.significance.text + '</span><br />' + '<input id="highSignificance" class="bad" type="radio" name="significance" value="3"><label class="bad" for="highSignificance">Hoch</label><input id="normalSignificance" class="normal" type="radio" name="significance" value="2" checked><label class="normal" for="normalSignificance">Mittel</label><input id="lowSignificance" class="good" type="radio" name="significance" value="1"><label class="good" for="lowSignificance">Niedrig</label>' + '</div>', $('#report'));
            }
            if (key == "files") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.files.text + '</span><br />' + '<input id="imageButton" type="button" class="menuButton" onclick="capturePhoto()" value="Bild aufnehmen"><img id="image" class="hidden" style="width: 85%; height: auto" src=""></img>' + '</div>', $('#report'));
            }
            if (key == "reportingArea") {
                $('#report').append('<div id="' + key + '">' + '<span class="text headline">' + data.reportingArea.text + '<br></span><select name="' + data.reportingArea.text + '">' + reportingOptions + '</select>' + '</div>', $('#report'));
            }
        });
    });
}

    // Wird aufgerufen, wenn ein Bild erfolgreich geladen wurde
    function onPhotoDataSuccess(imageData) {
      jsonObject.files.file[0].data = imageData;
      jsonObject.files.file[0].name = "Image.jpeg";
      
      $('#imageButton').addClass("hidden");
      $('#image').removeClass("hidden");

      console.log(JSON.stringify(jsonObject));

      // Zeigt das aufgenommene Bild an
      document.getElementById("image").src = "data:image/jpeg;base64," + imageData;
    }

    // Nimmt ein Bild auf
    function capturePhoto() {
      // Nimmt ein Bild mit der Kamera des Geräts auf und gibt einen base64-encoded String zurück
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }

    // Wird aufgerufen wenn ein Fehler bei der Kamera passiert
    function onFail(message) {
      alert('Failed because: ' + message);
    }

/*
* Validiert die Eingaben anhand der Vorgaben durch den Server
*/
function validate() {
    var validationError = false;

    var message = "";

    if ($("#consequences>textarea").val().length >= jsonObject.consequences.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.consequences.text + " darf höchstens " + jsonObject.consequences.maximumOfCharacters + " Zeichen haben!\n";
    }
    if (jsonObject.consequences.required) {
        if ($("#consequences>textarea").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.consequences.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#contactInformation>textarea").val().length >= jsonObject.contactInformation.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.contactInformation.text + " darf höchstens " + jsonObject.contactInformation.maximumOfCharacters + " Zeichen haben!\n";
    }
    if (jsonObject.contactInformation.required) {
        if ($("#contactInformation>textarea").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.contactInformation.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#immediateMeasure>textarea").val().length >= jsonObject.immediateMeasure.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.immediateMeasure.text + " darf höchstens " + jsonObject.immediateMeasure.maximumOfCharacters + " Zeichen haben!\n";        
    }
    if (jsonObject.immediateMeasure.required) {
        if ($("#immediateMeasure>textarea").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.immediateMeasure.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#incidentDescription>textarea").val().length >= jsonObject.incidentDescription.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.incidentDescription.text + " darf höchstens " + jsonObject.incidentDescription.maximumOfCharacters + " Zeichen haben!\n";        
    }
    if (jsonObject.incidentDescription.required) {
        if ($("#incidentDescription>textarea").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.incidentDescription.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#location>textarea").val().length >= jsonObject.location.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.location.text + " darf höchstens " + jsonObject.location.maximumOfCharacters + " Zeichen haben!\n";        
    }
    if (jsonObject.location.required) {
        if ($("#location>textarea").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.location.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#organisationalFactors").val().length >= jsonObject.opinionOfReporter.organisationalFactors.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.opinionOfReporter.organisationalFactors.text + " darf höchstens " + jsonObject.opinionOfReporter.organisationalFactors.maximumOfCharacters + " Zeichen haben!\n";        
    }
    if (jsonObject.opinionOfReporter.organisationalFactors.required) {
        if ($("#organisationalFactors").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.opinionOfReporter.organisationalFactors.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#personalFactors").val().length >= jsonObject.opinionOfReporter.personalFactors.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.opinionOfReporter.personalFactors.text + " darf höchstens " + jsonObject.opinionOfReporter.personalFactors.maximumOfCharacters + " Zeichen haben!\n";
    }
    if (jsonObject.opinionOfReporter.personalFactors.required) {
        if ($("#personalFactors").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.opinionOfReporter.personalFactors.text + " ist ein Pflichtfeld\n";
        }
    }
    if ($("#additionalNotes").val().length >= jsonObject.opinionOfReporter.additionalNotes.maximumOfCharacters) {
        validationError = true;
        message = message + jsonObject.opinionOfReporter.additionalNotes.text + " darf höchstens " + jsonObject.opinionOfReporter.additionalNotes.maximumOfCharacters + " Zeichen haben!\n";
    }
    if (jsonObject.opinionOfReporter.additionalNotes.required) {
        if ($("#additionalNotes").val().length <= 0) {
            validationError = true;
            message = message + jsonObject.opinionOfReporter.additionalNotes.text + " ist ein Pflichtfeld\n";
        }
    }

    if (validationError) {
        alert(message);
    };

    return !validationError;
}

/*
* sendet den ausgefüllten Fragebogen ab, nachdem er validiert wurde
*/
function send() {
    if (validate()) {
        jsonObject.consequences.consequences = $("#consequences>textarea").val();
        jsonObject.contactInformation.contactInformation = $("#contactInformation>textarea").val();
        jsonObject.immediateMeasure.immediateMeasure = $("#immediateMeasure>textarea").val();
        jsonObject.incidentDescription.incidentDescription = $("#incidentDescription>textarea").val();
        jsonObject.location.location = $("#location>textarea").val();
        jsonObject.opinionOfReporter.organisationalFactors.organisationalFactors = $("#organisationalFactors").val();
        jsonObject.opinionOfReporter.personalFactors.personalFactors = $("#personalFactors").val();
        jsonObject.opinionOfReporter.additionalNotes.additionalNotes = $("#additionalNotes").val();
        if ($("#datetimeBox").val() != "") {
            var date = new Date(Date.parse($("#datetimeBox").val()));

            var year = date.getFullYear();
            var month = parseInt(date.getMonth() + 1).toString();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();

            if(parseInt(hours) + (date.getTimezoneOffset() / 60) >= 0){
               hours =  parseInt(hours + (date.getTimezoneOffset() / 60)).toString();
            }

            if (parseInt(month) < 10) {
                month = "0" + month;
            };
            if (parseInt(day) < 10) {
                day = "0" + day;
            };

            if (parseInt(hours) < 10) {
                hours = "0" + hours;
            };
            if (parseInt(minutes) < 10) {
                minutes = "0" + minutes;
            };

            jsonObject.pointOfTime.date.date = day + "." + month + "." + year;
            jsonObject.pointOfTime.time.time = hours + ":" + minutes;
        };
        jsonObject.reportingArea.reportingArea = $("select[name='" + jsonObject.reportingArea.text + "']").val();
        jsonObject.riskEstimation.detectionRating.detectionRating = $("input:radio[name ='detectionRating']:checked").val();
        jsonObject.riskEstimation.occurrenceRating.occurrenceRating = $("input:radio[name ='occurrenceRating']:checked").val();
        jsonObject.riskEstimation.significance.significance = $("input:radio[name ='significance']:checked").val();

        $.ajax({
            headers: {Accept: "application/json; charset=utf-8", "Content-Type": "application/json; charset=utf-8"},
            type: "POST",
            url: "http://" + adress + ":" + port + "/RisikousRESTful/rest/questionnaire/addQuestionnaire",
            data: JSON.stringify(jsonObject),
            success: function(data, textStatus, jqXHR) {
                $('#report').addClass('hidden');
                $('#reportAnswer').removeClass('hidden');
                $('#reportAnswer').append('<span class="text headline">Erfolgreich abgegeben!</span><br/>');
                $('#reportAnswer').append('<span class="text">Ihr Report mit der Nummer ' + data.number + ' wurde gepeichert!</span>');
            },
            error: function(data, textStatus, jqXHR) {
                alert("Fehler: " + JSON.stringify(data));
            },
            dataType: "json"
        });
    }
}