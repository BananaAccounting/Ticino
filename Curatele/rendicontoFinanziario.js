// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.script.rendicontofinanziario
// @api = 1.0
// @pubdate = 2015-09-21
// @publisher = Banana.ch SA
// @description = Rendiconto finanziario (art. 410 CC) - II
// @task = app.command
// @doctype = 100.100
// @docproperties = ticino
// @outputformat = none
// @inputdataform = none
// @timeout = -1


var form = [];
var param = {};


function loadParam() {
	param = {
		"reportName":"Rendiconto finanziario - 2017",
		"bananaVersion":"Banana Accounting, v. " + Banana.document.info("Base", "ProgramVersion"),
		"scriptVersion":"script v. 2015-09-21 (TEST VERSION)",
				
		"headerLeft" : Banana.document.info("Base","HeaderLeft"),
		"headerRight" : Banana.document.info("Base","HeaderRight"),
		"startDate" : Banana.document.info("AccountingDataBase","OpeningDate"),
		"endDate" : Banana.document.info("AccountingDataBase","ClosureDate"),

		"company" : Banana.document.info("AccountingDataBase","Company"),
		"courtesy" : Banana.document.info("AccountingDataBase","Courtesy"),
		"name" : Banana.document.info("AccountingDataBase","Name"),
		"familyName" : Banana.document.info("AccountingDataBase","FamilyName"),
		"address1" : Banana.document.info("AccountingDataBase","Address1"),
		"address2" : Banana.document.info("AccountingDataBase","Address2"),
		"zip" : Banana.document.info("AccountingDataBase","Zip"),
		"city" : Banana.document.info("AccountingDataBase","City"),
		"state" : Banana.document.info("AccountingDataBase","State"),
		"country" : Banana.document.info("AccountingDataBase","Country"),
		"web" : Banana.document.info("AccountingDataBase","Web"),
		"email" : Banana.document.info("AccountingDataBase","Email"),
		"phone" : Banana.document.info("AccountingDataBase","Phone"),
		"mobile" : Banana.document.info("AccountingDataBase","Mobile"),
		"fax" : Banana.document.info("AccountingDataBase","Fax"),
		"fiscalNumber" : Banana.document.info("AccountingDataBase","FiscalNumber"),
		"vatNumber" : Banana.document.info("AccountingDataBase","VatNumber"),
		
		"pageCounterText":"Pagina",															//Save the text for the page counter
		//"grColumn" : "Gr1",	leggerlo dalla tab Testi									//Save the GR column (Gr1 or Gr2)
		"rounding" : 2,																		//Speficy the rounding type		
		"formatNumber":true 																//Choose if format number or not
	};
}


function loadForm() {

	var table = Banana.document.table("Accounts");

	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);

		if (tRow.value("Account")) { //Estrazione dati solo quando esiste un conto
			form.push({
				"account" : tRow.value("Account"),
				"group" : tRow.value("Group"),
				"description" : tRow.value("Description"),
				"bClass" : tRow.value("BClass"),
				"gr" : tRow.value("Gr"),
				"opening" : tRow.value("Opening"),
				"balance" : tRow.value("Balance"),
				"docNumero" : tRow.value("DocNumero"),
				"particellaNumero" : tRow.value("ParticellaNumero"),
				"valoreStima" : tRow.value("ValoreStima")
			});
		}
	}
}

