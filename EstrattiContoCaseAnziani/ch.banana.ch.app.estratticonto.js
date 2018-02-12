// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.ch.app.estratticonto
// @api = 1.0
// @pubdate = 2018-01-21
// @publisher = Banana.ch SA
// @description = Estratti Conto residenti Case per anziani
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = serviziSocialiLugano
// @outputformat = none
// @inputdataform = none
// @timeout = -1



/**
	L'idea è quella di:
	
	1) Estrarre dalla tabella "conti" una lista contenente tutti i nomi/cognomi dei residenti.
	   Per fare questo si controllano i conti che contengono le parole "CASSA", "POSTA" e "SOSP",
	   di questi conti si salva il nome/cognome che si trova nella colonna descrizione.
	   Alla fine vengono eliminati tutti i doppi in modo che ogni persona sia presente una sola volta nella lista.

	2) Si scorre la tabella conti e per ogni persona vengono salvati nel form:
		. Nome e cognome										(utilizzato per l'intestazione)
		. I tre conti CASSA, POSTA, SOSP  						(al momento non utilizzati)
		. Saldo finale conto CASSA (formattato e non)			(utilizzato per la tabella riassuntiva dei totali)
		. Saldo finale conto POSTA (formattato e non)			(utilizzato per la tabella riassuntiva dei totali)
		. Saldo finale conto SOSP (formattato e non) 			(utilizzato per la tabella riassuntiva dei totali)
		. La struttura di appartenenza 							(utilizzato per l'intestazione)
		. Numero conto cassa 		    						(utilizzato per l'intestazione dell'estratto conto cassa)
		. Numero ccp 	                   						(utilizzato per l'intestazione dell'estratto conto posta)

		Ora il form contiene tutti i dati di tutte le persone.

	3) Si scorre il form e per ogni persona viene creata la pagina del report contentente i tre estratti conto e
       altre informazioni.

	

	Dalle proprietà file vengono letti e utilizzati:
		. L'anno
		. La moneta di base
		. Il nome della società (tab indirizzo)
		. Il nome della località (tab indirizzo)
	È importante quindi che questi campi vengano compilati nel file di contabilità.
**/





//Global variables
var param = {};
var form = [];
var _s = "";
var _cc = "";
var _ccp = "";
var sflag = false;
var ccflag = false;
var ccpflag = false;




//Main function
function exec() {

	//Check if we are on an opened document
	if (!Banana.document) {return;}
		
	/** 1. CREATE AND LOAD THE PARAMETERS AND THE FORM */
	loadParam();
	loadForm();
	
	/** 2. CONVERT ALL THE VALUES AND KEEP BOTH FILES (CONVERTED AND NOT-CONVERTED)*/
	formatValues(["endBalanceCassa", "endBalancePosta", "endBalanceSosp"]);

	/** 3. PRINT THE REPORT */
	printReport();
}


//The purpose of this function is to get and load all the required parameters
function loadParam() {

	//Takes the opening date
	var openingDate = Banana.Converter.toDate(Banana.document.info("AccountingDataBase","OpeningDate"));
	var year = "";

	//Takes the year
	if (openingDate) {
		year = openingDate.getFullYear();
	}

	//Create an object for the parameters
	param = {
		"year" : year,
		"reportName":"Estratti conto Residenti Case per anziani",
		"basicCurrency" : Banana.document.info("AccountingDataBase","BasicCurrency"),
		"companyName" : Banana.document.info("AccountingDataBase","Company"),
		"city" : Banana.document.info("AccountingDataBase","City"),
		"formatNumber":true
	};
}


