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
// @id = ch.banana.app.patriziato.elencodiciottenni
// @api = 1.0
// @pubdate = 2018-04-09
// @publisher = Banana.ch SA
// @description = Elenco diciottenni
// @task = app.command
// @doctype = 400.*
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1


/**
	This app prints a list of all the people who will be 18 years old in the specified year.
*/



var form = []; //used to store all the data taken from Banana document


//Main function
function exec() {
	
	if (!Banana.document) {
		return;
	}

	//Clear old messages
	Banana.document.clearMessages();
	Banana.application.showMessages();
		
	//Show the user a dialog asking to insert a text. Return the inserted text or undefined if the user clicked cancel
	var year = Banana.Ui.getText("Elenco diciottenni", "Stampa elenco diciottenni per l'anno...", "");
	if (year && year !== "") {
		//Function call to create the report that contain all the cards selected
		var report = printCard(Banana.document, year);

		/* FOOTER */
		addFooter(Banana.document, report);

		//Print the report
		var stylesheet = create_styleSheet();
		Banana.Report.preview(report, stylesheet);

	} else { //User clicked cancel
		return; //Terminate the script execution
	}
}


//The purpose of this function is to store the data taken from the Banana document's table
function loadForm(banDoc) {
	//variable to access to the Banana document table
	var contactsTable = banDoc.table("Contacts");
	
	//We read the Banana document table row by row
	for (var j = 0; j < contactsTable.rowCount; j++) {
		var tRow = contactsTable.row(j);
		
		//If the row table is not completely empty we get the values
		if (!tRow.isEmpty) {
			var row = tRow.rowNr;
			var code1 = tRow.value("Code1");
			var id = tRow.value("RowId");
			var belong = tRow.value("RowBelongTo");
			var belong2 = tRow.value("RowBelongTo2");
			var salutation = tRow.value("Salutation");
			var firstName = tRow.value("FirstName");
			var middleName = tRow.value("MiddleName");
			var familyName = tRow.value("FamilyName");
			var paternity = tRow.value("Paternity");
			var addressStreet = tRow.value("Street");
			var addressPostalCode = tRow.value("PostalCode");
			var addressLocality = tRow.value("Locality");
			var birthDate = tRow.value("DateOfBirth");
			var deathDate = tRow.value("DateOfDeath");
			var memberVote = tRow.value("MemberVote");
			var notes = tRow.value("Notes");
			var archivedDate = tRow.value("ArchivedDate");
			var archivedNotes = tRow.value("ArchivedNotes");

			form.push({
				"Row":row,
				"Code1":code1,
				"RowId":id,
				"RowBelongTo":belong,
				"RowBelongTo2":belong2,
				"Salutation":salutation,
				"FirstName":firstName,
				"MiddleName":middleName,
				"FamilyName":familyName,
				"Paternity":paternity,
				"AddressStreet":addressStreet,
				"AddressPostalCode":addressPostalCode,
				"AddressLocality":addressLocality,
				"DateOfBirth":birthDate,
				"DateOfDeath":deathDate,
				"MemberVote":memberVote,
				"Notes":notes,
				"ArchivedDate":archivedDate,
				"ArchivedNotes":archivedNotes
			});
		}
	}
}