function postProcess() {
	return 0;
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

function getObject(form, account) {
	for (var i = 0; i < form.length; i++) {
		if (form[i]["account"] === account) {
			return form[i];
		}
	}
	Banana.document.addMessage("Couldn't find object with account: " + account);
}



function printReport() {
	var report = Banana.Report.newReport(param.reportName);

	//------------------------------------------------------------------------------//
	// 1.	TITOLI, HEADER E FOOTER
	//------------------------------------------------------------------------------//
	//Titoli
	report.addParagraph("Rendiconto finanziario", "titleStyle bordoSinistraSopra");
  	report.addParagraph("(art. 410 CC)", "subtitleStyle bordoSinistra");
  	report.addParagraph(" ");

	//Header
	var pageHeader = report.getHeader();
	pageHeader.addClass("header");
	pageHeader.addText("Autorità Regionale di Protezione no. " + Banana.document.info("FreeTexts","_arn") + ", di "  + Banana.document.info("FreeTexts","_ard"), "header");

	//Footer
	addFooter(report);


	//------------------------------------------------------------------------------//
	// 2.	DATA PERIODO CONTABILE
	//------------------------------------------------------------------------------//
	//creazione tabella per le date
	var tableAccountingDate = report.addTable("table");
    tableRow = tableAccountingDate.addRow();
	tableRow.addCell("Anno " + Banana.Converter.toDate(param.startDate).getFullYear().toString(), "intestazioneStyle");
	tableRow.addCell("Periodo dal " + Banana.Converter.toLocaleDateFormat(param.startDate), "intestazioneStyle");
	tableRow.addCell("Al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");



	//------------------------------------------------------------------------------//
	// 3.	INTESTAZIONE
	//------------------------------------------------------------------------------//
	//Intestazione permette l'inserimento dei dati personali

	//Nome e Cognome concernente
  	report.addParagraph(" ");
  	var tableIntestazioneConcernente = report.addTable("tableIntestazione1");
  	tableIntestazioneConcernente.getCaption().addText("Concernente", "intestazioneStyle");
	tableRow = tableIntestazioneConcernente.addRow();
	tableRow.addCell("Nome: " + param.name, "testoNormale");
	tableRow.addCell("Cognome: " + param.familyName, "testoNormale");
	tableRow = tableIntestazioneConcernente.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	//Nome e Cognome di chi presenta il rapporto
	report.addParagraph(" ");
	var tableIntestazionePresentatoDa = report.addTable("tableIntestazione1");
	tableIntestazionePresentatoDa.getCaption().addText("Presentato da", "intestazioneStyle");
	tableRow = tableIntestazionePresentatoDa.addRow();
	tableRow.addCell("Nome: " + Banana.document.info("FreeTexts", "_npd"), "testoNormale");
	tableRow.addCell("Cognome: " + Banana.document.info("FreeTexts", "_cpd"), "testoNormale");
	tableRow = tableIntestazionePresentatoDa.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	//Curatore/Tutore + no. articolo
	report.addParagraph(" ");
	var tableIntestazioneTipologia = report.addTable("tableIntestazione1");
	tableRow = tableIntestazioneTipologia.addRow();
	tableRow.addCell("In qualità di:", "testoNormale");
	tableRow.addCell("Nominato ai sensi dell'articolo:", "testoNormale");

	tableRow = tableIntestazioneTipologia.addRow();
	tableRow.addCell(Banana.document.info("FreeTexts", "_iqd"), "testoNormale");
	tableRow.addCell(Banana.document.info("FreeTexts", "_art"), "testoNormale");
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
	// 5.	CONT0 ATTIVO
	//------------------------------------------------------------------------------//
	//Crea tabella 
	var tableAttivo = report.addTable("tableAP");  
    tableAttivo.getCaption().addText("Attivo", "intestazioneStyle"); 
	
	//Aggiunge colonne titoli alla tabella
	var tableHeaderAttivo = tableAttivo.getHeader();
	tableRow = tableHeaderAttivo.addRow();	
	
	//Aggiunge i titoli delle varie colonne
	tableRow.addCell("");
	tableRow.addCell("");
	tableRow.addCell("Val. stima (CHF)","intestazioneStyle");
	tableRow.addCell("Importo (CHF)","intestazioneStyle");
	tableRow.addCell("Documento giustificativo","intestazioneStyle");

	//Estrazione dati tabella conto attivo
	var totAttivo = "";
	
	//Cerco tutti gli ATTIVI - IMMOBILI (Gr=11)
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Immobili", " ",5);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "11" && getObject(form, form[i].account).balance > 0) {
			//colonna 2,3 - Part. no/Descrizione, Valore stima
			//Riempimento delle colonne 2 e 3 a seconda che si tratti di "Immobili" oppure di "Beni mobili"	
			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell("Part. no " + getObject(form, form[i].account).particellaNumero);
			tableRow.addCell(getObject(form, form[i].account).valoreStima ,"Amount");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			var current = Banana.document.currentBalance(getObject(form, form[i].account).account).balance;
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

			totAttivo = Banana.SDecimal.add(totAttivo, getObject(form, form[i].account).balance);
		}
	}

	//Cerco tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo POSITIVO
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Beni mobili", " ",5);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "10" && getObject(form, form[i].account).balance > 0) {

			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell(getObject(form, form[i].account).description);
			tableRow.addCell("");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			var current = Banana.document.currentBalance(getObject(form, form[i].account).account).balance;
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

			totAttivo = Banana.SDecimal.add(totAttivo, getObject(form, form[i].account).balance);
		}
	}

	//Cerco tutti i PASSIVI - DEBITI (Gr=2) con saldo POSITIVO
	//Il capitale proprio viene escluso
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "2" && getObject(form, form[i].account).account !== "290" && getObject(form, form[i].account).balance > 0) {

			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell(getObject(form, form[i].account).description);
			tableRow.addCell("");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			var current = Banana.document.currentBalance(getObject(form, form[i].account).account).balance;
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

			totAttivo = Banana.SDecimal.add(totAttivo, getObject(form, form[i].account).balance);
		}
	}

	//Stampo il totale ATTIVO
	printTotal(tableAttivo, totAttivo);

	report.addParagraph(" ");	

	//Richiamo funzione di verifica: in caso di errore viene visualizzato un messaggio sul rendiconto
	verificaImporti();
	report.addParagraph(messaggioAvviso, "warning");

	report.addPageBreak();



	

	//------------------------------------------------------------------------------//
	// 6.	CONT0 PASSIVO
	//------------------------------------------------------------------------------//
	//Aggiunge la tabella al report
	var tablePassivo = report.addTable("tableAP");  
    tablePassivo.getCaption().addText("Passivo", "intestazioneStyle");
	
	//Aggiunge l'header delle colonne
	var tableHeaderPassivo = tablePassivo.getHeader();
	tableRow3 = tableHeaderPassivo.addRow();

	//Aggiunge i titoli delle colonne
	tableRow3.addCell("");
	tableRow3.addCell("");
	tableRow3.addCell("Importo (CHF)","intestazioneStyle");
	tableRow3.addCell("Documento giustificativo","intestazioneStyle");
	
	//Estrazione dati tabella conto passivo
	var totPassivo = "";
	
	//Cerco tutti i PASSIVI - DEBITI (Gr=2) con saldo NEGATIVO escludendo il Capitale Proprio (conto 290)
	tableRow = tablePassivo.addRow();
	tableRow.addCell("Debiti", " ",4);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "2" && getObject(form, form[i].account).account !== "290" && getObject(form, form[i].account).balance < 0) {
			// aggiunge riga alla tabella
			tableRow = tablePassivo.addRow();
			tableRow.addCell("             ");

			//colonna 2 - Descrizione
			tableRow.addCell(getObject(form, form[i].account).description);

			//colonna 3 - Saldo CHF
			//Riempimento della colonna 3 con il saldo in CHF di ogni conto
			var current = Banana.document.currentBalance(getObject(form, form[i].account).account).balance;
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");	

			//colonna 4 - Numero Documento
			//Riempimento della colonna 4 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

			totPassivo = Banana.SDecimal.add(totPassivo, getObject(form, form[i].account).balance);
		}
	}

	//Cerco tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo NEGATIVO
	for (i = 0; i < form.length; i++) {
		if(getObject(form, form[i].account).gr === "10" && getObject(form, form[i].account).balance < 0) {
			// aggiunge riga alla tabella
			tableRow = tablePassivo.addRow();
			tableRow.addCell("             ");

			//colonna 2 - Descrizione
			tableRow.addCell(getObject(form, form[i].account).description);

			//colonna 3 - Saldo CHF
			//Riempimento della colonna 3 con il saldo in CHF di ogni conto
			var current = Banana.document.currentBalance(getObject(form, form[i].account).account).balance;
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");	

			//colonna 4 - Numero Documento
			//Riempimento della colonna 4 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);

			totPassivo = Banana.SDecimal.add(totPassivo, getObject(form, form[i].account).balance);
		}
	}

	//Totale PASSIVO
	printTotal(tablePassivo, totPassivo);

	report.addParagraph(" ");




	//------------------------------------------------------------------------------//
	// 7.	TOTALI => ATTIVO + PASSIVO
	//------------------------------------------------------------------------------//
	//Creazine tabella per i totali
	var tableTot = report.addTable("table");
    tableTot.getCaption().addText("Totali", "intestazioneStyle");

	tableRow = tableTot.addRow();
	tableRow.addCell(" ");
	tableRow.addCell("Importo (CHF)","intestazioneStyle");

	tableRow = tableTot.addRow();
	tableRow.addCell("Totale attivo");
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totAttivo), "Amount");

	tableRow1 = tableTot.addRow();
	tableRow1.addCell("Totale passivo");
	tableRow1.addCell(Banana.Converter.toLocaleNumberFormat(totPassivo), "Amount");

	var sostanzaNetta = Banana.SDecimal.add(totAttivo, totPassivo);
	tableRow2 = tableTot.addRow();
	tableRow2.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");
	tableRow2.addCell(Banana.Converter.toLocaleNumberFormat(sostanzaNetta), "intestazioneStyle Amount");

	report.addParagraph(" ");










	//////////////////////////////////////////////////////////////////////////////////////

	//Print the report
	var stylesheet = CreaStyleSheet1();
	Banana.Report.preview(report, stylesheet);

	return report;
}



//MAIN FUNCTION
function exec(string) {
    
    //versione
	var pubdate = "2015-09-21";

	// check if we are on an opened document
	if (!Banana.document)
		return;
	// var transactions = Banana.document.table('Transactions');
	// if (!transactions)
	// 	return;
	// var categories = Banana.document.table('Categories');
	// if (!categories)
	// 	return;
	// var accounts = Banana.document.table('Accounts');
	// if (!accounts)
	// 	return;



	//variabile per il messaggio di avviso
	messaggioAvviso = "";



	//I 5 steps
	loadParam();
	loadForm();
	postProcess();
	//formatValues(["opening", "balance"]);
	printReport();







}

	


