// Copyright [2023] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.ch.app.balanceupdater
// @api = 1.0
// @pubdate = 2023-10-20
// @publisher = Banana.ch SA
// @description = Aggiorna tabella Conti
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = curatele
// @outputformat = none
// @inputdataform = none
// @timeout = -1


//MAIN FUNCTION
function exec(string) {

    //Check if we are on an opened document
    if (!Banana.document) { return; }

    var documentChange = { "format": "documentChange", "error": "", "data": [] };

    jsonDoc = UpdateFuoriBilancio();
    documentChange["data"].push(jsonDoc);


    return documentChange;

}

//Funzioni per scrivere nei file ac2

function getCurrentDate() {
    var d = new Date();
    var datestring = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    return Banana.Converter.toInternalDateFormat(datestring, "yyyymmdd");
}

function getCurrentTime() {
    var d = new Date();
    var timestring = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return Banana.Converter.toInternalTimeFormat(timestring, "hh:mm");
}

function initDocument() {
    var jsonDoc = {};
    jsonDoc.document = {};
    jsonDoc.document.fileVersion = "1.0.0";
    jsonDoc.document.dataUnits = [];
    jsonDoc.creator = {};
    jsonDoc.creator.executionDate = getCurrentDate();
    jsonDoc.creator.executionTime = getCurrentTime();
    jsonDoc.creator.name = Banana.script.getParamValue('id');
    jsonDoc.creator.version = "1.0";
    return jsonDoc;
}

function UpdateFuoriBilancio() {

    //rows
    var rows = [];


    // POSIZIONI FUORI BILANCIO

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Section"] = "*";
    row.fields["Description"] = "Posizioni fuori bilancio";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    rows.push(row);

    // SEZIONE 5

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Section"] = "5";
    row.fields["Description"] = "Fuori bilancio attivi";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);


    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5001";
    row.fields["Description"] = "Attestati carenza beni (cfr. istruzioni, punto 11)";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5002";
    row.fields["Description"] = "Anticipi dell’Ufficio sostegno sociale (USSI)";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5003";
    row.fields["Description"] = "Anticipi dell’Ufficio contributi-mancati pagamenti assicurazione malattia";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5004";
    row.fields["Description"] = "Anticipo/i Comune/i per indenittà versata ai curatori";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5005";
    row.fields["Description"] = "Assistenza giudiziaria";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "5006";
    row.fields["Description"] = "Altri debiti (con potenziale diritto di regresso)";
    row.fields["BClass"] = "5";
    row.fields["Gr"] = "50";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Group"] = "50";
    row.fields["Description"] = "Totale fuori bilancio attività";
    row.fields["Gr"] = "100";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);


    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    rows.push(row);

    // SEZIONE 6

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Section"] = "6";
    row.fields["Description"] = "Fuori bilancio passivi";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6001";
    row.fields["Description"] = "Anticipi dell’Ufficio sostegno sociale (USSI)";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6002";
    row.fields["Description"] = "Anticipi dell’Ufficio contributi-mancati pagamenti assicurazione malattia";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6003";
    row.fields["Description"] = "Anticipo/i Comune/i per indenittà versata ai curatori";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6004";
    row.fields["Description"] = "Assistenza giudiziaria";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6005";
    row.fields["Description"] = "Altri debiti (con potenziale diritto di regresso)";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "6006";
    row.fields["Description"] = "Altri crediti";
    row.fields["BClass"] = "6";
    row.fields["Gr"] = "60";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Group"] = "60";
    row.fields["Description"] = "Totale fuori bilancio passività";
    row.fields["Gr"] = "100";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);


    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    rows.push(row);

    // SEZIONE 7

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Section"] = "7";
    row.fields["Description"] = "Contropartite conti fuori bilancio";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Account"] = "7000";
    row.fields["Description"] = "Contropartite conti fuori bilancio";
    row.fields["BClass"] = "7";
    row.fields["Gr"] = "70";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Group"] = "70";
    row.fields["Description"] = "Totale Contropartite conti fuori bilancio";
    row.fields["Gr"] = "100";
    row.style = {};
    row.style.bold = "true";
    rows.push(row);


    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["Group"] = "100";
    row.fields["Description"] = "Differenza deve essere 0 (= cella vuota)";
    rows.push(row);



    // Se file Entrate - Uscite
    if ( Banana.document.table("Categories") ) {
    // remove row.fields["BClass"] reference for every row of rows
    for (var i = 0; i < rows.length; i++) {
        delete rows[i].fields["BClass"];
    }
    }


    //table
    var dataUnitTransactions = {};
    dataUnitTransactions.nameXml = 'Accounts';
    dataUnitTransactions.data = {};
    dataUnitTransactions.data.rowLists = [];
    dataUnitTransactions.data.rowLists.push({ 'rows': rows });

    //document
    var jsonDoc = initDocument();
    jsonDoc.document.dataUnits.push(dataUnitTransactions);

    return jsonDoc;

}