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
// @id = ch.banana.ch.app.rendicontofinanziario2023
// @api = 1.0
// @pubdate = 2023-10-20
// @publisher = Banana.ch SA
// @description = Rendiconto finanziario (art. 410 CC)
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = curatele
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ch.banana.ch.app.style.js



//Global variables
var param = {};
var form = [];


function checkParam(message) {

    // search if every parameter there is a corresponding row in the table "Testi"
    var table = Banana.document.table("Testi");

    if (!table) {
        var message = "Aggiorna il file alla nuova versione. La tabella Testi non esiste";
        return message;
    }
    var row = table.findRowByValue("RowId", "tdr");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga tdr non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "npd");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga npd non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "cpd");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga cpd non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "ddn");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga ddn non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "dom");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga dom non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "iqd");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga iqd non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "art");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga art non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "arn");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga arn non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "ard");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga ard non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "ddp");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga ddp non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "grc");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga grc non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "icg");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga icg non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "pec");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga pec non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "alt");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga alt non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "oss");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga oss non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "all");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga all non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "mod");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga mod non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "tsr");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga tsr non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "ore");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga ore non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "kmp");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga kmp non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "spe");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga spe non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "asp");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga asp non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "akm");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga akm non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "ast");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga ast non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "acc");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga acc non esiste";
        return message;
    }
    row = table.findRowByValue("RowId", "zero");
    if (!row) {
        var message = "Aggiorna il file alla nuova versione. La riga zero non esiste";
        return message;
    }
    return true;


}

//The purpose of this function is to get and load all the parameters saved into the .ac2 
//In order to create the report some others parameters are stored here 
function loadParam() {

    param = {
        //Parameters saved into the informations
        "headerleft": Banana.document.info("Base", "headerleft"),
        "headerright": Banana.document.info("Base", "headerright"),
        "startDate": Banana.document.info("AccountingDataBase", "OpeningDate"),
        "endDate": Banana.document.info("AccountingDataBase", "ClosureDate"),
        "company": Banana.document.info("AccountingDataBase", "Company"),
        "courtesy": Banana.document.info("AccountingDataBase", "Courtesy"),
        "name": Banana.document.info("AccountingDataBase", "Name"),
        "familyName": Banana.document.info("AccountingDataBase", "FamilyName"),
        "address1": Banana.document.info("AccountingDataBase", "Address1"),
        "address2": Banana.document.info("AccountingDataBase", "Address2"),
        "zip": Banana.document.info("AccountingDataBase", "Zip"),
        "city": Banana.document.info("AccountingDataBase", "City"),
        "state": Banana.document.info("AccountingDataBase", "State"),
        "country": Banana.document.info("AccountingDataBase", "Country"),
        "web": Banana.document.info("AccountingDataBase", "Web"),
        "email": Banana.document.info("AccountingDataBase", "Email"),
        "phone": Banana.document.info("AccountingDataBase", "Phone"),
        "mobile": Banana.document.info("AccountingDataBase", "Mobile"),
        "fax": Banana.document.info("AccountingDataBase", "Fax"),
        "fiscalNumber": Banana.document.info("AccountingDataBase", "FiscalNumber"),
        "vatNumber": Banana.document.info("AccountingDataBase", "VatNumber"),

        //Parameters saved into the table "Testi" (parameters that the user have to modify properly into the .ac2 file)
        "tdr": Banana.document.table("Testi").findRowByValue("RowId", "tdr").value("Testo"),
        "npd": Banana.document.table("Testi").findRowByValue("RowId", "npd").value("Testo"),
        "cpd": Banana.document.table("Testi").findRowByValue("RowId", "cpd").value("Testo"),
        "ddn": Banana.document.table("Testi").findRowByValue("RowId", "ddn").value("Testo"),
        "dom": Banana.document.table("Testi").findRowByValue("RowId", "dom").value("Testo"),
        "iqd": Banana.document.table("Testi").findRowByValue("RowId", "iqd").value("Testo"),
        "art": Banana.document.table("Testi").findRowByValue("RowId", "art").value("Testo"),
        "arn": Banana.document.table("Testi").findRowByValue("RowId", "arn").value("Testo"),
        "ard": Banana.document.table("Testi").findRowByValue("RowId", "ard").value("Testo"),
        "ddp": Banana.document.table("Testi").findRowByValue("RowId", "ddp").value("Testo"),
        "grc": Banana.document.table("Testi").findRowByValue("RowId", "grc").value("Testo"),
        "icg": Banana.document.table("Testi").findRowByValue("RowId", "icg").value("Testo"),
        "pec": Banana.document.table("Testi").findRowByValue("RowId", "pec").value("Testo"),
        "alt": Banana.document.table("Testi").findRowByValue("RowId", "alt").value("Testo"),
        "oss": Banana.document.table("Testi").findRowByValue("RowId", "oss").value("Testo"),
        "all": Banana.document.table("Testi").findRowByValue("RowId", "all").value("Testo"),
        "mod": Banana.document.table("Testi").findRowByValue("RowId", "mod").value("Testo"),
        "tsr": Banana.document.table("Testi").findRowByValue("RowId", "tsr").value("Testo"),
        "ore": Banana.document.table("Testi").findRowByValue("RowId", "ore").value("Testo"),
        "kmp": Banana.document.table("Testi").findRowByValue("RowId", "kmp").value("Testo"),
        "spe": Banana.document.table("Testi").findRowByValue("RowId", "spe").value("Testo"),
        "asp": Banana.document.table("Testi").findRowByValue("RowId", "asp").value("Testo"),
        "akm": Banana.document.table("Testi").findRowByValue("RowId", "akm").value("Testo"),
        "ast": Banana.document.table("Testi").findRowByValue("RowId", "ast").value("Testo"),
        "acc": Banana.document.table("Testi").findRowByValue("RowId", "acc").value("Testo"),
        "testoaltro": Banana.document.table("Testi").findRowByValue("RowId", "asp").value("Description"),
        "zero": Banana.document.table("Testi").findRowByValue("RowId", "zero").value("Testo"),

        //Additional informations
        "reportName": "Rendiconto finanziario",
        "bananaVersion": "Banana Accounting, v. " + Banana.document.info("Base", "ProgramVersion"),
        "scriptVersion": "script v. 2020-12-09 (TEST VERSION)",
        "pageCounterText": "Pagina",
        "rounding": 2,
        "formatNumber": true
    };

    loadOsservazioni();
    loadIndennità()
    loadPE();
    loadAltro();
    loadAllegati();
}