/**
function exec(string) {
	//------------------------------------------------------------------------------//
	// CREAZIONE REPORT
	//------------------------------------------------------------------------------//
	//Titolo, sottotitolo, header e footer

	var report = Banana.Report.newReport("Rendiconto Finanziario");

  	report.addParagraph("Rendiconto finanziario", "titleStyle bordoSinistraSopra");
  	report.addParagraph("(art. 410 CC)", "subtitleStyle bordoSinistra");
  	report.addParagraph(" ");

	//Header
	var pageHeader = report.getHeader();
	pageHeader.addClass("header");
	pageHeader.addText("Autorità Regionale di Protezione no. " + Banana.document.info("FreeTexts","_arn") + ", di "  + Banana.document.info("FreeTexts","_ard"), "header");
	
	//Footer
	var pageFooter = report.getFooter();
	pageFooter.addClass("footer");
	pageFooter.addText("Banana Contabilità, v. " + Banana.document.info("Base", "ProgramVersion") + ", script v. " + pubdate, "footer");






	//------------------------------------------------------------------------------//
	// DATA PERIODO CONTABILE
	//------------------------------------------------------------------------------//
	//creazione tabella per le date
	var tableAccountingDate = report.addTable("table");

	// date di aperture e chiusura del periodo contabile, estratte dalle informazioni del file
	var openingDate = Banana.document.info("AccountingDataBase","OpeningDate");
	var closureDate = Banana.document.info("AccountingDataBase","ClosureDate");
	var year = Banana.Converter.toDate(openingDate).getFullYear();

    //stampa date
    printAccauntingDate(tableAccountingDate, openingDate, closureDate, year);





	//------------------------------------------------------------------------------//
	// INTESTAZIONE
	//------------------------------------------------------------------------------//
	//Intestazione permette l'inserimento dei dati personali

	//Nome e Cognome concernente
  	report.addParagraph(" ");
  	var tableIntestazioneConcernente = report.addTable("tableIntestazione1");
  	tableIntestazioneConcernente.getCaption().addText("Concernente", "intestazioneStyle");
	tableRow = tableIntestazioneConcernente.addRow();
	tableRow.addCell("Nome: " + Banana.document.info("AccountingDataBase", "Name"), "testoNormale");
	tableRow.addCell("Cognome: " + Banana.document.info("AccountingDataBase", "FamilyName"), "testoNormale");
	tableRow = tableIntestazioneConcernente.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	//Nome e Cognome di chi presenta il rapporto
	report.addParagraph(" ");
	var tableIntestazionePresentatoDa = report.addTable("tableIntestazione1");
	tableIntestazionePresentatoDa.getCaption().addText("Presentato da", "intestazioneStyle");
	tableRow = tableIntestazionePresentatoDa.addRow();
	tableRow.addCell("Nome: " + Banana.document.info("FreeTexts", "_npd"), "testoNormale");
	tableRow.addCell("Cognome: " + Banana.document.info("FreeTexts", "_cpd"), "testoNormale");
	tableRow = tableIntestazionePresentatoDa.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	//Curatore/Tutore + no. articolo
	report.addParagraph(" ");
	var tableIntestazioneTipologia = report.addTable("tableIntestazione1");
	tableRow = tableIntestazioneTipologia.addRow();
	tableRow.addCell("In qualità di:", "testoNormale");
	tableRow.addCell("Nominato ai sensi dell'articolo:", "testoNormale");

	tableRow = tableIntestazioneTipologia.addRow();
	tableRow.addCell(Banana.document.info("FreeTexts", "_iqd"), "testoNormale");
	tableRow.addCell(Banana.document.info("FreeTexts", "_art"), "testoNormale");
	report.addParagraph(" ");
	report.addParagraph(" ");






	//------------------------------------------------------------------------------//
	// DATA SITUAZIONE PATRIMONIALE
	//------------------------------------------------------------------------------//
	var tableSituazionePatrimonialeAl = report.addTable("table");
	printSituazionePatrimoniale(tableSituazionePatrimonialeAl, closureDate);
	report.addParagraph(" ");





	//------------------------------------------------------------------------------//
	// CONT0 ATTIVO
	//------------------------------------------------------------------------------//
	//Crea tabella 
	var tableAttivo = report.addTable("tableAP");  
    tableAttivo.getCaption().addText("Attivo", "intestazioneStyle"); 
	
	//Aggiunge colonne titoli alla tabella
	var tableHeaderAttivo = tableAttivo.getHeader();
	tableRow = tableHeaderAttivo.addRow();	
	
	//Aggiunge i titoli delle varie colonne
	tableRow.addCell("");
	tableRow.addCell("");
	tableRow.addCell("Val. stima (CHF)","intestazioneStyle");
	tableRow.addCell("Importo (CHF)","intestazioneStyle");
	tableRow.addCell("Documento giustificativo","intestazioneStyle");

	//Estrazione dati tabella conto attivo
	var totAttivo = "";
	
	//Cerco tutti gli ATTIVI - IMMOBILI (Gr=11)
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Immobili", " ",5);
	for(i=0; i<accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if (tRow.value('Gr') == '11')
		{	
			printAccountAtt(tableAttivo, tRow.value('Account'));
			totAttivo = Banana.SDecimal.add(totAttivo, tRow.value('Balance'));
		}
	}

	//Cerco tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo POSITIVO
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Beni mobili", " ",5);
	for (i=0; i<accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if(tRow.value('Gr')=='10' && tRow.value('Balance')>0)
		{
			printAccountAtt(tableAttivo, tRow.value('Account'));
			totAttivo = Banana.SDecimal.add(totAttivo, tRow.value('Balance'));
		}
	}

	//Cerco tutti i PASSIVI - DEBITI (Gr=2) con saldo POSITIVO
	//Il capitale proprio viene escluso
	for (i=0; i<accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if(tRow.value('Gr')=='2' && tRow.value('Account')!='290' && tRow.value('Balance')>0)
		{
			printAccountAtt(tableAttivo, tRow.value('Account'));
			totAttivo = Banana.SDecimal.add(totAttivo, tRow.value('Balance'));
		}
	}

	//Stampo il totale ATTIVO
	printTotal(tableAttivo, totAttivo);

	report.addParagraph(" ");	

	//Richiamo funzione di verifica Conti-Categorie
	//In caso di errore viene visualizzato un messaggio sul rendiconto
	verificaImporti();
	report.addParagraph(messaggioAvviso, "warning");

	report.addPageBreak();







	//------------------------------------------------------------------------------//
	// CONT0 PASSIVO
	//------------------------------------------------------------------------------//
	//Aggiunge la tabella al report
	var tablePassivo = report.addTable("tableAP");  
    tablePassivo.getCaption().addText("Passivo", "intestazioneStyle");
	
	//Aggiunge l'header delle colonne
	var tableHeaderPassivo = tablePassivo.getHeader();
	tableRow3 = tableHeaderPassivo.addRow();

	//Aggiunge i titoli delle colonne
	tableRow3.addCell("");
	tableRow3.addCell("");
	tableRow3.addCell("Importo (CHF)","intestazioneStyle");
	tableRow3.addCell("Documento giustificativo","intestazioneStyle");
	
	//Estrazione dati tabella conto passivo
	var totPassivo = "";
	
	//Cerco tutti i PASSIVI - DEBITI (Gr=2) con saldo NEGATIVO escludendo il Capitale Proprio (conto 290)
	tableRow = tablePassivo.addRow();
	tableRow.addCell("Debiti", " ",4);
	for ( i=0; i< accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if (tRow.value('Gr')=='2' && tRow.value('Account')!='290' && tRow.value('Balance')<0)
		{
			printAccountPass(tablePassivo, tRow.value('Account'));
			totPassivo = Banana.SDecimal.add(totPassivo, tRow.value('Balance'));
		}
	}

	//Cerco tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo NEGATIVO
	for ( i=0; i< accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if(tRow.value('Gr')=='10' && tRow.value('Balance')<0)
		{
			printAccountPass(tablePassivo, tRow.value('Account'));
			totPassivo = Banana.SDecimal.add(totPassivo, tRow.value('Balance'));
		}
	}

	//Totale PASSIVO
	printTotal(tablePassivo, totPassivo);

	report.addParagraph(" ");







	//------------------------------------------------------------------------------//
	// TOTALI => ATTIVO + PASSIVO
	//------------------------------------------------------------------------------//
	//Creazine tabella per i totali
	var tableTot = report.addTable("table");
    tableTot.getCaption().addText("Totali", "intestazioneStyle");

	printSostanzaNetta(tableTot, totAttivo, totPassivo, closureDate);
	
	report.addParagraph(" ");






	//------------------------------------------------------------------------------//
	// OSSERVAZIONI
	//------------------------------------------------------------------------------//
	//Creazione dello spazio riservato alle eventuali osservazioni, da inserire manualmente
	var sezioneOss = report.addSection(" ", "bottom2em");

	sezioneOss.addParagraph("Osservazioni o informazioni supplementari", "intestazioneStyle");
	sezioneOss.addParagraph("ev. debiti verso l'Ufficio del sostegno sociale e dell'inserimento (doc. no. )", "bordoSinistraSopra");
	sezioneOss.addParagraph(" ", "bordoSinistra");
	sezioneOss.addParagraph(Banana.document.info("FreeTexts", "_oss"), "bordoSinistra");
	sezioneOss.addParagraph(Banana.document.info("FreeTexts", "_oss"), "bordoSinistra");
	sezioneOss.addParagraph(Banana.document.info("FreeTexts", "_oss"), "bordoSinistra");
	sezioneOss.addParagraph(" ");
	sezioneOss.addParagraph(" ");






	//------------------------------------------------------------------------------//
	// MOVIMENTI FINANZIARI
	//------------------------------------------------------------------------------//	
	//Date apertura/chiusura movimenti finanziari
	var openingDateMovimenti = Banana.document.info("AccountingDataBase","OpeningDate");
	var closureDateMovimenti = Banana.document.info("AccountingDataBase","ClosureDate");
	
	//Entrate
	var totEntrateGenerali = Banana.document.table('Categories').findRowByValue('Group','40').value('Balance');
	var utiliPatrimoniali = Banana.document.table('Categories').findRowByValue('Group','41').value('Balance');
	var totEntrate = Banana.document.table('Categories').findRowByValue('Group','4').value('Balance');

	//Uscite
	var totUsciteGenerali = Banana.document.table('Categories').findRowByValue('Group','30').value('Balance');
	var perditePatrimoniali = Banana.document.table('Categories').findRowByValue('Group','31').value('Balance');
	var totUscite = Banana.document.table('Categories').findRowByValue('Group','3').value('Balance');

	//Utile/Perdita
	var utileEsercizio = Banana.document.table('Categories').findRowByValue('Group','00').value('Balance');
	var aperturaSostNetta = Banana.document.table('Accounts').findRowByValue('Group','00').value('Opening');
	var totSostanzaNetta = Banana.SDecimal.add(aperturaSostNetta, utileEsercizio);

	//Tabella Data movimenti finanziari
	var tableDataMovimentiFinanziari = report.addTable("table");
	tableRow = tableDataMovimentiFinanziari.addRow();
	tableRow.addCell("Movimenti finanziari dal " + Banana.Converter.toLocaleDateFormat(openingDateMovimenti), "intestazioneStyle");
	tableRow.addCell("Al " + Banana.Converter.toLocaleDateFormat(closureDateMovimenti), "intestazioneStyle");
	report.addParagraph(" ");

	//Tabella Movimenti Finanziari 
	var tableMovimentiFinanziari = report.addTable("tableConti");
	printMovimentiFinanziari(
		tableMovimentiFinanziari, 
		totEntrateGenerali,
		utiliPatrimoniali,
		totEntrate, 
		totUsciteGenerali, 
		perditePatrimoniali,
		totUscite, 
		utileEsercizio, 
		aperturaSostNetta, 
		totSostanzaNetta, 
		closureDate
	);

	report.addPageBreak();







	//------------------------------------------------------------------------------//
	// FIRME
	//------------------------------------------------------------------------------//
	//Creazione della quarta pagina dedicata alle firme
	report.addParagraph(" ");
	report.addParagraph("Firma (se non viene firmato dall'interessato indicarne i motivi)", "testoFirma bordoSinistraSopra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" " ,"bordoSinistra");
	report.addParagraph(" ");

	//Firma del tutelato/curatelato e del tutore/curatore
	var tableFirma2 = report.addTable("tableIntestazione1");

	tableRow = tableFirma2.addRow();
	tableRow.addCell("Il tutelato/curatelato (ev parenti prossimi)");
	tableRow.addCell("Il tutore/curatore");

	tableRow = tableFirma2.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	tableRow = tableFirma2.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	tableRow = tableFirma2.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	//Allegati
	report.addParagraph(" ");
	report.addParagraph("Allegati:", "testoFirma bordoSinistraSopra");
	report.addParagraph(" " , "bordoSinistra");
	report.addParagraph(" - " , "testoFirmaAllegati bordoSinistra");
	report.addParagraph(" " , "bordoSinistra");
	report.addParagraph(" - " , "testoFirmaAllegati bordoSinistra");
	report.addParagraph(" " , "bordoSinistra");
	report.addParagraph(" - " , "testoFirmaAllegati bordoSinistra");

	report.addPageBreak();






	//------------------------------------------------------------------------------//
	// RETRO PAGINA FIRME
	//------------------------------------------------------------------------------//
	var paragraph = report.addParagraph("","bordoSinistraSopra");
	paragraph.addText("L'Autorità Regionale di Protezione no. ", "testoNormale");

	var paragraph1 = report.addParagraph("","bordoSinistra");
	paragraph1.addText("di ", "testoNormale");	

	var paragraph2 = report.addParagraph("","bordoSinistra");
	paragraph2.addText("nella seduta del ", "testoNormale");

	var paragraph3 = report.addParagraph("","bordoSinistra");
	paragraph3.addText("ris. ", "testoNormale");
	report.addParagraph(" ", "bordoSinistra");

	var paragraph4 = report.addParagraph("","bordoSinistra");
	paragraph4.addText("ha accertato la regolarità della gestione ed ha constatato che la sostanza è amministrata e collocata in modo conforme. Ha verificato che tutte le entrate dell'interessato figurano nel rendiconto per il loro effettivo ammontare o valore; che le spese effettuate sono conformi alla situazione finanziaria dell'interessato ed ai suoi bisogni; che per le spese esiste il relativo documento giustificativo.", "testoNormale");

	report.addParagraph(" ", "bordoSinistra");
	var paragraph5 = report.addParagraph("","bordoSinistra");
	paragraph5.addText("L'Autorità Regionale di Protezione ha inoltre preso atto delle risultanze del rendiconto e delle considerazioni esposte dal tutore/curatore e formula le seguenti osservazioni:", "testoNormale");

	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");

	var paragraph6 = report.addParagraph("","bordoSinistra");
	paragraph6.addText("Visto quanto precede e richiamati gli art. 408 e segg. CC, 24 e 25 ROPMA, OABCT", "testoNormale");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph(" ");
	report.addParagraph(" ");
	// fine prima parte


	report.addParagraph("Risolve", "titoliRetroPagFirme");
	var tableRisolve = report.addTable("tableIstruzioni");

  	tableRow = tableRisolve.addRow();
    tableRow.addCell("1.");
    tableRow.addCell("Il rendiconto finanziario è approvato.", "testo");

  	tableRow = tableRisolve.addRow();
    tableRow.addCell("2.");
    tableRow.addCell("E' riconosciuta al tutore/curatore la mercede di CHF ", "testoNormaleBold");
     
    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("e le spese di CHF ", "testoNormaleBold");
      	
    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("che sono poste a carico ", "testoNormaleBold");
      	
    tableRow = tableRisolve.addRow();
    tableRow.addCell("3.");
	tableRow.addCell("__ Le spese e la tassa della presente decisione per complessivi CHF                             sono a carico dell'interessato;", "testo");
	
    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("__ non vengono prelevate tasse né spese.", "testo");
      	
    tableRow = tableRisolve.addRow();
    tableRow.addCell("4.");
    tableRow.addCell("Contro la presente decisione può essere inoltrato reclamo alla Camera di protezione del Tribunale d'appello,", "testo");
    tableRow = tableRisolve.addRow();
    tableRow.addCell("");
    tableRow.addCell("Via Bossi 2a, 6901 Lugano, entro 30 giorni dall'intimazione.", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell("5.");
    tableRow.addCell("Intimazione e comunicazione", "testo");
      	
    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- al tutore / curatore", "testo");
      	
    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- all'interessato", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- alla Camera di protezione del Tribunale d'appello, Lugano", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testo");

    tableRow = tableRisolve.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- ", "testo");

	report.addParagraph(" ");
	report.addParagraph(" ");
	//fine seconda parte


	report.addParagraph("Per l'Autorità Regionale di Protezione", "titoliRetroPagFirme");
  	var tableFirma3 = report.addTable("tableIntestazione1");
	tableRow = tableFirma3.addRow();
	tableRow.addCell("Il presidente: ");
	tableRow.addCell("Il segretario: ");
	tableRow = tableFirma3.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");

	report.addParagraph(" ");
  	var tableFirma4 = report.addTable("tableIntestazione1");
	tableRow = tableFirma4.addRow();
	tableRow.addCell("Luogo e data: ");
	tableRow.addCell("Timbro: ");
	tableRow = tableFirma4.addRow();
	tableRow.addCell(" ");
	tableRow.addCell(" ");
	//fine terza parte

	report.addPageBreak();







	//------------------------------------------------------------------------------//
	// TESTO - ISTRUZIONI PER I TUTORI/CURATORI
	//------------------------------------------------------------------------------//
	//Testo ultima pagina, in una tabella per una piu' facile formattazione del testo	
	var tableIstruzioni = report.addTable("tableIstruzioni");  
    tableIstruzioni.getCaption().addText("Istruzioni per i tutori / curatori", "intestazioneStyle"); 
    
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("1.");
    tableRow.addCell("Il rendiconto, debitamente firmato, deve essere trasmesso con i documenti giustificativi, che risaranno restituiti, all'Autorità regionale di protezione entro il mese di febbraio, salvo proroga autorizzata, in tante copie quante richieste dalla stessa autorità.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("2.");
    tableRow.addCell("Il rendiconto deve specificare le entrate e le uscite della gestione cui si riferisce nelle rispettive colonne entrate d'esercizio e uscite d'esercizio.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("3.");
    tableRow.addCell("Salvo quelle di minima importanza, le spese devono essere giustificate dal relativo documento (ricevuta ecc.) numerato e unito al rendiconto.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("4.");
    tableRow.addCell("Con il rendiconto devono essere trasmessi all'Autorità regionale di protezione i documenti (certificati di deposito ecc.) atti a comprovare il deposito dei capitali, titoli, valori, ecc. Gli stessi saranno restituiti al tutore/curatore con la crescita in giudicato della decisione di approvazione del rendiconto.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("5.");
    tableRow.addCell("I tutori/curatori devono fare speciale menzione delle operazioni eccedenti l'ordinaria amministrazione, segnatamente di quelle contemplate all'art. 416 CC (compera o vendita di beni immobili, costituzione di pegno, contratti di affitto o di locazione, ecc.).", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("6.");
    tableRow.addCell("Il tutore/curatore sottopone il rendiconto finanziario e morale all'esame dell'interessato, se capace di discernimento ed abbia compiuto i 16 anni, e lo invita ad apporvi il suo visto. Se ciò non avviene il tutore ne dà motivazione.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("7.");
    tableRow.addCell("I tutori/curatori devono presentare un rapporto sulle condizioni fisiche, intellettuali e morali del tutelato/curatelato delle prospettive e dei progetti per il prossimo anno di esercizio (cfr. modulo rapporto morale).", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("8.");
    tableRow.addCell("Vanno iscritti al passivo le procedure esecutive e gli attestati carenza beni risultanti dall'estratto rilasciato, gratuitamente, dall'ufficio esecuzioni e fallimenti. È opportuno, a fine anno, chiedere un aggiornamento della situazione al 31.12. perché esistono debiti che diventano procedure esecutive (l'importo aumenta a seguito degli interessi e delle spese esecutive) e procedure che diventano attestati di carenza beni.", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("Le variazioni dell'importo delle procedure esecutive, a fine esercizio, vanno riportate nel conto esercizio (utile patrimoniale se diminuiscono, perdita patrimoniale se aumentano).", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("9.");
    tableRow.addCell("Utili patrimoniali: vanno indicati tutti i redditi e le entrate provenienti da sostanza e, in particolare:", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- interessi sui conti bancari (al lordo dell'imposta preventiva che andrà iscritta quale credito all'attivo della sostanza)", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- aumento di valore degli investimenti bancari (salvo per le obbligazioni che, nonostante il corso, vanno sempre indicate al valore nominale)", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- affitti di proprietà immobiliari ", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- entrate straordinarie e irripetibili, ad esempio ricavi da successioni, eredità, donazioni, vincite ecc.", "testoNormale");
    tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- aumenti di valore della sostanza immobiliare per revisione delle stime (nel caso di riattazioni o ristrutturazioni limitatamente alla differenza tra l'investimento e l'aumento del valore)", "testoNormale");
	tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
	tableRow.addCell("- differenza, nel caso di alienazione di un immobile, fra il valore di stima e quello effettivamente incassato.", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("10.");
    tableRow.addCell("Perdite patrimoniali: vanno indicati a questa posizione, in particolare,", "testoNormale");
	tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- le diminuzioni di valore degli investimenti bancari (ad esempio delle azioni o dei fondi di investimento)", "testoNormale");
	tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- la differenza tra l'investimento effettuato per ristrutturare un immobile e l'aumento di valore di stima immobiliare: normalmente quest'ultimo è inferiore", "testoNormale");
	tableRow = tableIstruzioni.addRow();
    tableRow.addCell(" ");
    tableRow.addCell("- la diminuzione del valore di stima degli immobili, conseguente per esempio ad una revisione delle stime", "testoNormale");

    tableRowEmpty = tableIstruzioni.addRow();
	tableRowEmpty.addCell(" ");

    tableRow = tableIstruzioni.addRow();
    tableRow.addCell("11");
    tableRow.addCell("Gli ammortamenti ipotecari o di altri debiti non vanno iscritti alle uscite come spesa di esercizio in quanto alla diminuzione di liquidità corrisponde una identica diminuzione del debito.", "testoNormaleBold");


    //Norme legali
	report.addParagraph(" ", "bordoSinistra");
	report.addParagraph("Norme legali", "intestazioneStyleUnderline bordoSinistra");

	var paragraph11 = report.addParagraph("","bordoSinistra");
	paragraph11.addText("Codice civile svizzero = CC; Legge sull'organizzazione e la procedura in materia di protezione del minore e dell'adulto; Regolamento della legge sull'organizzazione e la procedura in materia di protezione del minore e dell'adulto (ROPMA).", "testoNormale");
	report.addParagraph(" ", "bordoSinistra");

	var tableIstruzioni2 = report.addTable("tableNormeLegali");  
	tableRow = tableIstruzioni2.addRow();
    tableRow.addCell("Rendiconti:", "testo");
    tableRow.addCell("art. 410 CC, art. 24-25 ROPMA", "testo");

	tableRow = tableIstruzioni2.addRow();
    tableRow.addCell("Tutele:", "testo");
    tableRow.addCell("art. 327a - 327c, 405 - 418 CC", "testo");

	tableRow = tableIstruzioni2.addRow();
    tableRow.addCell("Curatele:", "testo");
    tableRow.addCell("art. 400 - 418 CC", "testo");
	
	tableRow = tableIstruzioni2.addRow();
    tableRow.addCell("Responsabilità:", "testo");
    tableRow.addCell("art. 454 - 456 CC.", "testo");
    //fine testo









	//------------------------------------------------------------------------------//
	// CREAZIONE/STAMPA DEL REPORT
	//------------------------------------------------------------------------------//
	
	// Styles
	var stylesheet = CreaStyleSheet1();

	//Verifica degli importi e chiede all'utente in caso di errore se continuare o meno.
	if(verificaImporti()){
		if(Banana.Ui.showQuestion("", "ATTENZIONE! Differenza tra Conti e Categorie. Continuare?")){
			messaggioAvviso = "ATTENZIONE! Differenza tra Conti e Categorie.";

			//Stampa il rendiconto finanziario
			Banana.Report.preview(report, stylesheet);
		}
	}
	else if(!verificaGr(accounts,categories)){

	 	//Stampa il rendiconto finanziario
		Banana.Report.preview(report, stylesheet);
	}


} //end exex
*/









