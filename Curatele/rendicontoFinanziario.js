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
// @description = Rendiconto finanziario (art. 410 CC)
// @task = app.command
// @doctype = *.*
// @docproperties = ticino
// @outputformat = none
// @inputdataform = none
// @timeout = -1



//Global variables
var param = {};
var form = [];


//The purpose of this function is to get and load all the parameters saved into the .ac2 
//In order to create the report some others parameters are stored here 
function loadParam() {

	param = {
		//Parameters saved into the informations
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
		
		//Parameters saved into the table "Testi" (parameters that the user have to modify properly into the .ac2 file)
		"npd" : Banana.document.table("Testi").findRowByValue("RowId","npd").value("Testo"),
		"cpd" : Banana.document.table("Testi").findRowByValue("RowId","cpd").value("Testo"),
		"iqd" : Banana.document.table("Testi").findRowByValue("RowId","iqd").value("Testo"),
		"art" : Banana.document.table("Testi").findRowByValue("RowId","art").value("Testo"),
		"arn" : Banana.document.table("Testi").findRowByValue("RowId","arn").value("Testo"),
		"ard" : Banana.document.table("Testi").findRowByValue("RowId","ard").value("Testo"),
		"grc" : Banana.document.table("Testi").findRowByValue("RowId","grc").value("Testo"),	
		"oss" : Banana.document.table("Testi").findRowByValue("RowId","oss").value("Testo"),
		"all" : Banana.document.table("Testi").findRowByValue("RowId","all").value("Testo"),

		//Additional informations
		"reportName":"Rendiconto finanziario - 2017",
		"bananaVersion":"Banana Accounting, v. " + Banana.document.info("Base", "ProgramVersion"),
		"scriptVersion":"script v. 2015-09-21 (TEST VERSION)",
		"pageCounterText":"Pagina",
		"rounding" : 2,	
		"formatNumber":true
	};

	loadOsservazioni();
	loadAllegati();
}


//The purpose of this function is to load a form with all the data taken from the table "Accounts" of the .ac2 file
function loadForm() {
	var table = Banana.document.table("Accounts");
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		if (tRow.value("Account")) { //We take only the rows with an existing account number/text
			form.push({
				"account" : tRow.value("Account"),
				"group" : tRow.value("Group"),
				"description" : tRow.value("Description"),
				"gr" : tRow.value("Gr"),
				"opening" : Banana.document.currentBalance(tRow.value("Account"), param.startDate, param.endDate).opening,
				"balance" : Banana.document.currentBalance(tRow.value("Account"), param.startDate, param.endDate).balance,
				"docNumero" : tRow.value("DocNumero"),
				"particellaNumero" : tRow.value("ParticellaNumero"),
				"valoreStima" : tRow.value("ValoreStima")
			});
		}
	}
	//Contabilita semplice, carica anche i dati presenti nella tabella Categorie
	if (Banana.document.table('Accounts') && Banana.document.table('Categories')) {
		var tableCategories = Banana.document.table("Categories");
		for (var i = 0; i < tableCategories.rowCount; i++) {
			var tRow = tableCategories.row(i);
			if (tRow.value("Category")) { //We take only the rows with an existing account number/text
				form.push({
					"group" : tRow.value("Group"),
					"account" : tRow.value("Category"), //the value of category is used as account value
					"description" : tRow.value("Description"),
					"gr" : tRow.value("Gr"),
					//Se fosse necessario avere i saldi, usare la funzione Banana.document.currentBalance("GrC=numero_gr").balance
				});
			}
		}
	}
}


//The purpose of this function is to do some operations before the values are converted
function postProcess() {
	
	//Chiamata della funzione di verifica
	flagError = verificaImporti();
}