//The purpose of this function is to get and load all the data taken from the table "Accounts" of the file .ac2 
function loadForm() {
	
	//Function call to create an array containing all the names of the residents
	var arrNames = getNames();
	var arrlen = arrNames.length;

	//Get the table "Accounts"
	var table = Banana.document.table("Accounts");
	var tabLen = table.rowCount;

	//We search and save all the data belonging to each resident
	for (var j = 0; j < arrlen; j++) {
		var accountCassa = "";
		var accountPosta = "";
		var accountSosp = "";
		var endBalanceCassa = "";
		var endBalancePosta = "";
		var endBalanceSosp = "";

		for (var i = 0; i < tabLen; i++) {
			var tRow = table.row(i);

			//Informazioni riguardanti la struttura e i numeri dei conti cassa/posta
			if (tRow.value("Description").indexOf("s:") > -1) {
				_s = tRow.value("Description").substring(2);
				sflag = true;
			}

			else if (tRow.value("Description").indexOf("cc:") > -1) {
				_cc = tRow.value("Description").substring(3);
				ccflag = true;
			}

			else if (tRow.value("Description").indexOf("ccp:") > -1) {
				_ccp = tRow.value("Description").substring(4);
				ccpflag = true;
			}


			//Informazioni riguardandi la persona
			else if (tRow.value("Account").indexOf("CASSA") > -1 && tRow.value("Description") === arrNames[j]) {
				accountCassa = tRow.value("Account");

				//Calculate the balance
				endBalanceCassa = Banana.document.currentBalance(accountCassa, param.year+"-01-01", param.year+"-12-31").balance;

				if (sflag) {
					struttura = _s;
				}
			}

			else if (tRow.value("Account").indexOf("POSTA") > -1 && tRow.value("Description") === arrNames[j]) {
				accountPosta = tRow.value("Account");

				//Calculate the balance
				endBalancePosta = Banana.document.currentBalance(accountPosta, param.year+"-01-01", param.year+"-12-31").balance;

				if (ccflag) {
					numeroContoCassa = _cc;
				}
			}

			else if (tRow.value("Account").indexOf("SOSP") > -1 && tRow.value("Description") === arrNames[j]) {
				accountSosp = tRow.value("Account");

				//Calculate the balance
				endBalanceSosp = Banana.document.currentBalance(accountSosp, param.year+"-01-01", param.year+"-12-31").balance;

				if (ccpflag) {
					numeroContoPosta = _ccp;
				}
			}
		}

		//We save all the data
		form.push({
			"name" : arrNames[j],
			"accountCassa" : accountCassa,
			"accountPosta" : accountPosta,
			"accountSosp" : accountSosp,
			"endBalanceCassa" : endBalanceCassa,
			"endBalancePosta" : endBalancePosta,
			"endBalanceSosp" : endBalanceSosp,
			"struttura" : struttura,
			"numeroContoCassa" : numeroContoCassa,
			"numeroContoPosta" : numeroContoPosta
		});
	}
}