//------------------------------------------------------------------------------//
// FUNZIONI
//------------------------------------------------------------------------------//

//Stampa Conti Attivo
function printAccountAtt(table, account) {	
	// aggiunge riga alla tabella
	tableRow = table.addRow();
	tableRow.addCell("                      ");

	// //colonna 2,3 - Part. no/Descrizione, Valore stima
	// //Riempimento delle colonne 2 e 3 a seconda che si tratti di "Immobili" oppure di "Beni mobili"	
	// if(Banana.document.table('Accounts').findRowByValue('Account',account).value('Gr') =='11'){
	// 	tableRow.addCell("Part. no " + Banana.document.table('Accounts').findRowByValue('Account',account).value('ParticellaNumero'));
	// 	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(Banana.document.table('Accounts').findRowByValue('Account',account).value('ValoreStima')) ,"Amount");
	// }
	// else {
	// 	tableRow.addCell(Banana.document.table('Accounts').findRowByValue('Account',account).value('Description'));
	// 	tableRow.addCell("");
	// }

	// //colonna 4 - Saldo CHF
	// //Riempimento della colonna 4 con il saldo in CHF di ogni conto
	// var current = Banana.document.currentBalance(account).balance;
	// tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");	

	// //colonna 5 - Numero Documento
	// //Riempimento della colonna 5 con il numero del documento
	// tableRow.addCell("Doc. no " + Banana.document.table('Accounts').findRowByValue('Account',account).value('DocNumero'));



	// aggiunge riga alla tabella
	tableRow = table.addRow();
	tableRow.addCell("                      ");
	for (var i = 0; i < form.length; i++) {
		//colonna 2,3 - Part. no/Descrizione, Valore stima
		//Riempimento delle colonne 2 e 3 a seconda che si tratti di "Immobili" oppure di "Beni mobili"	
		if(getObject(form, form[i].account).gr === "11") {
			tableRow.addCell("Part. no " + getObject(form, form[i].account).particellaNumero);
			tableRow.addCell(getObject(form, form[i].account).valoreStima ,"Amount");

		} else {
			tableRow.addCell(getObject(form, form[i].account).description);
			tableRow.addCell("");
		}

		//colonna 4 - Saldo CHF
		//Riempimento della colonna 4 con il saldo in CHF di ogni conto
		var current = Banana.document.currentBalance(account).balance;
		tableRow.addCell(current,"Amount");

		//colonna 5 - Numero Documento
		//Riempimento della colonna 5 con il numero del documento
		tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
	}
}