//The purpose of this function is to load a form with all the data taken from the table "Accounts" of the .ac2 file
function loadForm() {
    var table = Banana.document.table("Accounts");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);
        if (tRow.value("Account")) { //We take only the rows with an existing account number/text
            form.push({
                "account": tRow.value("Account"),
                "group": tRow.value("Group"),
                "description": tRow.value("Description"),
                "gr": tRow.value("Gr"),
                "note": tRow.value("Note"),
                "opening": Banana.document.currentBalance(tRow.value("Account"), param.startDate, param.endDate).opening,
                "balance": Banana.document.currentBalance(tRow.value("Account"), param.startDate, param.endDate).balance,
                "balanceNotConverted": Banana.document.currentBalance(tRow.value("Account"), param.startDate, param.endDate).balance,
                "docNumero": tRow.value("DocNumero"),
                "particellaNumero": tRow.value("ParticellaNumero"),
                "rfdrfp": tRow.value("RFD/RFP"),
                "valoreStima": tRow.value("ValoreStima")
            });
        }
        if (tRow.value("Group") && (tRow.value("Gr") === "10" || tRow.value("Gr") === "20")) { //We take the rows with an existing Group with Gr=10 or Gr=20
            form.push({
                "account": tRow.value("Account"),
                "group": tRow.value("Group"),
                "description": tRow.value("Description"),
                "gr": tRow.value("Gr"),
                "note": tRow.value("Note"),
                "opening": Banana.document.currentBalance("Gr=" + tRow.value("Group"), param.startDate, param.endDate).opening,
                "balance": Banana.document.currentBalance("Gr=" + tRow.value("Group"), param.startDate, param.endDate).balance,
                "balanceNotConverted": Banana.document.currentBalance("Gr=" + tRow.value("Group"), param.startDate, param.endDate).balance,
                "docNumero": tRow.value("DocNumero"),
                "particellaNumero": tRow.value("ParticellaNumero"),
                "rfdrfp": tRow.value("RFD/RFP"),
                "valoreStima": tRow.value("ValoreStima")
            });
        }
    }
    //Income & Expense accounting: loads the data from the table Categories
    if (Banana.document.table('Accounts') && Banana.document.table('Categories')) {
        var tableCategories = Banana.document.table("Categories");
        for (var i = 0; i < tableCategories.rowCount; i++) {
            var tRow = tableCategories.row(i);
            if (tRow.value("Category")) { //We take only the rows with an existing account number/text
                form.push({
                    "group": tRow.value("Group"),
                    "account": tRow.value("Category"), //the value of category is used as account value
                    "description": tRow.value("Description"),
                    "gr": tRow.value("Gr")
                    //If balance is needed use the function Banana.document.currentBalance("GrC=grNumber").balance
                });
            }
        }
    }
}


//The purpose of this function is to do some operations before the values are converted
function postProcess() {

    //Function call to verify the values
    flagError = verificaImporti();
}


//MAIN FUNCTION
function exec(string) {

    //Check if we are on an opened document
    if (!Banana.document) { return; }

    /** 1. CHECK, CREATE AND LOAD THE PARAMETERS AND THE FORM */
    var message = checkParam();
    if ( message != true ) {
        Banana.document.addMessage(message);
        return;
    }

    loadParam();
    loadForm();

    /** 2. CALCULATE THE TOTALS */
    calcTotals();

    /** 3. DO SOME OPERATIONS BEFORE CONVERTING THE VALUES */
    postProcess();

    /** 4. CONVERT ALL THE VALUES */
    formatValues(["opening", "balance"]);

    /** 5. PRINT THE REPORT */
    printReport();
}