//MAIN FUNCTION
function exec(string) {
    
	//Check if we are on an opened document
	if (!Banana.document) {return;}
		
	/** 1. CREATE AND LOAD THE PARAMETERS AND THE FORM */
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
	//Titoli
	report.addParagraph("Rendiconto finanziario", "titleStyle bordoSinistraSopra");
  	report.addParagraph("(art. 410 CC)", "subtitleStyle bordoSinistra");
  	report.addParagraph(" ");

	//Header
	var pageHeader = report.getHeader();
	pageHeader.addClass("header");
	pageHeader.addText("Autorità Regionale di Protezione no. " + param.arn + ", di "  + param.ard, "header");

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
	tableRow.addCell("Nome: " + param.npd, "testoNormale");
	tableRow.addCell("Cognome: " + param.cpd, "testoNormale");
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
	tableRow.addCell(param.iqd, "testoNormale");
	tableRow.addCell(param.art, "testoNormale");
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

	//Cerca tutti gli ATTIVI - IMMOBILI (Gr=11)
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Immobili", " ",5);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "11" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {
			//colonna 2,3 - Part. no/Descrizione, Valore stima
			//Riempimento delle colonne 2 e 3 a seconda che si tratti di "Immobili" oppure di "Beni mobili"	
			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell("Part. no " + getObject(form, form[i].account).particellaNumero);
			tableRow.addCell(getObject(form, form[i].account).valoreStima ,"Amount");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			tableRow.addCell(getObject(form, form[i].account).balance, "Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
		}
	}

	//Cerca tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo POSITIVO
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Beni mobili", " ",5);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "10" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {

			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell(getObject(form, form[i].account).description);
			tableRow.addCell("");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			tableRow.addCell(getObject(form, form[i].account).balance, "Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
		}
	}

	//Cerca tutti i PASSIVI - DEBITI (Gr=20) con saldo POSITIVO (il capitale proprio viene escluso)
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "20" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {

			tableRow = tableAttivo.addRow();
			tableRow.addCell("                      ");
			tableRow.addCell(getObject(form, form[i].account).description);
			tableRow.addCell("");

			//colonna 4 - Saldo CHF
			//Riempimento della colonna 4 con il saldo in CHF di ogni conto
			tableRow.addCell(getObject(form, form[i].account).balance, "Amount");

			//colonna 5 - Numero Documento
			//Riempimento della colonna 5 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
		}
	}

	//Stampa del totale ATTIVO
	tableRowEmpty = tableAttivo.addRow();
	tableRowEmpty.addCell(" ", " ", 5);
	tableRow = tableAttivo.addRow();
	tableRow.addCell("Totale (CHF)", "intestazioneStyle", 3);
	tableRow.addCell(getObject(form, "totAttivo").balance, "intestazioneStyle Right", 2);
	report.addParagraph(" ");	

	//Se la funzione di verifica trova un errore, viene visualizzato un messaggio sul rendiconto in prima pagina
	if (flagError) {
		for (var i = 0; i < form.length; i++) {
			if (form[i]["warningMessage"]) {
				report.addParagraph(form[i]["warningMessage"], "warning");
			}
		}
	}
	report.addPageBreak();




	//------------------------------------------------------------------------------//
	// 6.	CONTI PASSIVI
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
	
	//Cerca tutti i PASSIVI - DEBITI (Gr=20) con saldo NEGATIVO escludendo il Capitale Proprio (conto 290)
	tableRow = tablePassivo.addRow();
	tableRow.addCell("Debiti", " ",4);
	for (var i = 0; i < form.length; i++) {
		if (getObject(form, form[i].account).gr === "20" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) < 0) {
			//Aggiunge riga alla tabella
			tableRow = tablePassivo.addRow();
			tableRow.addCell("             ");

			//colonna 2 - Descrizione
			tableRow.addCell(getObject(form, form[i].account).description);

			//colonna 3 - Saldo CHF
			//Riempimento della colonna 3 con il saldo in CHF di ogni conto
			tableRow.addCell(getObject(form, form[i].account).balance, "Amount");

			//colonna 4 - Numero Documento
			//Riempimento della colonna 4 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
		}
	}

	//Cerco tutti gli ATTIVI - BENI MOBILI (Gr=10) con saldo NEGATIVO
	for (i = 0; i < form.length; i++) {
		if(getObject(form, form[i].account).gr === "10" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) < 0) {
			//Aggiunge riga alla tabella
			tableRow = tablePassivo.addRow();
			tableRow.addCell("             ");

			//colonna 2 - Descrizione
			tableRow.addCell(getObject(form, form[i].account).description);

			//colonna 3 - Saldo CHF
			//Riempimento della colonna 3 con il saldo in CHF di ogni conto
			tableRow.addCell(getObject(form, form[i].account).balance, "Amount");

			//colonna 4 - Numero Documento
			//Riempimento della colonna 4 con il numero del documento
			tableRow.addCell("Doc. no " + getObject(form, form[i].account).docNumero);
		}
	}

	//Stampa del totale PASSIVO
	tableRowEmpty = tablePassivo.addRow();
	tableRowEmpty.addCell(" ", " ", 5);
	tableRow = tablePassivo.addRow();
	tableRow.addCell("Totale (CHF)", "intestazioneStyle", 3);
	tableRow.addCell(getObject(form, "totPassivo").balance, "intestazioneStyle Right", 2);
	report.addParagraph(" ");




	//------------------------------------------------------------------------------//
	// 7.	TOTALI => ATTIVI + PASSIVI
	//------------------------------------------------------------------------------//
	//Creazine tabella per la stampa dei totali
	var tableTot = report.addTable("table");
    tableTot.getCaption().addText("Totali", "intestazioneStyle");

	tableRow = tableTot.addRow();
	tableRow.addCell(" ");
	tableRow.addCell("Importo (CHF)","intestazioneStyle");

	tableRow = tableTot.addRow();
	tableRow.addCell("Totale attivo");
	tableRow.addCell(getObject(form, "totAttivo").balance, "Amount");

	tableRow1 = tableTot.addRow();
	tableRow1.addCell("Totale passivo");
	tableRow1.addCell(getObject(form, "totPassivo").balance, "Amount");

	tableRow2 = tableTot.addRow();
	tableRow2.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");
	tableRow2.addCell(getObject(form, "totSostanzaNetta").balance, "intestazioneStyle Amount");
	report.addParagraph(" ");




	//------------------------------------------------------------------------------//
	// 8.	OSSERVAZIONI
	//------------------------------------------------------------------------------//
	//Creazione dello spazio riservato alle eventuali osservazioni, da inserire manualmente nella tabella "Testi"
	var sezioneOss = report.addSection(" ", "bottom2em");

	sezioneOss.addParagraph("Osservazioni o informazioni supplementari", "intestazioneStyle");
	sezioneOss.addParagraph("ev. debiti verso l'Ufficio del sostegno sociale e dell'inserimento (doc. no. )", "bordoSinistraSopra");
	sezioneOss.addParagraph(" ", "bordoSinistra");
	
	for (var i = 0; i < param.ossParam.length; i++) {
		sezioneOss.addParagraph(param.ossParam[i].testo, "bordoSinistra");
	}
	sezioneOss.addParagraph(" ");
	sezioneOss.addParagraph(" ");





	//------------------------------------------------------------------------------//
	// 9.	MOVIMENTI FINANZIARI
	//------------------------------------------------------------------------------//	
	//Creazione della tabella per la stampa della data dei movimenti finanziari
	var tableDataMovimentiFinanziari = report.addTable("table");
	tableRow = tableDataMovimentiFinanziari.addRow();
	tableRow.addCell("Movimenti finanziari dal " + Banana.Converter.toLocaleDateFormat(param.startDate), "intestazioneStyle");
	tableRow.addCell("Al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle");
	report.addParagraph(" ");

	//Creazione della tabella per la stampa dei movimenti Finanziari 
	var tableMovimentiFinanziari = report.addTable("tableConti");

	//Conto esercizio
	tableRow0 = tableMovimentiFinanziari.addRow();
	tableRow0.addCell(" ");
	tableRow0.addCell("Importo (CHF)", "intestazioneStyle");
	tableRow0.addCell("Importo (CHF)", "intestazioneStyle");

	tableRow1 = tableMovimentiFinanziari.addRow();
	tableRow1.addCell("Conto esercizio", "intestazioneStyle", 3);

	tableRow2 = tableMovimentiFinanziari.addRow();
	tableRow2.addCell("Totale entrate", "intestazioneStyle");
	tableRow2.addCell(getObject(form, "totEntrateGenerali").balance ,"Amount");
	tableRow2.addCell(" ");
	
	tableRow3 = tableMovimentiFinanziari.addRow();
	tableRow3.addCell("Utili patrimoniali (cfr. istruzione punto 9)");
	tableRow3.addCell(getObject(form, "totEntratePatrimoniali").balance, "Amount");
	tableRow3.addCell(getObject(form, "totEntrate").balance, "Amount");

	tableRowEmpty = tableMovimentiFinanziari.addRow();
	tableRowEmpty.addCell(" ", " ", 3);

	tableRow4 = tableMovimentiFinanziari.addRow();
	tableRow4.addCell("Totale uscite", "intestazioneStyle");
	tableRow4.addCell(getObject(form, "totUsciteGenerali").balance, "Amount");
	tableRow4.addCell(" ");
	
	tableRow5 = tableMovimentiFinanziari.addRow();
	tableRow5.addCell("Perdite patrimoniali (cfr. istruzione punto 10)");
	tableRow5.addCell(getObject(form, "totUscitePatrimoniali").balance, "Amount");
	tableRow5.addCell(getObject(form, "totUscite").balance, "Amount totalStyle");

	tableRowEmpty1 = tableMovimentiFinanziari.addRow();
	tableRowEmpty1.addCell(" ", " ", 3);

	tableRow6 = tableMovimentiFinanziari.addRow();
	tableRow6.addCell("Utile/perdita d'esercizio", "intestazioneStyle ", 2);
	tableRow6.addCell(getObject(form, "risEsercizio").balance, "intestazioneStyle Amount");
	
	//Conto patrimoniale
	tableRow12 = tableMovimentiFinanziari.addRow();
	tableRow12.addCell(" ", " ", 3);

	tableRow7 = tableMovimentiFinanziari.addRow();
	tableRow7.addCell("Conto patrimoniale", "intestazioneStyle", 3);

	tableRow8 = tableMovimentiFinanziari.addRow();
	tableRow8.addCell("Riportare sostanza netta anno precedente (o inventario)", " ", 2);
	tableRow8.addCell(getObject(form, "totSostanzaNettaApertura").balance, "Amount");

	tableRow9 = tableMovimentiFinanziari.addRow();
	tableRow9.addCell("Ev. modifiche e/o rettifiche, da precisare nelle osservazioni", " ", 3);

	tableRow10 = tableMovimentiFinanziari.addRow();
	tableRow10.addCell("Utile perdita d'esercizio (+/-)", "intestazioneStyle", 2);
	tableRow10.addCell(getObject(form, "risEsercizio").balance, "Amount totalStyle");

	tableRowEmpty2 = tableMovimentiFinanziari.addRow();
	tableRowEmpty2.addCell(" ", " ", 3);

	tableRow11 = tableMovimentiFinanziari.addRow();
	tableRow11.addCell("Sostanza netta al " + Banana.Converter.toLocaleDateFormat(param.endDate), "intestazioneStyle", 2);
	tableRow11.addCell(getObject(form, "totSostanzaNetta").balance, "intestazioneStyle Amount");
	report.addPageBreak();





	//------------------------------------------------------------------------------//
	// 10.	FIRME
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

	//Stampa degli allegati (tabella "Testi")
	report.addParagraph(" ");
	report.addParagraph("Allegati:", "testoFirma bordoSinistraSopra");
	report.addParagraph(" ", "bordoSinistra");
	for (var i = 0; i < param.allParam.length; i++) {
		report.addParagraph(" - " + param.allParam[i].testo, "testoFirmaAllegati bordoSinistra");
	}
	report.addPageBreak();




	//------------------------------------------------------------------------------//
	// 11.	RETRO PAGINA FIRME
	//------------------------------------------------------------------------------//
	var paragraph = report.addParagraph("","bordoSinistraSopra");
	paragraph.addText("L'Autorità Regionale di Protezione no. " + param.arn, "testoNormale");

	var paragraph1 = report.addParagraph("","bordoSinistra");
	paragraph1.addText("di " + param.ard, "testoNormale");	

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
	// 12.	TESTO - ISTRUZIONI PER I TUTORI/CURATORI
	//------------------------------------------------------------------------------//
	//Testo ultima pagina	
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
    tableRow.addCell("11.");
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




	//------------------------------------------------------------------------------//
	// 13.	CREAZIONE/STAMPA DEL REPORT
	//------------------------------------------------------------------------------//
	//Creazione degli stili utilizzati per la stampa
	var stylesheet = createStyleSheet();

	//In caso di errore viene chiesto all'utente se continuare o meno con la stampa del report
	if (flagError) {
		if(Banana.Ui.showQuestion("", "ATTENZIONE! Differenza tra Sostanza netta e Risultato d'esercizio. Continuare?")){
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
			ossParam.push({"testo" : tRow.value("Testo")});
		}
	}
	param.ossParam = ossParam;
}