//Stampa Conti Passivo
function printAccountPass(table, account) {	
	// aggiunge riga alla tabella
	tableRow = table.addRow();
	tableRow.addCell("             ");

	//colonna 2 - Descrizione
	tableRow.addCell(Banana.document.table('Accounts').findRowByValue('Account',account).value('Description'));

	//colonna 3 - Saldo CHF
	//Riempimento della colonna 3 con il saldo in CHF di ogni conto
	var current = Banana.document.currentBalance(account).balance;
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current),"Amount");	

	//colonna 4 - Numero Documento
	//Riempimento della colonna 4 con il numero del documento
	tableRow.addCell("Doc. no " + Banana.document.table('Accounts').findRowByValue('Account',account).value('DocNumero'));
}





//Categorie
function printCategory(table, account) {	
	// add a row to the table
	tableRow = table.addRow();
	// add first column with group
	tableRow.addCell(account);
	// retrieve account description and add to second column
	tableRow.addCell(Banana.document.table('Categories').findRowByValue('Category',account).value('Description'));
	// get total movement for the account
	var current = Banana.document.currentBalance(account).total;
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(current), 'Amount');
}





// // Stampa il periodo del rendiconto
// function printAccauntingDate(table, openingDate, closureDate, year){
// 	tableRow = table.addRow();
// 	tableRow.addCell("Anno " + year.toString(), "intestazioneStyle");
// 	tableRow.addCell("Periodo dal " + Banana.Converter.toLocaleDateFormat(openingDate), "intestazioneStyle");
// 	tableRow.addCell("Al " + Banana.Converter.toLocaleDateFormat(closureDate), "intestazioneStyle");
// }