//The purpose of this function is to create the report
function printReport() {
	var report = Banana.Report.newReport(param.reportName);

	var formLength = form.length;
	for (var i = 0; i < formLength; i++) {

		/** 
			1. Title
		**/
		report.addParagraph("ESTRATTO CONTO DEI MOVIMENTI FINANZIARI - CONTABILITÀ RESIDENTI dal 01.01." + param.year + " al 31.12." + param.year, "title bold center");
		report.addParagraph(" ");


		/**
			2. Information of the resident
		**/
		report.addParagraph("Nome e cognome residente: " + getObject(form, form[i].name).name);
		report.addParagraph("Struttura: " + getObject(form, form[i].name).struttura);
		report.addParagraph(" ");
		report.addParagraph(" ");


		/** 
			3. Bank statements
		**/

		//CASSA
		printBankStatement(getObject(form, form[i].name).accountCassa, getObject(form, form[i].name).numeroContoCassa, report);
		
		//POSTA
		printBankStatement(getObject(form, form[i].name).accountPosta, getObject(form, form[i].name).numeroContoPosta, report);
		
		//SOSPESI
		printBankStatement(getObject(form, form[i].name).accountSosp, "Sospesi", report);


		/**
			4. Totals 
		**/
		var table = report.addTable("tableTotals");
		tableRow = table.addRow();
		
		//CASSA
		tableRow.addCell("Totale Saldo Cassa al 31.12." + param.year + ": ", "styleTotal bold 10pt", 1);
		tableRow.addCell(param.basicCurrency, "styleTotal bold 10pt", 1);
		if (getObject(form, form[i].name).endBalanceCassa) {
			tableRow.addCell(getObject(form, form[i].name).endBalanceCassaFormatted, "right styleTotal bold 10pt", 1);
		} else {
			tableRow.addCell(getObject(form, form[i].name).endBalanceCassaFormatted, "right styleTotal bold 10pt", 1); //endBalanceCassa
		}
		tableRow.addCell(" ", "", 1);

		//POSTA
		tableRow = table.addRow();
		tableRow.addCell("Totale Saldo Conto Corrente Postale al 31.12." + param.year + ": ", "styleTotal bold 10pt", 1);
		tableRow.addCell(param.basicCurrency, "styleTotal bold 10pt", 1);
		if (getObject(form, form[i].name).endBalancePosta) {
			tableRow.addCell(getObject(form, form[i].name).endBalancePostaFormatted, "right styleTotal bold 10pt", 1);
		} else {
			tableRow.addCell(getObject(form, form[i].name).endBalancePostaFormatted, "right styleTotal bold 10pt", 1);
		}
		tableRow.addCell(" ", "", 1);

		//SOSPESI
		tableRow = table.addRow();
		tableRow.addCell("Totale Saldo Sospesi al 31.12." + param.year + ": ", "styleTotal bold 10pt", 1);
		tableRow.addCell(param.basicCurrency, "styleTotal bold 10pt", 1);
		if (getObject(form, form[i].name).endBalanceSosp) {
			tableRow.addCell(getObject(form, form[i].name).endBalanceSospFormatted, "right styleTotal bold 10pt", 1);
		} else {
			tableRow.addCell(getObject(form, form[i].name).endBalanceSospFormatted, "right styleTotal bold 10pt", 1);
		}
		tableRow.addCell(" ", "", 1);


		/**
			5. Signature
		**/	
		report.addParagraph(" ");
		report.addParagraph(" ");
		var table = report.addTable("tableSignature");
		tableRow = table.addRow();
		tableRow.addCell(param.city + ", 31.12." + param.year, "", 1);
		tableRow.addCell(param.companyName, "", 1);
		tableRow = table.addRow();
		tableRow.addCell("", "", 2);
		tableRow = table.addRow();
		tableRow.addCell("", "", 2);
		tableRow = table.addRow();
		tableRow.addCell("", "", 2);

		//Text
		tableRow = table.addRow();
		tableRow.addCell("Gli interessi attivi e passivi rimangono a favore o rispettivamente a carico degli Istituti Sociali Comunali della Città di Lugano senza influenzare in alcun modo i conti dei singoli residenti. Gli interessi attivi servono per coprire le spese di tenuta del conto e l'Imposta preventiva verrà gestita dagli Istituti Sociali Comunali. Contro il presente estratto può essere inoltrato reclamo scritto entro 10 giorni dalla ricezione, scaduto questo termine riterremo il presente estratto definitivo. Le ricevute delle registrazioni così come le pezze giustificative dei movimenti contabili possono essere consultati presso il servizio contabile di ogni struttura previo richiesta preventiva telefonica o scritta. Documento senza firma.", "", 2);

		//Add a page break between each resident
		report.addPageBreak();
	}

	//Add the footer
	addFooter(report);

	//Function call to use the styles
	var stylesheet = createStyleSheet();

	//Create the prewiev of the report
	Banana.Report.preview(report, stylesheet);

	//Return the report
	return report;
}


