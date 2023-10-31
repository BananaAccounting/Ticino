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
// @id = ch.banana.ch.app.textsupdater
// @api = 1.0
// @pubdate = 2023-10-20
// @publisher = Banana.ch SA
// @description = Aggiorna tabella Testi
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

    jsonDoc = UpdateTesti();
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


function UpdateTesti() {

    //rows
    var rows = [];

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "tdr";
    row.fields["Description"] = "Tipo di rendiconto";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "ddn";
    row.fields["Description"] = "Data di nascita";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "dom";
    row.fields["Description"] = "Domicilio";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "ddp";
    row.fields["Description"] = "Data di presentazione";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "icg";
    row.fields["Description"] = "Indennità cresciuta in giudicato (Anni, CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "icg";
    row.fields["Description"] = "Indennità cresciuta in giudicato (Anni, CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "icg";
    row.fields["Description"] = "Indennità cresciuta in giudicato (Anni, CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "icg";
    row.fields["Description"] = "Indennità cresciuta in giudicato (Anni, CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "pec";
    row.fields["Description"] = "Esecuzioni in corso (cfr. istruzioni, punto 11) (CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "pec";
    row.fields["Description"] = "Esecuzioni in corso (cfr. istruzioni, punto 11) (CHF, Doc. N.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "pec";
    row.fields["Description"] = "Altre procedure esecutive";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 1";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 2";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 3";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 4";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 5";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 6";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 7";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 8";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "alt";
    row.fields["Description"] = "Altro 9";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "mod";
    row.fields["Description"] = "Eventuali CHF correzioni o modifiche";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "tsr";
    row.fields["Description"] = "Tariffa stabilita/richiesta";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "ore";
    row.fields["Description"] = "Ore";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "kmp";
    row.fields["Description"] = "Km percorsi (0.60 CHF/km)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "spe";
    row.fields["Description"] = "Spese (postali, cancelleria, ecc.)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "asp";
    row.fields["Description"] = "Altro, indicare: ";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "akm";
    row.fields["Description"] = "Altri Km percorsi (0.60 CHF/km)";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "ast";
    row.fields["Description"] = "Altre spese di trasporto";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "acc";
    row.fields["Description"] = "Acconti percepiti previa autorizzazione dell’ARP";
    rows.push(row);

    //row operation
    var row = {};

    //campi riga
    row.fields = {};
    row.operation = {};
    row.operation.name = 'add';
    row.operation.sequence = '';
    row.fields["RowId"] = "zero";
    row.fields["Description"] = "Stampa importi a zero (Sì = 1, No = cella vuota)"
    row.fields["Testo"] = "";
    rows.push(row);


    //table
    var dataUnitTransactions = {};
    dataUnitTransactions.nameXml = 'Testi';
    dataUnitTransactions.data = {};
    dataUnitTransactions.data.rowLists = [];
    dataUnitTransactions.data.rowLists.push({ 'rows': rows });

    //document
    var jsonDoc = initDocument();
    jsonDoc.document.dataUnits.push(dataUnitTransactions);

    return jsonDoc;

}