// // Stampa la data della situazione patrimoniale
// function printSituazionePatrimoniale(table, date){
// 	tableRow = table.addRow();
// 	tableRow.addCell("Situazione patrimoniale al " + Banana.Converter.toLocaleDateFormat(date), "intestazioneStyle");
// }




// Stampa il totale dei conti
function printTotal(table, total){
	tableRowEmpty = table.addRow();
	tableRowEmpty.addCell(" ", " ", 5);
	tableRow = table.addRow();
	tableRow.addCell("Totale (CHF)", "intestazioneStyle", 3);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(total), "intestazioneStyle Right", 2);
}




// Stampa i totali di ATTIVI e PASSIVI (SOSTANZA NETTA)
function printSostanzaNetta(table, totAttivo, totPassivo, date){
	tableRow = table.addRow();
	tableRow.addCell(" ");
	tableRow.addCell("Importo (CHF)","intestazioneStyle");

	tableRow = table.addRow();
	tableRow.addCell("Totale attivo");
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totAttivo), "Amount");

	tableRow1 = table.addRow();
	tableRow1.addCell("Totale passivo");
	tableRow1.addCell(Banana.Converter.toLocaleNumberFormat(totPassivo), "Amount");

	var sostanzaNetta = Banana.SDecimal.add(totAttivo, totPassivo);
	tableRow2 = table.addRow();
	tableRow2.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(date), "intestazioneStyle");
	tableRow2.addCell(Banana.Converter.toLocaleNumberFormat(sostanzaNetta), "intestazioneStyle Amount");
}