//Function that creates and print the bank statement for a given account
function printBankStatement(account, titleTable, report) {

	//Create a table object with all transactions for the given account and period (in this case the period is the whole year) 
	var transTab = Banana.document.currentCard(account, param.year+"-01-01", param.year+"-12-31");

	//Calculate some values to check if the table is not empty
	var currentBal = Banana.document.currentBalance(account,param.year+"-01-01", param.year+"-12-31");
	var debit = currentBal.debit;
	var credit = currentBal.credit;
	var balance = currentBal.balance;

	if (debit || credit || balance) {

		//Create the table that will be printed on the report
		var table = report.addTable("table");

		//Insert the table title text
		table.getCaption().addText(titleTable, "bold");

		//In order to manage the columns width, we add columns we want to manage using the addColumn() function.
		//For each of these columns we apply a specific width
		var colDate = table.addColumn("colDate");
		var colDoc = table.addColumn("colDoc");
		var colDescription = table.addColumn("colDescription");

		//Add column titles to the table report
		var tableHeader = table.getHeader();
		tableRow = tableHeader.addRow();
		tableRow.addCell("Data", "styleTableHeader  italic");
		tableRow.addCell("Doc", "styleTableHeader  italic center");
		tableRow.addCell("Descrizione", "styleTableHeader  italic");
		tableRow.addCell("Dare " + param.basicCurrency, "styleTableHeader  italic");
		tableRow.addCell("Avere " + param.basicCurrency, "styleTableHeader  italic");
		tableRow.addCell("Saldo " + param.basicCurrency, "styleTableHeader  italic");

		//Add the values taken from each row of the table (except the last one) to the respective cells of the table
		for (var i = 0; i < transTab.rowCount-1; i++) {	
			var tRow = transTab.row(i);
			tableRow = table.addRow();
			tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')));
			tableRow.addCell(tRow.value("Doc"), "center");
			tableRow.addCell(tRow.value("JDescription"));

			//Debit
			if (tRow.value('JDebitAmountAccountCurrency')) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "right");
			} else {
				tableRow.addCell("", "right");
			}

			//Credit
			if (tRow.value('JCreditAmountAccountCurrency')) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "right");
			} else {
				tableRow.addCell("", "right");
			}

			//Balance
			if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) > 0 || Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) < 0) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "right bold");
			} else {
				tableRow.addCell("", "");
			}
		}

		//We add the totals row separately because we want to apply a special style only to this row
		for(var i = transTab.rowCount-1; i < transTab.rowCount; i++) {
			var tRow = transTab.row(i);
			tableRow = table.addRow();
			tableRow.addCell("", "styleTotal bold", 2);
			tableRow.addCell(tRow.value("JDescription"), "styleTotal bold");

			//Debit
			if (tRow.value('JDebitAmountAccountCurrency')) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "right styleTotal bold");
			} else {
				tableRow.addCell("", "styleTotal");
			}

			//Credit
			if (tRow.value('JCreditAmountAccountCurrency')) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "right styleTotal bold");
			} else {
				tableRow.addCell("", "styleTotal");
			}

			//Balance
			if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) > 0 || Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) < 0) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "right styleTotal bold");
			} else {
				tableRow.addCell("", "styleTotal");
			}
		}
		report.addParagraph(" ");
	}
}


//The purpose of this function is to convert all the values from the given list to local format
//Then two vales are saved: "not-converted" and "converted". This because in some cases it is necessary to use "not-converted" values
function formatValues(fields) {
	if (param["formatNumber"] === true) {
		var formLength = form.length;
		for (i = 0; i < formLength; i++) {
			var valueObj = getObject(form, form[i].name);

			for (var j = 0; j < fields.length; j++) {
				valueObj[fields[j]] = valueObj[fields[j]]; //Save the value "not-converted"
				valueObj[fields[j] + "Formatted"] = Banana.Converter.toLocaleNumberFormat(valueObj[fields[j]]); //Save the value "converted"
			}
		}
	}
}