//The purpose of this function is to get all the texts of the "allegati" tag from the table "Testi" and add them to the parameters 
function loadAllegati() {
	var allParam = [];
	var table = Banana.document.table("Testi");
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		
		if (tRow.value("RowId") === "all" && tRow.value("Testo")) {
			allParam.push({"testo" : tRow.value("Testo")});
		}
	}
	param.allParam = allParam;
}


//The purpose of this function is to calculate all the totals and save them into the form
function calcTotals() {

	//getObject(form, form[i].account).

	var totaleBeniMobili = "";
	var totalePassivo = "";
	var totaleBeniMobiliApertura = "";
	var totalePassivoApertura = "";

	//Calcolo tot ATTIVO e PASSIVO
	for (var i = 0; i < form.length; i++) {

		//Calcolo attivi => Gr=10 > 0 ; Gr=20 > 0
		if (getObject(form, form[i].account).gr === "10" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {
			totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObject(form, form[i].account).balance);
			totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObject(form, form[i].account).opening);
		}
		else if (getObject(form, form[i].account).gr === "20" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) > 0) {
			totaleBeniMobili = Banana.SDecimal.add(totaleBeniMobili, getObject(form, form[i].account).balance);
			totaleBeniMobiliApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, getObject(form, form[i].account).opening);
		}

		//Calcolo passivi => Gr=20 < 0 ; Gr=10 < 0
		else if (getObject(form, form[i].account).gr === "20" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) < 0) {
			totalePassivo = Banana.SDecimal.add(totalePassivo, getObject(form, form[i].account).balance);
			totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObject(form, form[i].account).opening);
		}
		else if (getObject(form, form[i].account).gr === "10" && Banana.SDecimal.sign(getObject(form, form[i].account).balance) < 0) {
			totalePassivo = Banana.SDecimal.add(totalePassivo, getObject(form, form[i].account).balance);
			totalePassivoApertura = Banana.SDecimal.add(totalePassivoApertura, getObject(form, form[i].account).opening);
		}
	}

	var totaleBeniImmobili = Banana.document.currentBalance("Gr=11", param.startDate, param.endDate).balance;
	var totaleBeniImmobiliApertura = Banana.document.currentBalance("Gr=11", param.startDate, param.endDate).opening;

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
	
	//var totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, totalePassivoApertura);
	//totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleSostanzaNettaApertura, totalePassivoApertura);
	
	var totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleBeniMobiliApertura, totaleBeniImmobiliApertura);
	totaleSostanzaNettaApertura = Banana.SDecimal.add(totaleSostanzaNettaApertura, totalePassivoApertura);
	//var totaleSostanzaNettaApertura = Banana.document.table('Accounts').findRowByValue('Group','00').value('Opening');
	



	//Alla fine salvo tutto nel form. Attenzione che nel caso della contabilita semplice devo invertire i valori del CE
	//Save the totals into the form, so they can be used
	form.push({"account":"totBeniMobili", "balance":totaleBeniMobili});
	form.push({"account":"totBeniImmobili", "balance":totaleBeniImmobili});
	form.push({"account":"totAttivo", "balance":totaleAttivo});
	form.push({"account":"totPassivo", "balance":totalePassivo});
	form.push({"account":"totSostanzaNetta", "balance":totaleSostanzaNetta});
	form.push({"account":"totSostanzaNettaApertura", "balance":totaleSostanzaNettaApertura});
	form.push({"account":"totUsciteGenerali", "balance":totaleUsciteGenerali});
	form.push({"account":"totUscitePatrimoniali", "balance":totaleUscitePatrimoniali});
	form.push({"account":"totUscite", "balance":totaleUscite});
	form.push({"account":"totEntrateGenerali", "balance":totaleEntrateGenerali});
	form.push({"account":"totEntratePatrimoniali", "balance":totaleEntratePatrimoniali});
	form.push({"account":"totEntrate", "balance":totaleEntrate});
	form.push({"account":"risEsercizio", "balance":risultatoEsercizio});
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