//Stampa tabella Movimenti Finanziari
function printMovimentiFinanziari(table, totEntrateGenerali, utiliPatrimoniali, totEntrate, totUsciteGenerali, perditePatrimoniali, totUscite, utileEsercizio, aperturaSostNetta, totSostanzaNetta, date){
	//Conto esercizio
	tableRow0 = table.addRow();
	tableRow0.addCell(" ");
	tableRow0.addCell("Importo (CHF)", "intestazioneStyle");
	tableRow0.addCell("Importo (CHF)", "intestazioneStyle");

	tableRow1 = table.addRow();
	tableRow1.addCell("Conto esercizio", "intestazioneStyle", 3);

	tableRow2 = table.addRow();
	tableRow2.addCell("Totale entrate", "intestazioneStyle");
	tableRow2.addCell(Banana.Converter.toLocaleNumberFormat(totEntrateGenerali) ,"Amount");
	tableRow2.addCell(" ");
	
	tableRow3 = table.addRow();
	tableRow3.addCell("Utili patrimoniali (cfr. istruzione punto 9)");
	tableRow3.addCell(Banana.Converter.toLocaleNumberFormat(utiliPatrimoniali), "Amount");
	tableRow3.addCell(Banana.Converter.toLocaleNumberFormat(totEntrate), "Amount");

	tableRowEmpty = table.addRow();
	tableRowEmpty.addCell(" ", " ", 3);

	tableRow4 = table.addRow();
	tableRow4.addCell("Totale uscite", "intestazioneStyle");
	tableRow4.addCell(Banana.Converter.toLocaleNumberFormat(totUsciteGenerali), "Amount");
	tableRow4.addCell(" ");
	
	tableRow5 = table.addRow();
	tableRow5.addCell("Perdite patrimoniali (cfr. istruzione punto 10)");
	tableRow5.addCell(Banana.Converter.toLocaleNumberFormat(perditePatrimoniali), "Amount");
	tableRow5.addCell(Banana.Converter.toLocaleNumberFormat(totUscite), "Amount totalStyle");

	tableRowEmpty1 = table.addRow();
	tableRowEmpty1.addCell(" ", " ", 3);

	tableRow6 = table.addRow();
	tableRow6.addCell("Utile/perdita d'esercizio", "intestazioneStyle ", 2);
	tableRow6.addCell(Banana.Converter.toLocaleNumberFormat(utileEsercizio), "intestazioneStyle Amount");
	

	//Conto patrimoniale
	tableRow12 = table.addRow();
	tableRow12.addCell(" ", " ", 3);

	tableRow7 = table.addRow();
	tableRow7.addCell("Conto patrimoniale", "intestazioneStyle", 3);

	tableRow8 = table.addRow();
	tableRow8.addCell("Riportare sostanza netta anno precedente (o inventario)", " ", 2);
	tableRow8.addCell(Banana.Converter.toLocaleNumberFormat(aperturaSostNetta), "Amount");

	tableRow9 = table.addRow();
	tableRow9.addCell("Ev. modifiche e/o rettifiche, da precisare nelle osservazioni", " ", 3);

	tableRow10 = table.addRow();
	tableRow10.addCell("Utile perdita d'esercizio (+/-)", "intestazioneStyle", 2);
	tableRow10.addCell(Banana.Converter.toLocaleNumberFormat(utileEsercizio), "Amount totalStyle");

	tableRowEmpty2 = table.addRow();
	tableRowEmpty2.addCell(" ", " ", 3);

	tableRow11 = table.addRow();
	tableRow11.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(date), "intestazioneStyle", 2);
	tableRow11.addCell(Banana.Converter.toLocaleNumberFormat(totSostanzaNetta), "intestazioneStyle Amount");
}






//Funzione che verifica che non vi sia una differenza tra CONTI e CATEGORIE.
function verificaImporti(){
	var aperturaSostNetta = Banana.document.table('Accounts').findRowByValue('Group','00').value('Opening');
	var utilePerditaEsercizio = Banana.document.table('Accounts').findRowByValue('Group','00').value('Balance');
	var saldoSostnetta = Banana.document.table('Accounts').findRowByValue('Group','00').value('Balance');
	var totale = Banana.SDecimal.add(aperturaSostNetta, utilePerditaEsercizio);

	if(totale != saldoSostnetta)
	{
		messaggioAvviso = "ATTENZIONE! Differenze..."
		return true;
	}


	// var aperturaSostNetta = Banana.document.table('Accounts').findRowByValue('Group','00').value('Opening');
	// var utilePerditaEsercizio = Banana.document.table('Categories').findRowByValue('Group','00').value('Balance');
	// var saldoSostnetta = Banana.document.table('Accounts').findRowByValue('Group','00').value('Balance');
	// var totale = Banana.SDecimal.add(aperturaSostNetta, utilePerditaEsercizio);

	// if(totale != saldoSostnetta)
	// {
	// 	messaggioAvviso = "ATTENZIONE! Differenza tra Conti e Categorie."
	// 	return true;
	// }
}






//Funzione che verifica i GR/GROUP
function verificaGr(accounts, categories){
	
	var controllo = 0;
	var controllo1 = 0;

	//Conti
	for (i=0; i< accounts.rowCount; i++)
	{
		var tRow = accounts.row(i);
		if(tRow.value('Gr')!='10' 
			&& tRow.value('Gr')!='11' 
			&& tRow.value('Gr')!='2' 
			&& tRow.value('Gr')!='1' 
			&& tRow.value('Gr')!='00' 
			&& tRow.value('Gr')!=''
			)
		{
			tRow.addMessage("ERRORE! Gr non valido. Gruppo inesistente.");
			controllo = 1;
		}
	}

	//Categorie
	for (i=0; i< categories.rowCount; i++)
	{
		var tRow = categories.row(i);
		if(tRow.value('Gr')!='30' 
			&& tRow.value('Gr')!='31' 
			&& tRow.value('Gr')!='3' 
			&& tRow.value('Gr')!='40' 
			&& tRow.value('Gr')!='41' 
			&& tRow.value('Gr')!='4'
			&& tRow.value('Gr')!='00'
			&& tRow.value('Gr')!=''
			)
		{
			tRow.addMessage("ERRORE! Gr non valido. Gruppo inesistente.");
			controllo1 = 1;
		}
	}
	if(controllo==1 && controllo1==1){
		return true;
	}
	else if(controllo==1 && controllo1==0){
		return true;
	}
	else if(controllo==0 && controllo1==1){
		return true;
	}
	else if(controllo==0 && controllo1==0){
		return false;
	}
} 