//The purpose of this function is to create the report
function printReport() {
    var report = Banana.Report.newReport(param.reportName);


    //------------------------------------------------------------------------------//
    // 1.	TITOLI, HEADER E FOOTER
    //------------------------------------------------------------------------------//


    // add Header table
    var tableHeader = report.addTable("tableHeader");
    tableRow = tableHeader.addRow();
    tableRow.addCell("Repubblica e Cantone Ticino", "documentheaderleft");
    tableRow.addCell("Autorità Regionale di Protezione no. " + param.arn, "documentheaderright");
    tableRow = tableHeader.addRow();
    tableRow.addCell("Camera di protezione del Tribunale d’appello", "documentheaderleft");
    tableRow.addCell("Di: " + param.ard, "documentheaderright");
    tableRow = tableHeader.addRow();
    tableRow.addCell("Via Bossi 2a", "documentheaderleft");
    tableRow.addCell("Data di presentazione: " + param.ddp, "documentheaderright");
    tableRow = tableHeader.addRow();
    tableRow.addCell("6901 Lugano", "documentheaderleft");
    tableRow.addCell("", "documentheaderright");
    report.addParagraph(" ", "bordoSinistra");
    report.addParagraph(" ", "bordoSinistra");


    //Titoli
    report.addParagraph("Rendiconto finanziario", "titleStyle bordoSinistraSopra");
    report.addParagraph("(art. 410 CC)", "subtitleStyle bordoSinistra");
    report.addParagraph(" ", "bordoSinistra");


    //Footer
    addFooter(report);



    //------------------------------------------------------------------------------//
    // 2.	DATA PERIODO CONTABILE
    //------------------------------------------------------------------------------//
    //creazione tabella per le date
    report.addParagraph("Si prega di leggere le istruzioni allegate a questo formulario prima di iniziare a compilarlo. Il rendiconto deve essere consegnato in due esemplari all’ARP competente entro fine febbraio dell’anno successivo a quello di riferimento, salvo termini diversi indicati dall'ARP.", "paragrafoStyle");
    report.addParagraph("Nota bene: la presente versione del formulario di rendiconto sostituisce tutte le precedenti.", "paragrafoStyleBold");
    report.addParagraph(" ", "paragrafoStyle");
    report.addParagraph(" ", "");
    var tableAccountingDate = report.addTable("tableAccountingDate");
    tableRow = tableAccountingDate.addRow();
    tableRow.addCell("Anno " + Banana.Converter.toDate(param.startDate).getFullYear().toString(), "intestazioneStyle");
    tableRow.addCell("Periodo dal " + Banana.Converter.toLocaleDateFormat(param.startDate), "intestazioneStyle");
    tableRow.addCell("al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");



    //------------------------------------------------------------------------------//
    // 3.	INTESTAZIONE
    //------------------------------------------------------------------------------//
    //Intestazione permette l'inserimento dei dati personali

    //Nome e Cognome concernente
    var tableTipoRendiconto = report.addTable("tableTipoRendiconto");
    tableTipoRendiconto.getCaption().addText(" ", "ntestazioneStyle top1em");
    tableRow = tableTipoRendiconto.addRow();
    tableRow.addCell("Tipo di rendiconto (selezionare)", "intestazioneStyle bordoSopra");
    tableRow = tableTipoRendiconto.addRow();
    tableRow.addCell(param.tdr, "bordoSinistra");
    tableRow = tableTipoRendiconto.addRow();
    tableRow.addCell(" ", "bordoSinistra");
    var tableIntestazioneConcernente = report.addTable("tableIntestazione1");
    tableIntestazioneConcernente.getCaption().addText("Concernente", "intestazioneStyle top1em");
    tableRow = tableIntestazioneConcernente.addRow();
    tableRow.addCell("Nome " + param.name, "");
    tableRow.addCell("Cognome " + param.familyName, "");
    var tableIntestazioneDataDomicilio = report.addTable("tableIntestazione1");
    tableRow = tableIntestazioneDataDomicilio.addRow();
    tableRow.addCell("Data di nascita " + param.ddn, "");
    tableRow.addCell("Domicilio " + param.dom, "");
    tableRow = tableIntestazioneDataDomicilio.addRow();
    tableRow.addCell(" ");
    tableRow.addCell(" ");

    //Nome e Cognome di chi presenta il rapporto
    report.addParagraph(" ");
    var tableIntestazionePresentatoDa = report.addTable("tableIntestazione1");
    tableIntestazionePresentatoDa.getCaption().addText("Presentato da", "intestazioneStyle");
    tableRow = tableIntestazionePresentatoDa.addRow();
    tableRow.addCell("Nome " + param.npd, "");
    tableRow.addCell("Cognome " + param.cpd, "");
    tableRow = tableIntestazionePresentatoDa.addRow();
    tableRow.addCell(" ");
    tableRow.addCell(" ");

    //Curatore/Tutore + no. articolo
    report.addParagraph(" ");
    var tableIntestazioneTipologia = report.addTable("tableIntestazione1");
    tableRow = tableIntestazioneTipologia.addRow();
    tableRow.addCell("In qualità di (selezionare dall'elenco) ", "");
    tableRow.addCell("Nominato ai sensi dell'articolo/degli articoli ", "");

    tableRow = tableIntestazioneTipologia.addRow();
    tableRow.addCell(param.iqd, "");
    tableRow.addCell(param.art, "");
    report.addParagraph(" ");
    report.addParagraph(" ");



    //------------------------------------------------------------------------------//
    // 4.	DATA SITUAZIONE PATRIMONIALE
    //------------------------------------------------------------------------------//
    var tableSituazionePatrimonialeAl = report.addTable("table");
    tableRow = tableSituazionePatrimonialeAl.addRow();
    tableRow.addCell("Situazione patrimoniale al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");
    report.addParagraph(" ");



    //------------------------------------------------------------------------------//
    // 5.	CONTI ATTIVI
    //------------------------------------------------------------------------------//
    //Crea tabella 
    var tableAttivo = report.addTable("table");
    tableAttivo.getCaption().addText("ATTIVI", "intestazioneStyle");

    tableRow = tableAttivo.addRow();
    //Aggiunge i titoli delle varie colonne
    tableRow.addCell("Beni immobili:", "intestazioneStyle Left");
    tableRow.addCell("N. fondo", "intestazioneStyle Left");
    tableRow.addCell("RFD/RFP di", "intestazioneStyle Left");
    tableRow.addCell("Valore di", "intestazioneStyle Left");
    tableRow.addCell("Doc. N.", "intestazioneStyle Left");
    tableRow = tableAttivo.addRow();
    tableRow.addCell("", "intestazioneStyle Left");
    tableRow.addCell("", "intestazioneStyle Left");
    tableRow.addCell("(luogo di situazione)", "intestazioneStyle Left");
    tableRow.addCell("stima CHF", "intestazioneStyle Left");
    tableRow.addCell("", "intestazioneStyle Left");




    //Cerca tutti gli ATTIVI - IMMOBILI (Gr=11)
    for (var i = 0; i < form.length; i++) {
        if (getObject(form, form[i].account).gr === "11") {

            //Riempimento delle colonne 1,2,3,4 con i dati dei beni immobili
            tableRow = tableAttivo.addRow();
            tableRow.addCell("Particella", "Left");
            tableRow.addCell(getObject(form, form[i].account).particellaNumero, "Left");
            tableRow.addCell(getObject(form, form[i].account).rfdrfp, "Left");
            tableRow.addCell(getObject(form, form[i].account).valoreStima, "Amount Right");
            tableRow.addCell(getObject(form, form[i].account).docNumero, "Right");
        }
    }
    // Aggiungi riga TOTALE BENI IMMOBILI
    tableRow = tableAttivo.addRow();
    tableRow.addCell(" ", " ", 5);
    tableRow = tableAttivo.addRow();
    tableRow.addCell("", "");
    tableRow.addCell("", "");
    tableRow.addCell("TOTALE BENI IMMOBILI", "intestazioneStyle");
    tableRow.addCell(getObject(form, "totBeniImmobili").balance, "underline Amount Right");
    tableRow.addCell("", "");
    report.addPageBreak();


    var tableAttivo = report.addTable("table");
    tableAttivo.getCaption().addText("", "");
    tableRow = tableAttivo.addRow();

    //Aggiunge i titoli delle varie colonne
    tableRow.addCell("Beni mobili:", "intestazioneStyle Left");
    tableRow.addCell("Descrizione, N.IBAN", "intestazioneStyle Left");
    tableRow.addCell("CHF", "intestazioneStyle Left");
    tableRow.addCell("Doc. N.", "intestazioneStyle Left");

    //Cerca tutti gli ATTIVI - IMMOBILI (Gr=10)
    for (var i = 0; i < form.length; i++) {
        if (getObject(form, form[i].account).gr === "10") {

            if (param.zero != "") {
                tableRow = tableAttivo.addRow();
                tableRow.addCell(getObject(form, form[i].account).note, "Left");
                tableRow.addCell(getObject(form, form[i].account).description, "Left");
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell(getObject(form, form[i].account).docNumero, "Right");
            }

            else if (param.zero === "" && getObject(form, form[i].account).balance != 0) {
                tableRow = tableAttivo.addRow();
                tableRow.addCell(getObject(form, form[i].account).note, "Left");
                tableRow.addCell(getObject(form, form[i].account).description, "Left");
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell(getObject(form, form[i].account).docNumero, "Right");
            }

            else {
                null;
            }
        }
    }


    // Aggiungi riga TOTALE BENI MOBILI
    tableRow = tableAttivo.addRow();
    tableRow.addCell(" ", "Left");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow = tableAttivo.addRow();
    tableRow.addCell(" ", "intestazioneStyle Left");
    tableRow.addCell("TOTALE BENI MOBILI", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totBeniMobili").balance, "intestazioneStyle Amount Right underline");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow = tableAttivo.addRow();


    // Aggiungi riga TOTALE ATTIVI
    var tableAttivo = report.addTable("table");
    tableAttivo.getCaption().addText(" ", " ");
    tableRow = tableAttivo.addRow();
    tableRow.addCell(" ", "Left");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow = tableAttivo.addRow();
    tableRow.addCell(" ", "intestazioneStyle Left");
    tableRow.addCell("TOTALE ATTIVI", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totAttivo").balance, "intestazioneStyle Amount Right totalStyle");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow = tableAttivo.addRow();

    //Se la funzione di verifica trova un errore, viene visualizzato un messaggio sul rendiconto in prima pagina
    if (flagError) {
        for (var i = 0; i < form.length; i++) {
            if (form[i]["warningMessage"]) {
                report.addParagraph(form[i]["warningMessage"], "warning");
            }
        }
    }


    //------------------------------------------------------------------------------//
    // 6.	CONTI PASSIVI
    //------------------------------------------------------------------------------//
    //Aggiunge la tabella al report
    var tablePassivo = report.addTable("table");
    tablePassivo.getCaption().addText("PASSIVI", "intestazioneStyle top1em");

    //Aggiunge l'header delle colonne
    var tableHeaderPassivo = tablePassivo.getHeader();
    tableRow = tableHeaderPassivo.addRow();

    //Aggiunge i titoli delle colonne
    tableRow.addCell("Debiti", "Left");
    tableRow.addCell("Descrizione", "Left");
    tableRow.addCell("CHF", "intestazioneStyle Left");
    tableRow.addCell("Doc. N.", "intestazioneStyle Left");

    //Cerca tutti i PASSIVI (Gr=20)
    tableRow = tablePassivo.addRow();
    tableRow.addCell("", "Left", 1);

    for (var i = 0; i < form.length; i++) {
        if (getObject(form, form[i].account).gr === "20") {

            if (param.zero != "") {
                tableRow = tablePassivo.addRow();
                tableRow.addCell(getObject(form, form[i].account).note, "Left");
                tableRow.addCell(getObject(form, form[i].account).description, "Left");
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero, "Right");
            }

            else if (param.zero === "" && getObject(form, form[i].account).balance != 0) {
                tableRow = tablePassivo.addRow();
                tableRow.addCell(getObject(form, form[i].account).note, "Left");
                tableRow.addCell(getObject(form, form[i].account).description, "Left");
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero, "Right");
            }

            else {
                null;
            }
        }
    }

    report.addPageBreak();

    //Aggiunge la tabella Indennità al report
    var tableIndennità = report.addTable("tableNoBorder");
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Indennità approvata dall’ARP e cresciuta in giudicato, non ancora versata, posta a carico dell’interessato, indicare gli anni di riferimento", "Left");
    tableRow = tableIndennità.addRow();
    tableRow.addCell("", "", 1);

    //Aggiunge i titoli delle colonne
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Anni, CHF, Doc. N.", "bold Left");
    tableRow = tableIndennità.addRow();

    for (var i = 0; i < param.icg.length; i++) {
        tableRow.addCell(param.icg[i].testo, "Left");
        tableRow = tableIndennità.addRow();
    }

    tableRow = tableIndennità.addRow();
    tableRow.addCell(" ", " ", 1);


    //Aggiunge la tabella Precetti esecutivi al report
    var tablePE = report.addTable("tableNoBorder");
    tablePE.getCaption().addText("", "");
    //Aggiunge i titoli delle colonne
    tableRow = tablePE.addRow();
    tableRow.addCell("Procedure esecutive", "Left bold");
    tableRow.addCell("CHF, Doc. N.", "bold Left");
    tableRow = tablePE.addRow();

    for (var i = 0; i < param.pec.length; i++) {
        tableRow.addCell(param.pec[i].description, "Left");
        tableRow.addCell(param.pec[i].testo, "Left");
        tableRow = tablePE.addRow();
    }


    //Aggiunge la tabella Altro al report
    var tableAltro = report.addTable("tableNoBorder");
    tableAltro.getCaption().addText("", "");
    tableRow = tableAltro.addRow();
    tableRow.addCell("Altro", "Left bold");
    tableRow = tableAltro.addRow();

    for (var i = 0; i < param.alt.length; i++) {
        tableRow.addCell(param.alt[i].testo, "Left");
        tableRow = tableAltro.addRow();
    }

    // Aggiungi riga TOTALE PASSIVI
    var tablePassivo = report.addTable("table");
    tablePassivo.getCaption().addText(" ", " ");
    tableRow = tablePassivo.addRow();
    tableRow.addCell(" ", "Left");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow.addCell(" ", "Right");
    tableRow = tablePassivo.addRow();
    tableRow.addCell(" ", "intestazioneStyle Left");
    tableRow.addCell("TOTALE PASSIVI", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totPassivo").balance, "intestazioneStyle Amount Right totalStyle");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow = tablePassivo.addRow();

    //------------------------------------------------------------------------------//
    // 7.	TOTALI => ATTIVI + PASSIVI
    //------------------------------------------------------------------------------//
    //Creazione tabella Totali per la stampa dei totali
    var tableTot = report.addTable("tableTot");
    tableTot.getCaption().addText(" ", "intestazioneStyle top1em");

    tableRow = tableTot.addRow();
    tableRow.addCell("Totali", "intestazioneStyle Left");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow.addCell("CHF", "intestazioneStyle Left");
    tableRow.addCell(" ", "intestazioneStyle Left");

    tableRow = tableTot.addRow();
    tableRow.addCell("Totale attivo", "intestazioneStyle Left");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totAttivo").balance, "Amount Right totalStyle");
    tableRow.addCell(" ", "intestazioneStyle Left");

    tableRow = tableTot.addRow();
    tableRow.addCell("Totale passivo", "intestazioneStyle Left");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totPassivo").balance, "Amount Right totalStyle");
    tableRow.addCell(" ", "intestazioneStyle Left");

    tableRow = tableTot.addRow();
    tableRow.addCell("Sostanza netta al: " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle Left");
    tableRow.addCell(" ", "intestazioneStyle Right");
    tableRow.addCell(getObject(form, "totSostanzaNetta").balance, "intestazioneStyle Amount Right totalStyle");
    tableRow.addCell(" ", "intestazioneStyle Left");
    report.addParagraph(" ");

    //------------------------------------------------------------------------------//
    // 8.	DEBITI FUORI BILANCIO
    //------------------------------------------------------------------------------//
    //Aggiunge la tabella Fuori Bilancio al report
    var tableFuoriBilancio = report.addTable("table");
    tableFuoriBilancio.getCaption().addText("Debiti con potenziale diritto di regresso non inseriti nella situazione patrimoniale sopra esposta", "intestazioneStyle");

    //Aggiunge l'header delle colonne
    var tableHeaderFuoriBilancio = tableFuoriBilancio.getHeader();
    tableRow = tableHeaderFuoriBilancio.addRow();

    //Aggiunge i titoli delle colonne
    tableRow.addCell("Descrizione (se documenti disponibili):", "intestazioneStyle Left");
    tableRow.addCell("CHF", "intestazioneStyle Left");
    tableRow.addCell("Doc. N.", "intestazioneStyle Left");

    //Cerca tutti i FUORI BILANCIO (Gr=50 e Gr=60)
    for (var i = 0; i < form.length; i++) {
        if (getObject(form, form[i].account).gr === "50" || getObject(form, form[i].account).gr === "60") {

            if (param.zero != "") {
                tableRow = tableFuoriBilancio.addRow();
                tableRow.addCell(getObject(form, form[i].account).description);
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

            }

            else if (param.zero === "" && getObject(form, form[i].account).balance != 0) {
                tableRow = tableFuoriBilancio.addRow();
                tableRow.addCell(getObject(form, form[i].account).description);
                tableRow.addCell(getObject(form, form[i].account).balance, "Amount Right");
                tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

            }

            else {
                null;
            }

        }
    }

    report.addPageBreak();



    //------------------------------------------------------------------------------//
    // 9.	OSSERVAZIONI
    //------------------------------------------------------------------------------//
    //Creazione dello spazio riservato alle eventuali osservazioni, da inserire manualmente nella tabella "Testi"
    report.addParagraph(" ", "bottom1em");

    report.addParagraph("Osservazioni", "intestazioneStyle");
    report.addParagraph(" ","bordoSinistraSopra");
    for (var i = 0; i < param.ossParam.length; i++) {
        report.addParagraph(param.ossParam[i].testo, "bordoSinistra");
    }
    report.addParagraph(" ", "bordoSinistraSotto");


    //------------------------------------------------------------------------------//
    // 10.	MOVIMENTI FINANZIARI
    //------------------------------------------------------------------------------//	
    //Creazione della tabella per la stampa della data dei movimenti finanziari
    var tableMovimentiFinanziari = report.addTable("tableMF");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Movimenti finanziari dal " + Banana.Converter.toLocaleDateFormat(param.startDate), "intestazioneStyle borderbold Left");
    tableRow.addCell(" ", "borderbold Left");
    tableRow.addCell("al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle borderbold borderboldleft Right");
    //Conto esercizio
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Conto esercizio", "intestazioneStyle borderbold Left margintop", 3);
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Totale entrate", "intestazioneStyle Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totEntrateGenerali").balance, "Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Utili patrimoniali (cfr. istruzioni punto 12)", "Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totEntratePatrimoniali").balance, "Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Totale", "intestazioneStyle Left borderbottom");
    tableRow.addCell("CHF", "borderleft intestazioneStyle Left borderbottom");
    tableRow.addCell(getObject(form, "totEntrate").balance, "intestazioneStyle Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell(" ", "noborder Left borderbottom", 3);
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Totale uscite", "intestazioneStyle Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totUsciteGenerali").balance, "Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Perdite patrimoniali (cfr. istruzioni punto 11)", "Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totUscitePatrimoniali").balance, "Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Totale", "bold Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totUscite").balance, "Amount totalStyle Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell(" ", "noborder Left borderbottom", 3);
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Utile/perdita d'esercizio", "borderbold Left borderbottom");
    tableRow.addCell("CHF", "borderleft borderbold testoBold Left borderbottom");
    tableRow.addCell(getObject(form, "risEsercizio").balance, "testoBold borderbold Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();

    //Conto patrimoniale
    tableRow.addCell("Conto patrimoniale", "intestazioneStyle borderbold Left margintop", 3);
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Riportare sostanza netta anno precedente (o inventario)", "Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totSostanzaNettaApertura").balance, "Amount Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Eventuali correzioni o modifiche", "Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(param.mod, "Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Utile perdita d'esercizio (+/-)", "bold Left borderbottom");
    tableRow.addCell("CHF", "bold borderleft totalStyle Left borderbottom");
    tableRow.addCell(getObject(form, "risEsercizio").balance, "bold Amount totalStyle Right borderbottom");
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell(" ", "noborder Left borderbottom", 3);
    tableRow = tableMovimentiFinanziari.addRow();
    tableRow.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle Left borderbottom");
    tableRow.addCell("CHF", "borderleft bold Left borderbottom");
    tableRow.addCell(getObject(form, "totSostanzaNetta").balance, "intestazioneStyle Amount Right borderbottom");
    report.addPageBreak();


    //------------------------------------------------------------------------------//
    // 11.	RICHIESTA INDENNITA'
    //------------------------------------------------------------------------------//

    //Aggiunge la tabella Richiesta Indennità al report
    var tableIndennità = report.addTable("table", "bottom1em");
    tableIndennità.getCaption().addText("Richiesta indennità per il periodo di riferimento (allegare nota dettagliata, e giustificativi per il rimborso delle spese)", "intestazioneStyle");

    let tot = 0;
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Tariffa stabilita/richiesta:", "Left");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.tsr, 2, true) + " CHF/h", "bold Right");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow = tableIndennità.addRow();
    if (param.ore != "") {
    tableRow.addCell("Ore", "Left");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.ore, 2, true) + " h", "bold Right");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Totale onorario", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.ore * param.tsr, 2, true), "Right");
    tot = Number(Banana.Converter.toLocaleNumberFormat(param.ore, 2, true) * Banana.Converter.toLocaleNumberFormat(param.tsr, 2, true));
    tableRow = tableIndennità.addRow();
    }
    tableRow.addCell("Trasferte", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow = tableIndennità.addRow();
    if (param.kmp != "") {
    tableRow.addCell("Domicilio curatore-domicilio curatelato", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Km percorsi (0.60 CHF/km)", "Left");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.kmp, 2, true) + " km", "bold Right");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.kmp * 0.60, 2, true), "Right");
    tot = tot + Number(Banana.Converter.toLocaleNumberFormat(param.kmp, 2, true) * 0.60);
    tableRow = tableIndennità.addRow();
    }
    if (tot > 0) {
    tableRow.addCell("Totale indennità", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tot, 2, true), "Right");
    tableRow = tableIndennità.addRow();
    }
    if (param.spe != "") {
    tableRow.addCell("Spese (postali, cancelleria, ecc.)", "Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.spe, 2, true), "Right");
    tot = tot + Number(Banana.Converter.toLocaleNumberFormat(param.spe, 2, true));
    tableRow = tableIndennità.addRow();
    }
    if (param.asp != "") {
    tableRow.addCell(param.testoaltro, "Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.asp, 2, true), "Right");
    tot = tot + Number(Banana.Converter.toLocaleNumberFormat(param.asp, 2, true));
    tableRow = tableIndennità.addRow();
    }
    if (param.akm != "") {
    tableRow.addCell("Altre trasferte", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow = tableIndennità.addRow();
    tableRow.addCell("Km percorsi (0.60 CHF/km)", "Left");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.akm, 2, true) + " km", "bold Right");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.akm * 0.60, 2, true), "Right");
    tot = tot + Number(Banana.Converter.toLocaleNumberFormat(param.akm, 2, true) * 0.60);
    tableRow = tableIndennità.addRow();
    }
    if (param.ast != "") {
    tableRow.addCell("Altre spese di trasporto", "Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.ast, 2, true), "Right");
    tot = tot + Number(Banana.Converter.toLocaleNumberFormat(param.ast, 2, true));
    tableRow = tableIndennità.addRow();
    }
    if (tot > 0) {
    tableRow.addCell("");
    tableRow.addCell("TOTALE", "bold Right");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tot, 2, true), "Right  totalStyle");
    tableRow = tableIndennità.addRow();
    }
    if (param.acc != "") {
    tableRow.addCell("Acconti percepiti previa autorizzazione dell’ARP", "bold Left");
    tableRow.addCell("");
    tableRow.addCell("CHF", "bold Right");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(param.acc, 2, true), "Right");
    tableRow = tableIndennità.addRow();
    }
    report.addParagraph(" ");


    //------------------------------------------------------------------------------//
    // 12.	FIRME
    //------------------------------------------------------------------------------//
    //Creazione della sezione dedicata alle firme


    var tableFirma = report.addTable("tableFirma");
    tableRow = tableFirma.addRow();
    tableRow.addCell("Il curatore /la curatrice", "bordoSinistraSopra");
    tableRow.addCell("Firma", "bordoSinistraSopra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "bordoSinistra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "bordoSinistra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("Il curatelato", "bordoSinistraSopra");
    tableRow.addCell("Firma", "bordoSinistraSopra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "bordoSinistra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "bordoSinistra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("(se rifiuta, indicare i motivi)", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");

    tableRow = tableFirma.addRow();
    var tableFirma = report.addTable("tableFirma");
    tableRow = tableFirma.addRow();
    tableRow.addCell("In caso di minorenni, firma dei genitori", "bordoSinistraSopra");
    tableRow.addCell("", "bordoSopra");
    tableRow.addCell("", "bordoSopra");
    tableRow = tableFirma.addRow();
    tableRow.addCell("Nome e Cognome", "bordoSinistra");
    tableRow.addCell("Padre/Madre", "");
    tableRow.addCell("Firma", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();
    tableRow.addCell("", "bordoSinistra");
    tableRow.addCell("", "");
    tableRow.addCell("", "");
    tableRow = tableFirma.addRow();


    //Stampa degli allegati (tabella "Testi")
    //Aggiunge la tabella al report
    var tableAllegati = report.addTable("table");
    tableAllegati.getCaption().addText("", "top1em");
    tableAllegati = tableAllegati.addRow();
    tableAllegati.addCell("Allegati: ", "Left");
    tableAllegati = tableAllegati.addRow();
    tableAllegati.addCell(" ", "Left");
    for (var i = 0; i < param.allParam.length; i++) {
        tableAllegati = tableAllegati.addRow();
        tableAllegati.addCell(" - " + param.allParam[i].testo, "Left");
    }
    report.addPageBreak();




    //------------------------------------------------------------------------------//
    // 11.	RETRO PAGINA FIRME
    //------------------------------------------------------------------------------//
    var table = report.addTable("table");
    tableRow = table.addRow();
    tableRow.addCell("L'Autorità Regionale di Protezione no. " + param.arn, "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("di " + param.ard, "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("nella seduta del ", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("ris. ", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell(" ");
    tableRow = table.addRow();
    tableRow.addCell("ha accertato la regolarità della gestione ed ha costatato che la sostanza è amministrata e collocata in modo conforme. Ha verificato che tutte le entrate dell’interessato figurano nel rendiconto per il loro effettivo ammontare o valore; che le spese effettuate sono conformi alla situazione finanziaria dell’interessato ed ai suoi bisogni; che per le spese esiste il relativo documento giustificativo.", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("");
    tableRow = table.addRow();
    tableRow.addCell("L’Autorità Regionale di Protezione ha inoltre preso atto delle risultanze del rendiconto e delle considerazioni esposte dal tutore/curatore e formula le seguenti osservazioni:", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Visto quanto precede e richiamati gli art. 408 e segg. CC, 24 e 25 ROPMA, OABCT", "testoNormale");
    tableRow = table.addRow();
    // fine prima parte


    report.addParagraph("Risolve", "titoliCentrali");
    var tableRisolve = report.addTable("table");

    tableRow = tableRisolve.addRow();
    tableRow.addCell("1.");
    tableRow.addCell("Il rendiconto finanziario è approvato.", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell("2.");
    tableRow.addCell("E’ riconosciuta al tutore/curatore o alla tutrice/curatrice l'indennità di CHF ", "testoBold");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("e le spese di CHF ", "testoBold");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("che sono poste a carico ", "testoBold");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("[  ]  Non sono stati prelevati anticipi.", "testoBold");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("[  ] Dall’importo indicato vanno dedotti gli anticipi autorizzati e effettivamente percepiti di CHF ", "testoBold");


    tableRow = tableRisolve.addRow();
    tableRow.addCell("3.");
    tableRow.addCell("[  ] Le spese e la tassa della presente decisione per complessivi CHF                             sono a carico dell'interessato;", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("[  ] non vengono prelevate tasse né spese.", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell("4.");
    tableRow.addCell("Contro la presente decisione è data facoltà di interporre reclamo entro il termine di 30 giorni dall’intimazione alla Camera di Protezione, Via Bossi 2a, 6901 Lugano, allegando copia della decisione contestata. Dal 1° marzo 2016 nelle procedure in materia di protezione del minore e dell’adulto non vi sono ferie giudiziarie (art. 24 LPMA).", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell("5.");
    tableRow.addCell("Intimazione e comunicazione", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- al tutore / curatore alla tutrice / curatrice", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- all'interessato", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testoNormale");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testoNormale");
    tableRow = tableRisolve.addRow();

    //fine seconda parte


    report.addParagraph("Per l'Autorità Regionale di Protezione", "titoliCentrali");
    var tableFirma = report.addTable("tableIntestazione1");
    tableRow = tableFirma.addRow();
    tableRow.addCell("la / il presidente ");
    tableRow.addCell("la segretaria / iI segretario ");
    tableRow = tableFirma.addRow();
    tableRow.addCell(" ");
    tableRow.addCell(" ");

    report.addParagraph(" ");
    var tableFirma = report.addTable("tableIntestazione1");
    tableRow = tableFirma.addRow();
    tableRow.addCell("Luogo e data ");
    tableRow.addCell("Timbro ");
    tableRow = tableFirma.addRow();
    tableRow.addCell(" ");
    tableRow.addCell(" ");
    //fine terza parte

    report.addPageBreak();




    //------------------------------------------------------------------------------//
    // 12.	TESTO - ISTRUZIONI PER I TUTORI/CURATORI
    //------------------------------------------------------------------------------//
    //Aggiunge tabella per le Istruzioni	
    var tableIstruzioni = report.addTable("tableIstruzioni");
    tableIstruzioni.getCaption().addText("Istruzioni per il tutore/curatore la tutrice/curatrice", "intestazioneStyle");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("1.");
    tableRow.addCell("In linea di principio, ogni rendiconto della persona posta sotto curatela o tutela copre un anno finanziario (annocivile 01.01 - 31.12).", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("2.");
    tableRow.addCell("Il modulo deve essere firmato dal tutore/curatore o tutrice/curatrice (di seguito: il curatore) e dalla persona postasotto curatela o tutela, se è capace di discernimento. Se la persona sotto curatela/tutela è diventata incapace didiscernimento dal rendiconto precedente, allegare un certificato medico.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("3.");
    tableRow.addCell("Il curatore deve presentare, oltre al presente rendiconto finanziario, un rapporto sulle condizioni fisiche, intellettualie morali del tutelato/curatelato, delle prospettive e dei progetti per il prossimo anno di esercizio (cfr. modulo rapportomorale).", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("4.");
    tableRow.addCell("L’Autorità regionale di protezione determina la remunerazione del curatore, che è di principio a carico della persona interessata, e decide in relazione al rimborso delle spese del curatore. È dunque imperativo fornire unalista dettagliata delle spese affrontate e del tempo adibito all’adempimento del mandato. Il curatore che rinuncia a qualsiasi compenso per il suo lavoro deve menzionarlo nel suo rapporto annuale. Ogni eventuale superamentodelle ore stabilite nella decisione di nomina dev’essere preventivamente chiesto ed autorizzato dall’ARP, salvoindicazioni diverse da parte dell'ARP di riferimento.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("5.");
    tableRow.addCell("Se la persona a beneficio della misura di curatela è indigente, l'indennità del curatore e le spese vive affrontate saranno anticipate dal Comune di domicilio del curatelato.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("6.");
    tableRow.addCell("Il rendiconto così come il rapporto morale, debitamente firmati, devono imperativamente essere trasmessi con i documenti giustificativi, che saranno restituiti (vedi istruzione n. 8), all’Autorità regionale di protezione entro la fine del mese di febbraio successivo all'anno di riferimento, salvo proroga autorizzata per iscritto, in duecopie.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("7.");
    tableRow.addCell("Il rendiconto deve specificare le entrate e le uscite della gestione cui si riferisce nelle rispettive colonne entrated'esercizio e uscite d'esercizio.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("8.");
    tableRow.addCell("Tutte le spese devono essere legittimate dal relativo documento giustificativo (fattura originale o scansione o fattura digitale, ricevuta ecc.) numerato, disposto in ordine cronologico per data di pagamento (non in ordinealfabetico) e unito al rendiconto.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("9.");
    tableRow.addCell("Con il rendiconto devono essere trasmessi all’Autorità regionale di protezione i documenti ufficiali rilasciati dagliistituti (estratti conto dettagliati mensili di tutti i conti, incluso l’eventuale conto spillatico, certificati di deposito ecc.)atti a comprovare il deposito dei capitali, titoli, valori, ecc. Gli stessi saranno restituiti al tutore/curatore con la crescita in giudicato della decisione di approvazione del rendiconto.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("10.");
    tableRow.addCell("Il curatore deve fare speciale menzione delle operazioni eccedenti l'ordinaria amministrazione, segnatamente diquelle contemplate all’art. 416 CC (compera o vendita di beni immobili, costituzione di pegno, contratti di affittoodi locazione, ecc.).", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("11.");
    tableRow.addCell("Vanno inserite ai passivi le procedure esecutive risultanti dal conteggio (e non dall’estratto) rilasciato, gratuitamente,dall’ufficio esecuzioni e fallimenti al 31 dicembre dell’anno di riferimento. Sono procedure esecutive quelle che figurano nel conteggio nella colonna stato “precetto esecutivo notificato” “opposizione” o “perente” inclusive di interessi e spese esecutive e d’incasso.", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("Gli attestati di carenza beni risultanti dal conteggio non vanno iscritti nei passivi, ma vanno indicati separatamentealla voce “Debiti con potenziale diritto di regresso”. ", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("12.");
    tableRow.addCell("Utili patrimoniali: vanno indicati tutti i redditi e le entrate provenienti da sostanza e, in particolare:", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- interessi sui conti bancari (al lordo dell’imposta preventiva che andrà iscritta quale credito all’attivo della sostanza);", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- aumento di valore degli investimenti bancari (salvo per le obbligazioni che, nonostante il corso, vanno sempre indicate al valore nominale);", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- fitti e pigioni di proprietà immobiliari;", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- entrate straordinarie, ad esempio ricavi da successioni, eredità, donazioni, vincite ecc;", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- aumenti di valore della sostanza immobiliare per revisione delle stime (nel caso di ristrutturazioni limitatamente alladifferenza tra l’investimento e l’aumento del valore);", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- differenza, nel caso di alienazione di un immobile, fra il valore di stima e quello effettivamente incassato.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("13.");
    tableRow.addCell("Perdite patrimoniali: vanno indicati a questa voce, in particolare,", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- le diminuzioni di valore degli investimenti bancari (ad esempio delle azioni o dei fondi di investimento);", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- la differenza tra l’investimento effettuato per ristrutturare un immobile e l’aumento di valore di stima immobiliare:normalmente quest’ultimo è inferiore;", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- la diminuzione del valore di stima degli immobili, conseguente per esempio ad una revisione delle stime.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("14.");
    tableRow.addCell("Il curatore deve indicare nel rapporto morale, alla voce “Finanze” i motivi per i quali nel periodo di rendiconto si èverificato un utile o una perdita.", "testoNormale");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("15.");
    tableRow.addCell("Gli ammortamenti ipotecari o di altri debiti non vanno iscritti alle uscite come spesa di esercizio inquanto sono operazioni neutrali da un punto di vista economico e alla diminuzione di liquiditàcorrisponde una identica diminuzione del debito.", "testoBold");

    report.addPageBreak();

    //Aggiunge tabella per le Norme legali
    report.addParagraph(" ", "bordoSinistra");
    report.addParagraph("Norme legali pertinenti alla compilazione del rendiconto", "underline bordoSinistra testoBold");
    report.addParagraph(" ", "bordoSinistra");
    var table = report.addTable("tableNormeLegali", "bordoSinistra");
    tableRow = table.addRow();
    tableRow.addCell("Codice civile svizzero = CC;", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Legge sull’organizzazione e la procedura in materia di protezione del minore e dell’adulto (LPMA);", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Regolamento della legge sull’organizzazione e la procedura in materia di protezione del minore e dell’adulto (ROPMA).", "testoNormale");
    tableRow = table.addRow();
    report.addParagraph(" ", "bordoSinistra");
    var table = report.addTable("tableNormeLegali", "bordoSinistra");
    tableRow = table.addRow();
    tableRow.addCell("Rendiconti:", "testoNormale");
    tableRow.addCell("art. 410 CC, art. 24-25 ROPMA", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Tutele:", "testoNormale");
    tableRow.addCell("art. 327a - 327c, 405 - 418 CC", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Curatele:", "testoNormale");
    tableRow.addCell("art. 400 - 418 CC", "testoNormale");
    tableRow = table.addRow();
    tableRow.addCell("Responsabilità:", "testoNormale");
    tableRow.addCell("art. 454 - 456 CC.", "testoNormale");
    tableRow = table.addRow();




    //------------------------------------------------------------------------------//
    // 13.	CREAZIONE/STAMPA DEL REPORT
    //------------------------------------------------------------------------------//
    //Creazione degli stili utilizzati per la stampa
    var stylesheet = createStyleSheet();

    //In caso di errore viene chiesto all'utente se continuare o meno con la stampa del report
    if (flagError) {
        if (Banana.Ui.showQuestion("", "ATTENZIONE! Differenza tra Sostanza netta e Risultato d'esercizio. Continuare?")) {
            //Stampa il rendiconto finanziario con un messaggio di avviso
            Banana.Report.preview(report, stylesheet);
        }
    } else {
        //Stampa il rendiconto finanziario
        Banana.Report.preview(report, stylesheet);
    }

    return report;
}


//The purpose of this function is to get all the texts of the "osservazioni" tag from the table "Testi" and add them to the parameters 
function loadOsservazioni() {
    var ossParam = [];
    var table = Banana.document.table("Testi");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (tRow.value("RowId") === "oss" && tRow.value("Testo")) {
            ossParam.push({ "testo": tRow.value("Testo") });
        }
    }
    param.ossParam = ossParam;
}

//The purpose of this function is to get all the texts of the "Indennità" tag from the table "Testi" and add them to the parameters 
function loadIndennità() {
    var icgParam = [];
    var table = Banana.document.table("Testi");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (tRow.value("RowId") === "icg" && tRow.value("Testo")) {
            icgParam.push({ "testo": tRow.value("Testo") });
        }
    }
    param.icg = icgParam;
}

//The purpose of this function is to get all the texts of the "Procedure esecutive" tag from the table "Testi" and add them to the parameters 
function loadPE() {
    var peParam = [];
    var table = Banana.document.table("Testi");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (tRow.value("RowId") === "pec" && tRow.value("Testo")) {
            peParam.push({
                "testo": tRow.value("Testo"),
                "description": tRow.value("Description")
            });
        }
    }
    param.pec = peParam;
}

//The purpose of this function is to get all the texts of the "osservazioni" tag from the table "Testi" and add them to the parameters 
function loadAltro() {
    var altroParam = [];
    var table = Banana.document.table("Testi");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (tRow.value("RowId") === "alt" && tRow.value("Testo")) {
            altroParam.push({ "testo": tRow.value("Testo") });
        }
    }
    param.alt = altroParam;
}


//The purpose of this function is to get all the texts of the "allegati" tag from the table "Testi" and add them to the parameters 
function loadAllegati() {
    var allParam = [];
    var table = Banana.document.table("Testi");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (tRow.value("RowId") === "all" && tRow.value("Testo")) {
            allParam.push({ "testo": tRow.value("Testo") });
        }
    }
    param.allParam = allParam;
}


//The purpose of this function is to calculate all the totals and save them into the form
function calcTotals() {

    var totaleBeniMobili = 0;
    var totalePassivo = 0;
    var totalePassivoN = 0;
    var totalePassivoP = 0;
    var totalePassivoTMP = 0;
    var totaleBeniMobiliApertura = 0;
    var totalePassivoApertura = 0;
    var totaleBeniImmobili = Banana.document.currentBalance("Gr=11", param.startDate, param.endDate).balance;
    var totaleBeniImmobiliApertura = Banana.document.currentBalance("Gr=11", param.startDate, param.endDate).opening;

    //Calcolo tot ATTIVO e PASSIVO
    for (var i = 0; i < form.length; i++) {

        if (form[i].account) {

            //Conti con GR = 10
            if (getObject(form, form[i].account).gr === "10") {
                //Se il saldo >= 0, è un attivo
                //Inizio somma dell'apertura/saldo dei beni mobili
                if (Banana.SDecimal.sign(getObject(form, form[i].account).balance) >= 0) {
                    totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObject(form, form[i].account).balance);
                    totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObject(form, form[i].account).opening);
                }
                //Se il saldo < 0, è un passivo
                //Inizio somma dell'apertura/saldo dei passivi
                else if (Banana.SDecimal.sign(getObject(form, form[i].account).balance) < 0) {
                    totalePassivo = Banana.SDecimal.add(totalePassivo, getObject(form, form[i].account).balance);
                    totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObject(form, form[i].account).opening);
                }
            }

            //Conti con GR = 20
            else if (getObject(form, form[i].account).gr === "20") {
                //Se il saldo > 0, è un attivo
                //Viene aggiunto nella somma dell'apertura/saldo dei beni mobili
                //Inizio nuova somma del saldo dei "passivi positivi"
                if (Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {
                    totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObject(form, form[i].account).balance);
                    totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObject(form, form[i].account).opening);
                    totalePassivoP = Banana.SDecimal.add(totalePassivoP, getObject(form, form[i].account).balance);
                }
                //Se il saldo <= 0, è un passivo
                //Inizio nuova somma del saldo dei "passivi negativi"
                else if (Banana.SDecimal.sign(getObject(form, form[i].account).balance) <= 0) {
                    totalePassivoN = Banana.SDecimal.add(totalePassivoN, getObject(form, form[i].account).balance);
                }
                //In ogni caso, sia che si tratti di un GR20>0 oppure di un GR20<=0, viene aggiunto alla somma dell'apertura dei passivi
                totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObject(form, form[i].account).opening);
            }
        }
        else if (form[i].group) {

            //Gruppi con GR = 10
            if (getObjectGroup(form, form[i].group).gr === "10") {
                //Se il saldo >= 0, è un attivo
                //Inizio somma dell'apertura/saldo dei beni mobili
                if (Banana.SDecimal.sign(getObjectGroup(form, form[i].group).balance) >= 0) {
                    totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObjectGroup(form, form[i].group).balance);
                    totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObjectGroup(form, form[i].group).opening);
                }
                //Se il saldo < 0, è un passivo
                //Inizio somma dell'apertura/saldo dei passivi
                else if (Banana.SDecimal.sign(getObjectGroup(form, form[i].group).balance) < 0) {
                    totalePassivo = Banana.SDecimal.add(totalePassivo, getObjectGroup(form, form[i].group).balance);
                    totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObjectGroup(form, form[i].group).opening);
                }
            }

            //Gruppi con GR = 20
            else if (getObjectGroup(form, form[i].group).gr === "20") {
                //Se il saldo > 0, è un attivo
                //Viene aggiunto nella somma dell'apertura/saldo dei beni mobili
                //Inizio nuova somma del saldo dei "passivi positivi"
                if (Banana.SDecimal.sign(getObjectGroup(form, form[i].group).balance) > 0) {
                    totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObjectGroup(form, form[i].group).balance);
                    totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObjectGroup(form, form[i].group).opening);
                    totalePassivoP = Banana.SDecimal.add(totalePassivoP, getObjectGroup(form, form[i].group).balance);
                }
                //Se il saldo <= 0, è un passivo
                //Inizio nuova somma del saldo dei "passivi negativi"
                else if (Banana.SDecimal.sign(getObjectGroup(form, form[i].group).balance) <= 0) {
                    totalePassivoN = Banana.SDecimal.add(totalePassivoN, getObjectGroup(form, form[i].group).balance);
                }
                //In ogni caso, sia che si tratti di un GR20>0 oppure di un GR20<=0, viene aggiunto alla somma dell'apertura dei passivi
                totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObjectGroup(form, form[i].group).opening);
            }
        }
    }

    //Calcolo finale del totale passivo
    totalePassivoTMP = Banana.SDecimal.add(totalePassivoN, totalePassivoP);
    totalePassivo = Banana.SDecimal.add(totalePassivo, totalePassivoTMP);

    //Contabilità semplice
    if (Banana.document.table('Accounts') && Banana.document.table('Categories')) {
        var totaleUsciteGenerali = Banana.document.currentBalance("GrC=30", param.startDate, param.endDate).total;
        totaleUsciteGenerali = Banana.SDecimal.invert(totaleUsciteGenerali);

        var totaleUscitePatrimoniali = Banana.document.currentBalance("GrC=31", param.startDate, param.endDate).total;
        totaleUscitePatrimoniali = Banana.SDecimal.invert(totaleUscitePatrimoniali);

        var totaleEntrateGenerali = Banana.document.currentBalance("GrC=40", param.startDate, param.endDate).total;
        var totaleEntratePatrimoniali = Banana.document.currentBalance("GrC=41", param.startDate, param.endDate).total;

    }
    //Contabilità doppia
    else {
        var totaleUsciteGenerali = Banana.document.currentBalance("Gr=30", param.startDate, param.endDate).total;
        var totaleUscitePatrimoniali = Banana.document.currentBalance("Gr=31", param.startDate, param.endDate).total;

        var totaleEntrateGenerali = Banana.document.currentBalance("Gr=40", param.startDate, param.endDate).total;
        totaleEntrateGenerali = Banana.SDecimal.invert(totaleEntrateGenerali);

        var totaleEntratePatrimoniali = Banana.document.currentBalance("Gr=41", param.startDate, param.endDate).total;
        totaleEntratePatrimoniali = Banana.SDecimal.invert(totaleEntratePatrimoniali);
    }

    //Calcolo i totali
    var totaleAttivo = Banana.SDecimal.add(totaleBeniMobili, totaleBeniImmobili);				//tot attivi
    var totaleSostanzaNetta = Banana.SDecimal.add(totaleAttivo, totalePassivo);					//tot sostanza netta (attivi + passivi)
    var totaleUscite = Banana.SDecimal.add(totaleUsciteGenerali, totaleUscitePatrimoniali);		//tot costi
    var totaleEntrate = Banana.SDecimal.add(totaleEntrateGenerali, totaleEntratePatrimoniali);	//tot ricavi
    var risultatoEsercizio = Banana.SDecimal.subtract(totaleEntrate, totaleUscite);				//risultato d'esecitzio (ricavi - costi)

    var totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, totaleBeniImmobiliApertura);
    totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleSostanzaNettaApertura, totalePassivoApertura);

    //Alla fine salvo tutto nel form. Attenzione che nel caso della contabilita semplice devo invertire i valori del CE
    form.push({ "account": "totBeniMobili", "balance": totaleBeniMobili });
    form.push({ "account": "totBeniImmobili", "balance": totaleBeniImmobili });
    form.push({ "account": "totAttivo", "balance": totaleAttivo });
    form.push({ "account": "totPassivo", "balance": totalePassivo });
    form.push({ "account": "totSostanzaNetta", "balance": totaleSostanzaNetta });
    form.push({ "account": "totSostanzaNettaApertura", "balance": totaleSostanzaNettaApertura });
    form.push({ "account": "totUsciteGenerali", "balance": totaleUsciteGenerali });
    form.push({ "account": "totUscitePatrimoniali", "balance": totaleUscitePatrimoniali });
    form.push({ "account": "totUscite", "balance": totaleUscite });
    form.push({ "account": "totEntrateGenerali", "balance": totaleEntrateGenerali });
    form.push({ "account": "totEntratePatrimoniali", "balance": totaleEntratePatrimoniali });
    form.push({ "account": "totEntrate", "balance": totaleEntrate });
    form.push({ "account": "risEsercizio", "balance": risultatoEsercizio });

}


//The purpose of this function is to convert all the values from the given list to local format
function formatValues(fields) {
    if (param["formatNumber"] === true) {
        for (i = 0; i < form.length; i++) {
            var valueObj = getObject(form, form[i].account);

            for (var j = 0; j < fields.length; j++) {
                valueObj[fields[j]] = Banana.Converter.toLocaleNumberFormat(valueObj[fields[j]]);
            }
        }
    }
}


//The purpose of this function is to return a specific object of the form
function getObject(form, account) {
    for (var i = 0; i < form.length; i++) {
        if (form[i]["account"] === account) {
            return form[i];
        }
    }
    Banana.document.addMessage("Couldn't find object with account: " + account);
}

//The purpose of this function is to return a specific object of the form
function getObjectGroup(form, group) {
    for (var i = 0; i < form.length; i++) {
        if (form[i]["group"] === group) {
            return form[i];
        }
    }
    Banana.document.addMessage("Couldn't find object with group: " + group);
}

//Funzione che verifica che non vi sia una differenza tra risultato d'esecizio da bilancio e risultato d'esercizio da conto economico
function verificaImporti() {

    var utilePerditaEsercizio = getObject(form, "risEsercizio").balance;
    var aperturaSostNetta = getObject(form, "totSostanzaNettaApertura").balance;
    var saldoSostnetta = getObject(form, "totSostanzaNetta").balance;
    var totale = Banana.SDecimal.add(aperturaSostNetta, utilePerditaEsercizio);

    if (totale != saldoSostnetta) {
        var messaggioAvviso = "ATTENZIONE! Differenze. [Sostanza netta]: <" + saldoSostnetta + ">, [Apertura sost.netta + u/p esercizio]: <" + totale + ">";
        form.push({ "warningMessage": messaggioAvviso });
        return true;
    }
}


//Funzione che verifica i GR/GROUP
function verificaGr() {
    var accounts = Banana.document.table("Accounts");
    var controllo = 0;

    //Conti
    for (var i = 0; i < accounts.rowCount; i++) {
        var tRow = accounts.row(i);
        if (tRow.value('Gr') !== '10'
            && tRow.value('Gr') !== '11'
            && tRow.value('Gr') !== '1'
            && tRow.value('Gr') !== '20'
            && tRow.value('Gr') !== '29'
            && tRow.value('Gr') !== '2'
            && tRow.value('Gr') !== '30'
            && tRow.value('Gr') !== '31'
            && tRow.value('Gr') !== '3'
            && tRow.value('Gr') !== '40'
            && tRow.value('Gr') !== '41'
            && tRow.value('Gr') !== '4'
            && tRow.value('Gr') !== '00'
            && tRow.value('Gr') !== '01'
            && tRow.value('Gr') !== '0'
            && tRow.value('Gr') !== ''
            && tRow.value('Gr') !== '50'
            && tRow.value('Gr') !== '60') {
            tRow.addMessage("ERRORE! Gr non valido. Gruppo inesistente.");
            controllo = 1;
        }
    }

    if (controllo == 1) {
        return true;
    } else {
        return false;
    }
}


//This function adds a Footer to the report
function addFooter(report) {
    report.getFooter().addClass("footer");
    report.getFooter().addText("Banana Contabilità Plus, ", "description");
    report.getFooter().addText(param.pageCounterText, "description");
    report.getFooter().addFieldPageNr();
}