//Funzione che verifica che non vi sia una differenza tra risultato d'esecizio da bilancio e risultato d'esercizio da conto economico
function verificaImporti() {
	
	var utilePerditaEsercizio = getObject(form, "risEsercizio").balance;
	var aperturaSostNetta = getObject(form, "totSostanzaNettaApertura").balance;
	var saldoSostnetta = getObject(form, "totSostanzaNetta").balance;
	var totale = Banana.SDecimal.add(aperturaSostNetta, utilePerditaEsercizio);

	if(totale != saldoSostnetta) {
		var messaggioAvviso = "ATTENZIONE! Differenze. [Sostanza netta]: <" + saldoSostnetta + ">, [Apertura sost.netta + u/p esercizio]: <" + totale +">";
		form.push({"warningMessage" : messaggioAvviso});
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
		if(tRow.value('Gr')!=='10' 
			&& tRow.value('Gr')!=='11'
			&& tRow.value('Gr')!=='1'
			&& tRow.value('Gr')!=='20'
			&& tRow.value('Gr')!=='29' 
			&& tRow.value('Gr')!=='2' 
			&& tRow.value('Gr')!=='30' 
			&& tRow.value('Gr')!=='31' 
			&& tRow.value('Gr')!=='3' 
			&& tRow.value('Gr')!=='40' 
			&& tRow.value('Gr')!=='41' 
			&& tRow.value('Gr')!=='4'
			&& tRow.value('Gr')!=='00'
			&& tRow.value('Gr')!=='01'
			&& tRow.value('Gr')!=='0'
			&& tRow.value('Gr')!=='') {
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
   var versionLine = report.getFooter().addText(param.bananaVersion + ", " + param.scriptVersion + ", ", "description");
   report.getFooter().addText(param.pageCounterText + " ", "description");
   report.getFooter().addFieldPageNr();
}


//Creazione degli stili
function createStyleSheet() {

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
	style.setAttribute("font-family", "Courier New");
    
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