//This function adds a Footer to the report
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText(param.bananaVersion + ", " + param.scriptVersion + ", ", "description");
   report.getFooter().addText(param.pageCounterText + " ", "description");
   report.getFooter().addFieldPageNr();
}


//Creazione degli stili
function CreaStyleSheet1() {

	//------------------------------------------------------------------------------//
	// GENERALI
	//------------------------------------------------------------------------------//
	
	var docStyles = Banana.Report.newStyleSheet();
	
	var pageStyle = docStyles.addStyle("@page");
  	pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");

	style = docStyles.addStyle("thead");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");
	
	style = docStyles.addStyle(".Amount");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "right");
	
	//Header
	style = docStyles.addStyle(".header");
	style.setAttribute("font-size", "8pt");
	style.setAttribute("text-align", "right");

	//Footer
	style = docStyles.addStyle(".footer");
	style.setAttribute("font-size", "8pt");
	style.setAttribute("text-align", "right");
    
    //Title
	style = docStyles.addStyle(".titleStyle");
	style.setAttribute("font-size", "18");
	style.setAttribute("text-align", "left");

	//Subtitle
	style = docStyles.addStyle(".subtitleStyle");
	style.setAttribute("font-size", "14");
	style.setAttribute("text-align", "left");

	//Impostazione ultima pagina
	docStyles.addStyle(".chapterStyle", "font-size:11; margin-top:2em; margin-bottom:0.2em");

	//Testo ultima pagina - Numeri
	style = docStyles.addStyle(".testo");
	style.setAttribute("font-size", "9");
	style.setAttribute("padding-left", "22px");
  	style.setAttribute("text-indent", "-22px");

	//Titoletti intestazione
	style = docStyles.addStyle(".intestazioneStyle");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");

	//Titoletti intestazione sottolineato
	style = docStyles.addStyle(".intestazioneStyleUnderline");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("text-decoration", "underline");

	//Testo Norme legali
	style = docStyles.addStyle(".testoNormale");
	style.setAttribute("font-size", "9");

	//Titolo data "situazine patrimoniale al"
	style = docStyles.addStyle(".intestazioneStyle");
	style.setAttribute("font-size", "11pt");
	style.setAttribute("font-weight", "bold");

	//Allinea a dx il testo
	style = docStyles.addStyle(".Right");
	style.setAttribute("text-align", "right");

	//Allinea a dx il testo
	style = docStyles.addStyle(".Left");
	style.setAttribute("text-align", "left");

	//Allinea a sx il saldo CHF dei conti per non sfasare la parola "CHF"
	style = docStyles.addStyle(".saldoChf");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "left");	

	//Totale sottolineato
	style = docStyles.addStyle(".totalStyle");
  	style.setAttribute("text-decoration", "double-underline");

  	//Bordo Sinistra + sopra
  	style = docStyles.addStyle(".bordoSinistraSopra");
  	style.setAttribute("border-top","thin solid black");
  	style.setAttribute("border-left","thin solid black");

  	//Bordo sinistra
  	style = docStyles.addStyle(".bordoSinistra");
  	style.setAttribute("border-left","thin solid black");

  	//Titoli retro pagina firme
	style = docStyles.addStyle(".titoliRetroPagFirme");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "center");
	style.setAttribute("font-weight", "bold");	

	//Testo bold
	style = docStyles.addStyle(".testoBold");
	style.setAttribute("font-size", "9");
	style.setAttribute("padding-left", "22px");
  	style.setAttribute("text-indent", "-22px");
  	style.setAttribute("font-weight", "bold");

  	//Testo normale bold	
	style = docStyles.addStyle(".testoNormaleBold");
	style.setAttribute("font-size", "9");
  	style.setAttribute("font-weight", "bold");

  	//Testo Firme
	style = docStyles.addStyle(".testoFirma");
	style.setAttribute("font-size", "10");
	style.setAttribute("padding-left", "5px");
	style.setAttribute("padding-top", "5px");
  	
  	//Testo Firme - Elementi allegati
	style = docStyles.addStyle(".testoFirmaAllegati");
	style.setAttribute("font-size", "10");
	style.setAttribute("padding-left", "20px");

	//margini per le osservazioni
	style = docStyles.addStyle(".bottom2em");
	style.setAttribute("margin-bottom", "2em");

	//Warning per il messaggio di differenza conti-categorie
  	style = docStyles.addStyle(".warning");
  	style.setAttribute("font-size", "10");
  	style.setAttribute("color", "red");

  	
	//------------------------------------------------------------------------------//
	// TABELLE
	//------------------------------------------------------------------------------//
  	
  	//Tabella titoli
	var tableStyle = docStyles.addStyle(".table");
	//bordo esterno
	tableStyle.setAttribute("width", "100%");
  	tableStyle.setAttribute("border-left", "1px solid black");
	tableStyle.setAttribute("border-top", "1px solid black");
	tableStyle.setAttribute("border-bottom", "1px solid black");
	//celle
  	docStyles.addStyle(	"table.table td", "border-top: thin solid black; border-left: thin solid black; border-bottom: thin solid black; padding: 3px; ");


  	//Tabella Attivo/Passivo
	var tableStyle1 = docStyles.addStyle(".tableAP");
	tableStyle1.setAttribute("width", "100%");
  	tableStyle1.setAttribute("border-left", "1px solid black");
	tableStyle1.setAttribute("border-top", "1px solid black");
	tableStyle1.setAttribute("border-bottom", "1px solid black");
  	docStyles.addStyle("table.tableAP td", "border-top: thin solid black; border-left: thin solid black; border-bottom: thin solid black; padding: 3px;");



  	//Tabella Conti
	var tableStyle2 = docStyles.addStyle(".tableConti");
	tableStyle2.setAttribute("width", "100%");
  	tableStyle2.setAttribute("border-left", "1px solid black");
	tableStyle2.setAttribute("border-top", "1px solid black");
	tableStyle2.setAttribute("border-bottom", "1px solid black");
  	docStyles.addStyle("table.tableConti td", "border-top: thin solid black; border-left: thin solid black; border-bottom: thin solid black; padding: 3px;");


  	//Tabella intestazione
	var tableStyle3 = docStyles.addStyle(".tableIntestazione");
	tableStyle3.setAttribute("width", "100%");
  	docStyles.addStyle("table.tableIntestazione td", "border-top: thin solid black; border-left: thin solid black; padding: 10px;");


  	//Tabella istruzioni
	var tableStyle4 = docStyles.addStyle(".tableIstruzioni");
	tableStyle4.setAttribute("width", "100%");
  	tableStyle4.setAttribute("border-left", "thin solid black");
	tableStyle4.setAttribute("border-top", "thin solid black");
 	docStyles.addStyle("table.tableIstruzioni td", "border: 0; padding: 0;");

  	//Tabella norme legali
	var tableStyle4 = docStyles.addStyle(".tableNormeLegali");
  	tableStyle4.setAttribute("border-left", "thin solid black");
 	docStyles.addStyle("table.tableNormeLegali td", "border: 0; padding: 0;");


 	//Tabella Intestazione1
	var tableStyle5 = docStyles.addStyle(".tableIntestazione1");
	tableStyle5.setAttribute("width", "100%");
	tableStyle5.setAttribute("border-top", "thin solid black");
  	docStyles.addStyle("table.tableIntestazione1 td", "border-left: thin solid black; padding: 5px; width: 200px");



	
	return docStyles;
}