//The purpose of this function is to print the report
function printCard(banDoc, year) {

	//Function call to load all the values from Banana document
	loadForm(banDoc);

	var report = Banana.Report.newReport("Elenco diciottenni");
	var diciottenniTrovati = false;

	/* TITLE */
	report.addParagraph("Elenco diciottenti", "title bold");
	report.addParagraph("anno " + year, "title");
	report.addParagraph(" ", "");
	report.addParagraph(" ", "");

	/* TABLE */
	var tableReport = report.addTable("table");

    /* HEADER TABLE */
    var tableHeader = tableReport.getHeader();
    var tableHeaderRow = tableHeader.addRow("");
    tableHeaderRow.addCell("Id", "headerTable bold center");
    tableHeaderRow.addCell("Scheda", "headerTable bold center");
    tableHeaderRow.addCell("Prec.", "headerTable bold center");
    tableHeaderRow.addCell("Prefisso", "headerTable bold center");
    tableHeaderRow.addCell("Nome", "headerTable bold center");
    tableHeaderRow.addCell("Secondo Nome", "headerTable bold center");
    tableHeaderRow.addCell("Cognome", "headerTable bold center");
    tableHeaderRow.addCell("Paternità", "headerTable bold center");
    tableHeaderRow.addCell("Indirizzo", "headerTable bold center");
    tableHeaderRow.addCell("CAP", "headerTable bold center");
    tableHeaderRow.addCell("Località", "headerTable bold center");
    tableHeaderRow.addCell("Data di nascita", "headerTable bold center");
    tableHeaderRow.addCell("Voto", "headerTable bold center");
    tableHeaderRow.addCell("Note", "headerTable bold center");

	for (var i = 0; i < form.length; i++) {

		var bdate = form[i].DateOfBirth;

		if (bdate) {
			bdate = Banana.Converter.toDate(bdate).getFullYear();
			
			var diff = year - bdate;

			if (diff === 18) {
				diciottenniTrovati = true;
				tableRow = tableReport.addRow();
				tableRow.addCell(form[i]["RowId"], "", 1);
				tableRow.addCell(form[i]["RowBelongTo"], "", 1);
				tableRow.addCell(form[i]["RowBelongTo2"], "", 1);
				tableRow.addCell(form[i]["Salutation"], "", 1);
				tableRow.addCell(form[i]["FirstName"], "", 1);
				tableRow.addCell(form[i]["MiddleName"], "", 1);
				tableRow.addCell(form[i]["FamilyName"], "", 1);
				tableRow.addCell(form[i]["Paternity"], "", 1);
				tableRow.addCell(form[i]["AddressStreet"], "", 1);
				tableRow.addCell(form[i]["AddressPostalCode"], "", 1);
				tableRow.addCell(form[i]["AddressLocality"], "", 1);
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(form[i]["DateOfBirth"]), "", 1);
				tableRow.addCell(form[i]["MemberVote"], "", 1);
				tableRow.addCell(form[i]["Notes"], "", 1);
			}
		}
	}

	if (!diciottenniTrovati) {
		tableRow = tableReport.addRow();
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
		tableRow.addCell("-", "", 1);
	}

	return report;	
}



function addMessageNotFound(banDoc) {
	banDoc.addMessage("Diciottenni per nell'anno " + anno + " non trovati.");
}


//The purpose of this function is to return a specific object of the form
function getObject(source, row) {
	for(var i = 0; i < source.length; i++){
		if(source[i].Row == row){
			return source[i];
		}
	}
	throw "Couldn't find object with row: " + row;
}


//The purpose of this function is to return a specific field value of the form
function getValue(source, cardCode, field) {
	var searchCode = cardCode.trim();
	for (var i = 0; i < source.length; i++) {
		if (source[i].RowBelongTo == searchCode) {
			return source[i][field];
		}
	}
	throw "Couldn't find value with card code: " + cardCode;
}


//The purpose of this function is to add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Contabilità - Pagina ", "footer");
	report.getFooter().addFieldPageNr();
}


//The purpose of this function is to create styles for the report print
function create_styleSheet() {
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    
    pageStyle.setAttribute("margin", "15mm 20mm 10mm 20mm");
    pageStyle.setAttribute("size", "landscape");

	stylesheet.addStyle("body", "font-family:Helvetica; font-size:10pt");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".bold", "font-weight:bold");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");

    var titleStyle = stylesheet.addStyle(".title");
    titleStyle.setAttribute("font-size", "20");
    titleStyle.setAttribute("text-align", "center");

    var headerTableStyle = stylesheet.addStyle(".headerTable");
    headerTableStyle.setAttribute("background-color", "#E0E0E0");
    headerTableStyle.setAttribute("color", "black");

    var tableStyle = stylesheet.addStyle(".table");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle("table.table td", "border: thin solid black;");

	return stylesheet;
}
