function markType() {
    alert("made it");
}


function confirmFileSubmit(){
    var input  = document.getElementById('fileToUpload'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple
    var reader = new FileReader();

    reader.onload = function(e) {

        var text = reader.result;                 // the entire file

        var firstLine = text.split('\n').shift(); // first line
        //var columns = firstLine.split("\t");
        var countTabs = (firstLine.match(/\t/g) || []).length;
        var countCommas = (firstLine.match(/,/g) || []).length;


        console.log(countTabs);
        console.log(countCommas);

        if(countTabs)
        var columns = firstLine.split(",");

        var previewTableDiv = document.getElementById('previewTableDiv'); // get the input



        var tbl = document.createElement('table');
            tbl.className = "table table-striped";
            //tbl.style.width = '100%';

            var thead = document.createElement('thead');

            var tr = document.createElement('tr');

            var td = document.createElement('td');
            td.style.width = "150"
            td.appendChild(document.createTextNode("Column Name"))
            tr.appendChild(td)

            var td = document.createElement('td');
            td.style.width = "150"
            td.appendChild(document.createTextNode("Role"))
            tr.appendChild(td)

            thead.appendChild(tr);

            tbl.appendChild(thead);

            var tbdy = document.createElement('tbody');

            for (var i = 0; i < columns.length; i++) {
                var tr = document.createElement('tr');
                for (var j = 0; j <= 1; j++) {
                    var td = document.createElement('td');
                    if(j == 0) {
                        td.style.width = "150"
                        td.appendChild(document.createTextNode(columns[i]))
                    } else {
                        //td.appendChild(document.createTextNode("checkbox"))
                        td.innerHTML = "<select id=\"role" + i + "\"  >\n" +
                            "  <option>--Select value type--</option>\n" +
                            "  <option tag='" + columns[i] + "'>Source Node</option>\n" +
                            "  <option tag='" + columns[i] + "'>Target Node</option>\n" +
                            "  <option tag='" + columns[i] + "'>Edge Interaction</option>\n" +
                            "</select>";
                    }

                    tr.appendChild(td)
                }
                tbdy.appendChild(tr);
            }
            tbl.appendChild(tbdy);
            previewTableDiv.appendChild(tbl)
        console.log(firstLine);                   // use the console for debugging
    }

    reader.readAsText(file, 'UTF-8');             // or whatever encoding you're using
                                                  // UTF-8 is default, so this argument
}

function buildPreview(){
    var input  = document.getElementById('fileToUpload'); // get the input
    var edgeWell = document.getElementById('edgeWell'); // get the input
    edgeWell.className = "yesDisplay";
    var edgeSelect = document.getElementById('edgeSelect'); // get the input
    edgeSelect.className = "noDisplay";

    var file   = input.files[0];                  // assuming single file, no multiple
    var reader = new FileReader();




    reader.onload = function(e) {

        var text = reader.result;                 // the entire file
        var allLines = text.split('\n')
        var firstLine = allLines.shift(); // first line
        var secondLine = allLines.shift(); // first line
        var thirdLine = allLines.shift(); // first line

        console.log(secondLine);
        console.log(thirdLine);

        //var columns = firstLine.split("\t");
        var countTabs = (firstLine.match(/\t/g) || []).length;
        var countCommas = (firstLine.match(/,/g) || []).length;


        console.log(countTabs);
        console.log(countCommas);

        var columns = null;
        var secondLineFields = null;
        var thirdLineFields = null;
        if(countCommas > countTabs) {
            columns = firstLine.split(",");
            secondLineFields = secondLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            thirdLineFields = thirdLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        } else {
            columns = firstLine.split("\t");
            secondLineFields = secondLine.split("\t");
            thirdLineFields = thirdLine.split("\t");
        }

        var previewTableDiv = document.getElementById('previewTableDiv'); // get the input



        var tbl = document.createElement('table');
            tbl.className = "table table-bordered table-condensed";
            //tbl.style.width = '100%';

            //===============
            // TABLE HEADER
            //===============
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            tr.className = "info";

            var thBlank = document.createElement('th');
            tr.appendChild(thBlank)

            for (var i=0; i<columns.length; i++) {
                var th = document.createElement('th');
                th.className = "text-center";
                th.innerHTML = "<span style='font-weight: bold;'>" + columns[i] + "</span>";
                tr.appendChild(th)
            }

            thead.appendChild(tr);

            tbl.appendChild(thead);

            var tbdy = document.createElement('tbody');

            //=======================
            // SOURCE RADIO BUTTONS
            //=======================
            tbdy.appendChild(createRadioRow("Source", "sourceType", columns))

            //=======================
            // TARGET RADIO BUTTONS
            //=======================
            tbdy.appendChild(createRadioRow("Target", "targetType", columns))

            //============================
            // INTERACTION RADIO BUTTONS
            //============================
            tbdy.appendChild(createRadioRow("Interaction", "interactionType", columns))

            //====================
            // FIRST LINE PREVIEW
            //====================
            tbdy.appendChild(createPreviewRow(secondLineFields));

            //=====================
            // SECOND LINE PREVIEW
            //=====================
            tbdy.appendChild(createPreviewRow(thirdLineFields));


            tbl.appendChild(tbdy);
            previewTableDiv.appendChild(tbl)
    }

    reader.readAsText(file, 'UTF-8');             // or whatever encoding you're using
                                                  // UTF-8 is default, so this argument
}

function createRadioRow(title, type, fields) {
    var tr = document.createElement('tr');
    tr.className = "success";
    var tdTitle = document.createElement('td');
    tdTitle.innerHTML = "<div style='width: 120px;'><i class='fa fa-link' aria-hidden='true'></i> " + title + " <i class='fa fa-long-arrow-right' aria-hidden='true'></i></div>";
    tr.appendChild(tdTitle)

    for (var i=0; i<fields.length; i++) {
        var td = document.createElement('td');
        td.className = "text-center";
        td.id = "td" + type +  i.toString();
        td.innerHTML = "<input type='radio' class='greenButton' onclick='setRadioBackground(\"" + type + i.toString()
            + "\", \"" + type + "\", " + fields.length + ")' id='" + type + i.toString() + "' name='" + type + "' value='" + fields[i] +"' />";
        tr.appendChild(td)
    }

    return tr;
}

function setRadioBackground(type, group, fieldLength) {
    var radioTD = document.getElementById("td" + type); // get the input
    for (var i=0; i<fieldLength; i++) {
        var td = document.getElementById("td" + group + i.toString());
        td.style = "";
    }

    radioTD.style = "background-color: #4DAE4A;";
}

function createPreviewRow(fields) {
    console.log(fields);
    var tr = document.createElement('tr');
    tr.className = "warning";
    var tdBlank = document.createElement('td');
    tr.appendChild(tdBlank)

    for (var i=0; i<fields.length; i++) {
        var trimmedString = fields[i].length > 20 ? fields[i].substring(0, 20) + "..." : fields[i];

        var td = document.createElement('td');
        td.className = "text-center";
        td.innerHTML = trimmedString;
        tr.appendChild(td)
    }

    return tr;
}

function revealSelections() {
    console.log(getRadioValue("sourceType"));
    console.log(getRadioValue("targetType"));
    console.log(getRadioValue("interactionType"));
    console.log(getRadioValue("nodeID"));
}

function getRadioValue(radioId) {
    var sourceRadios = document.getElementsByName(radioId);
    if(sourceRadios) {
        for (var i = 0, length = sourceRadios.length; i < length; i++) {
            if (sourceRadios[i].checked) {
                return sourceRadios[i].value;
            }
        }
    } else {
        return null;
    }
}

function submitData() {
    var loadPlan = checkTable();
    console.log(loadPlan);

    var input  = document.getElementById('fileToUpload'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple

    var nodeInput  = document.getElementById('fileToUploadNode');
    var nodeFile   = nodeInput.files[0];


        var ndexServerURI = ""; //"http://localhost:8183";
        var url = ndexServerURI + "/v1/upload";

        var XHR = new XMLHttpRequest();
        var FD  = new FormData();

        var blob = new Blob([nodeFile], { type: "text/plain"});
        var blob2 = new Blob([file], { type: "text/plain"});

       // data.append("myfile", myBlob, "filename.txt");
        //FD.append('CXNetworkStream', blob);
        FD.append('file', blob2);
        FD.append('nodeFile', blob);
        FD.append('source', loadPlan["Source"]);
        FD.append('target', loadPlan["Target"]);
        FD.append('edge', loadPlan["Edge"]);
        FD.append('nodeFileIDColumn', loadPlan["NodeIDColumn"]);

        console.log("here");

        XHR.addEventListener('load', function(event) {

            if (XHR.readyState === XHR.DONE) {
                if (XHR.status === 200 || XHR.status === 201) {
                    var newUUID = XHR.responseText;
                    onSuccess(XHR.responseText);
                }
            }
        //    alert('Yeah! Data sent and response loaded.');
        });

        // We define what will happen in case of error
        XHR.addEventListener('error', function(event) {
         //   alert('Oups! Something goes wrong.');
            onError(XHR.responseText);
        });

        XHR.open('POST', url);
        //XHR.setRequestHeader("Authorization", "Basic " + btoa("scratch:scratch"));

        // We just send our FormData object, HTTP headers are set automatically
        //var foo =  XHR.send({'files': {"upload": "ABC", "plan": "xyz"}});
        var foo =  XHR.send(FD);



}

function onSuccess(resultsText) {
    var resultsDiv = document.getElementById('resultsDiv');
    var resultsClean = resultsText.replace("v2", "#");
    resultsDiv.innerHTML = "<a href='" + resultsClean + "'>" + resultsClean + "</a>";
}

function checkTable() {
    var returnValue = {};

    returnValue["Source"] = getRadioValue("sourceType");
    returnValue["Target"] = getRadioValue("targetType");
    returnValue["Edge"] = getRadioValue("interactionType");
    returnValue["NodeIDColumn"] = getRadioValue("nodeID");

    //var nodeId = document.getElementById("nodeId");
    //if(nodeId != null) {
    //    returnValue["NodeIDColumn"] = nodeId.options[nodeId.selectedIndex].value;
    //    console.log(returnValue["NodeIDColumn"]);
    //}

    return returnValue;
}



function confirmFileSubmitNode(){
    var input  = document.getElementById('fileToUploadNode'); // get the input
    var file   = input.files[0];                  // assuming single file, no multiple
    var reader = new FileReader();

    reader.onload = function(e) {
        var text = reader.result;                 // the entire file
        var allLines = text.split('\n')
        var firstLine = allLines.shift(); // first line
        var secondLine = allLines.shift(); // first line
        var thirdLine = allLines.shift(); // first line

        console.log(secondLine);
        console.log(thirdLine);

        //var columns = firstLine.split("\t");
        var countTabs = (firstLine.match(/\t/g) || []).length;
        var countCommas = (firstLine.match(/,/g) || []).length;

        var columns = null;
        var secondLineFields = null;
        var thirdLineFields = null;
        if(countCommas > countTabs) {
            columns = firstLine.split(",");
            secondLineFields = secondLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            thirdLineFields = thirdLine.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        } else {
            columns = firstLine.split("\t");
            secondLineFields = secondLine.split("\t");
            thirdLineFields = thirdLine.split("\t");
        }

        var previewTableDiv = document.getElementById('previewTableDivNode'); // get the input




        var tbl = document.createElement('table');
        tbl.className = "table table-bordered table-condensed";
        //tbl.style.width = '100%';

        //===============
        // TABLE HEADER
        //===============
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        tr.className = "info";

        var thBlank = document.createElement('th');
        tr.appendChild(thBlank)

        for (var i=0; i<columns.length; i++) {
            var th = document.createElement('th');
            th.className = "text-center";
            th.innerHTML = "<span style='font-weight: bold;'>" + columns[i] + "</span>";
            tr.appendChild(th)
        }

        thead.appendChild(tr);

        tbl.appendChild(thead);

        var tbdy = document.createElement('tbody');

        //=======================
        // SOURCE RADIO BUTTONS
        //=======================
        tbdy.appendChild(createRadioRow("Node ID", "nodeID", columns))

        //====================
        // FIRST LINE PREVIEW
        //====================
        tbdy.appendChild(createPreviewRow(secondLineFields));

        //=====================
        // SECOND LINE PREVIEW
        //=====================
        tbdy.appendChild(createPreviewRow(thirdLineFields));


        tbl.appendChild(tbdy);
        previewTableDiv.appendChild(tbl);
    }

    reader.readAsText(file, 'UTF-8');             // or whatever encoding you're using
                                                  // UTF-8 is default, so this argument
}