//Function that takes the FirstNames and FamilyNames of every person from the "Description" column of the "Accounts" table
function getNames() {
	var arr = [];
	var table = Banana.document.table("Accounts");
	
	var tabLen = table.rowCount;
	for (var i = 0; i < tabLen; i++) {
		var tRow = table.row(i);
		if (tRow.value("Account").indexOf("CASSA") > 0 || tRow.value("Account").indexOf("POSTA") > 0 || tRow.value("Account").indexOf("SOSP") > 0) {
			arr.push(tRow.value("Description"));
		}
	}

	//Remove duplicates
    for (var i = 0; i < arr.length; i++) {
        for (var x = i+1; x < arr.length; x++) {
            if (arr[x] === arr[i]) {
                arr.splice(x,1);
                --x;
            }
        }
    }
    return arr;
}


//The purpose of this function is to return a specific object of the form
function getObject(form, name) {
	for (var i = 0; i < form.length; i++) {
		if (form[i]["name"] === name) {
			return form[i];
		}
	}
	Banana.document.addMessage("Couldn't find object with name: " + name);
}



//This function adds a Footer with page counter to the report
function addFooter(report) {
   report.getFooter().addClass("footer");
   // report.getFooter().addText("Pagina ", "description");
   // report.getFooter().addFieldPageNr();
}



//This function creates all the styles used to print the report
function createStyleSheet() {
	
	//Create a new stylesheet
	var stylesheet = Banana.Report.newStyleSheet();
	var style = "";
	
	
	/** 
		General 
	**/

	//Set the margins of the page
	var pageStyle = stylesheet.addStyle("@page");
  	pageStyle.setAttribute("margin", "40mm 10mm 40mm 15mm");

  	//Set the font of the text
	stylesheet.addStyle("body", "font-family : Helvetica");
	stylesheet.addStyle("body", "font-size : 8pt");

	//Add the footer style
	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");

	//Text bold
	style = stylesheet.addStyle(".bold");
	style.setAttribute("font-weight", "bold");

	//Italic text
	style = stylesheet.addStyle(".italic");
	style.setAttribute("font-style", "italic");

	//Text red for negative values
	style = stylesheet.addStyle(".red");
	style.setAttribute("color", "red");

	//Text align center
	style = stylesheet.addStyle(".center");
	style.setAttribute("text-align", "center");

	//Text align right
	style = stylesheet.addStyle(".right");
	style.setAttribute("text-align", "right");

  	//Text size
	style = stylesheet.addStyle(".8pt");
	style.setAttribute("font-size", "8pt");

	//Text size
	style = stylesheet.addStyle(".10pt");
	style.setAttribute("font-size", "11pt");

	//Set the style of the title
	style = stylesheet.addStyle(".title");
	style.setAttribute("font-size", "9pt");
	style.setAttribute("text-decoration", "underline");
	
	//Set the style of the table header
	style = stylesheet.addStyle(".styleTableHeader");
	//style.setAttribute("background-color", "#ffd100");
	//style.setAttribute("color", "#1b365d");

	//Set the style of the table's total
	style = stylesheet.addStyle(".styleTotal");
	//style.setAttribute("background-color", "#b7c3e0"); 


	/** 
		Tables and columns
	**/
	
	//Create a table style adding the border
	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	//style.setAttribute("border", "thin solid black");
	//style.setAttribute("page-break-inside", "avoid");
	//stylesheet.addStyle("table.table td", "border: thin solid black");

	//Table totals
	style = stylesheet.addStyle(".tableTotals");
	style.setAttribute("width", "100%");
	style.setAttribute("border", "2px solid black");
	style.setAttribute("page-break-inside", "avoid");
  	//stylesheet.addStyle("table.tableTotals td", "border-bottom: thin solid black");

  	//Table signature
  	style = stylesheet.addStyle(".tableSignature");
  	style.setAttribute("width", "100%");
  	style.setAttribute("page-break-inside", "avoid");

  	//Set the columns width
  	style = stylesheet.addStyle(".colDate");
  	style.setAttribute("width", "10%");

  	style = stylesheet.addStyle(".colDoc");
  	style.setAttribute("width", "7%");

  	style = stylesheet.addStyle(".colDescription");
  	style.setAttribute("flexible-width", "always");

  	//Return all the styles
	return stylesheet;
}


