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
// @id = catalogopatrizi
// @api = 1.0
// @pubdate = 2015-08-05
// @publisher = Banana.ch SA
// @description = Catalogo Patrizi
// @task = app.command
// @doctype = 400.*
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



var scriptVersion = "script v. 2015-08-11";

//Main function
function exec() {

	if (!Banana.document) {
		return;
	}

	//Clear old messages
	Banana.document.clearMessages();
	
	//Show dialog windows asking to the user to select some options
	//Return the selected options or undefined if the user clicked cancel
	var catalogToPrint = Banana.Ui.getItem("Catalogo", "Selezionare un tipo di catalogo", ["Catalogo elettorale","Catalogo completo"], 2, false);
	var catalogSorting = Banana.Ui.getItem("Ordinamento", "Selezionare un tipo di ordinamento", ["Ordina per cognome","Ordina per scheda"], 2, false);
	var catalogHeader = Banana.Ui.getText("Stampa catalogo", "Intestazione stampa:", "Patriziato di esempio - Catalogo elettorale");

	//Function call to load all the values from Banana document
	var form = loadForm(Banana.document, catalogSorting);

	if (catalogToPrint === "Catalogo elettorale") { //Create the catalog of the voters
		var report = printVotersCatalog(Banana.document, form, catalogHeader);
	} else if (catalogToPrint === "Catalogo completo") { //Create the full catalog
		var report = printFullCatalog(Banana.document, form, catalogHeader);
	} else { //User clicked cancel
		return;
	}

	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}


//The purpose of this function is to print the full list of the contacts
function printFullCatalog(banDoc, form, catalogHeader) {

	var report = Banana.Report.newReport("Catalogo completo");

	// report.addParagraph(banDoc.info("AccountingDataBase", "Company"), "heading1 bold");
	// report.addParagraph("Catalogo completo", "heading2");
	report.addParagraph(catalogHeader, "heading1 bold");
	report.addParagraph(" ");

	//Table with all contacts data
	var table = report.addTable("table");

	//Add titles to the columns
	var tableHeader = table.getHeader();
	tableRow = tableHeader.addRow();	
	
	tableRow.addCell("Id", "alignCenter valueTitle", 1);
	tableRow.addCell("Gruppo Id", "alignCenter valueTitle", 1);
	tableRow.addCell("Scheda", "alignCenter valueTitle", 1);
	//tableRow.addCell("Prefisso", "alignCenter valueTitle", 1);
	tableRow.addCell("Nome", "alignCenter valueTitle", 1);
	//tableRow.addCell("Sec. Nome", "alignCenter valueTitle", 1);
	tableRow.addCell("Cognome", "alignCenter valueTitle", 1);
	tableRow.addCell("Via", "alignCenter valueTitle", 1);
	tableRow.addCell("CAP", "alignCenter valueTitle", 1);
	tableRow.addCell("Località", "alignCenter valueTitle", 1);
	tableRow.addCell("Nazione", "alignCenter valueTitle", 1);
	tableRow.addCell("Paternità", "alignCenter valueTitle", 1);
	tableRow.addCell("Nascita", "alignCenter valueTitle", 1);
	//tableRow.addCell("Decesso", "alignCenter valueTitle", 1);
	tableRow.addCell("Voto", "alignCenter valueTitle", 1);
	tableRow.addCell("Note", "alignCenter valueTitle", 1);

	//Add the content of the table
	for (var i = 0; i < form.length; i++) {

		tableRow = table.addRow();
		tableRow.addCell(form[i]["RowId"], "alignCenter valueText", 1);
		tableRow.addCell(form[i]["ContactsGroupsRowId"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["RowBelongTo"], "alignCenter valueText", 1);
		//tableRow.addCell(form[i]["NamePrefix"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["FirstName"], "alignLeft valueText", 1);
		//tableRow.addCell(form[i]["MiddleName"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["FamilyName"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["Street"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["PostalCode"], "alignCenter valueText", 1);
		tableRow.addCell(form[i]["Locality"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["Country"], "alignLeft valueText", 1);
		tableRow.addCell(form[i]["Paternity"], "alignLeft valueText", 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(form[i]["DateOfBirth"]), "alignCenter valueText", 1);
		//tableRow.addCell(Banana.Converter.toLocaleDateFormat(form[i]["DateOfDeath"]), "alignCenter valueText", 1);
		
		if (form[i]["MemberVote"] === "1") {
			tableRow.addCell("Sì", "alignCenter valueText", 1);
		} else {
			tableRow.addCell("No", "alignCenter valueText", 1);
		}

		tableRow.addCell(form[i]["Notes"], "alignLeft valueText", 1);
	}

	var date = new Date();
	report.addParagraph(" ");
	report.addParagraph("Data di stampa: " + Banana.Converter.toLocaleDateFormat(date));	

	//Add the footer to the report
	addFooter(banDoc, report);

	return report;
}


//The purpose of this function is to print only the voters list 
function printVotersCatalog(banDoc, form, catalogHeader) {

	var report = Banana.Report.newReport("Catalogo elettorale");

	// report.addParagraph(banDoc.info("AccountingDataBase", "Company"), "heading1 bold");
	// report.addParagraph("Catalogo elettorale", "heading2");
	report.addParagraph(catalogHeader, "heading1 bold");
	report.addParagraph(" ");

	//Table with all contacts data
	var table = report.addTable("table");

	//Add titles to the columns
	var tableHeader = table.getHeader();
	tableRow = tableHeader.addRow();	
	
	tableRow.addCell("Id", "alignCenter valueTitle", 1);
	tableRow.addCell("Gruppo Id", "alignCenter valueTitle", 1);
	tableRow.addCell("Scheda", "alignCenter valueTitle", 1);
	//tableRow.addCell("Prefisso", "alignCenter valueTitle", 1);
	tableRow.addCell("Nome", "alignCenter valueTitle", 1);
	//tableRow.addCell("Sec. Nome", "alignCenter valueTitle", 1);
	tableRow.addCell("Cognome", "alignCenter valueTitle", 1);
	tableRow.addCell("Via", "alignCenter valueTitle", 1);
	tableRow.addCell("CAP", "alignCenter valueTitle", 1);
	tableRow.addCell("Località", "alignCenter valueTitle", 1);
	tableRow.addCell("Nazione", "alignCenter valueTitle", 1);
	tableRow.addCell("Paternità", "alignCenter valueTitle", 1);
	tableRow.addCell("Nascita", "alignCenter valueTitle", 1);
	//tableRow.addCell("Decesso", "alignCenter valueTitle", 1);
	tableRow.addCell("Voto", "alignCenter valueTitle", 1);
	tableRow.addCell("Note", "alignCenter valueTitle", 1);

	//Add the content of the table
	for (var i = 0; i < form.length; i++) {

		if (form[i]["MemberVote"] === "1") {

			form[i]["MemberVote"] = "Sì";

			tableRow = table.addRow();
			tableRow.addCell(form[i]["RowId"], "alignCenter valueText", 1);
			tableRow.addCell(form[i]["ContactsGroupsRowId"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["RowBelongTo"], "alignCenter valueText", 1);
			//tableRow.addCell(form[i]["NamePrefix"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["FirstName"], "alignLeft valueText", 1);
			//tableRow.addCell(form[i]["MiddleName"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["FamilyName"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["Street"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["PostalCode"], "alignCenter valueText", 1);
			tableRow.addCell(form[i]["Locality"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["Country"], "alignLeft valueText", 1);
			tableRow.addCell(form[i]["Paternity"], "alignLeft valueText", 1);
			tableRow.addCell(Banana.Converter.toLocaleDateFormat(form[i]["DateOfBirth"]), "alignCenter valueText", 1);
			//tableRow.addCell(Banana.Converter.toLocaleDateFormat(form[i]["DateOfDeath"]), "alignCenter valueText", 1);
			tableRow.addCell(form[i]["MemberVote"], "alignCenter valueText", 1);
			tableRow.addCell(form[i]["Notes"], "alignLeft valueText", 1);
		}
	}

	var date = new Date();
	report.addParagraph(" ");
	report.addParagraph("Data di stampa: " + Banana.Converter.toLocaleDateFormat(date));	

	//Add the footer to the report
	addFooter(banDoc, report);

	return report;
}


//The purpose of this function is to store the data taken from the Banana document's table
function loadForm(banDoc, catalogSorting) {
	
	//variable to access to the Banana document table
	var contactsTable = banDoc.table("Contacts");
	var form = [];
	
	//We read the Banana document table row by row
	for (var j = 0; j < contactsTable.rowCount; j++) {
		var tRow = contactsTable.row(j);
		
		//If the row table is not completely empty we get the values
		if (!tRow.isEmpty) {
			var row = tRow.rowNr;
			var id = tRow.value("RowId");
			var groupId = tRow.value("ContactsGroupsRowId");
			var belong = tRow.value("RowBelongTo");
			var belong2 = tRow.value("RowBelongTo2");
			var namePrefix = tRow.value("NamePrefix");
			var firstName = tRow.value("FirstName");
			var middleName = tRow.value("MiddleName");
			var familyName = tRow.value("FamilyName");
			var street = tRow.value("Street");
			var postalCode = tRow.value("PostalCode");
			var locality = tRow.value("Locality");
			var country = tRow.value("Country");
			var paternity = tRow.value("Paternity");
			var birthDate = tRow.value("DateOfBirth");
			var deathDate = tRow.value("DateOfDeath");
			var memberVote = tRow.value("MemberVote");
			var notes = tRow.value("Notes");
			var archivedDate = tRow.value("ArchivedDate");
			var archivedNotes = tRow.value("ArchivedNotes");
			var phoneHome = tRow.value("PhoneHome");
			var phoneMobile = tRow.value("PhoneMobile");
			var emailHome = tRow.value("EmailHome");
			var address2Street = tRow.value("Address2Street");
			var address2PostalCode = tRow.value("Address2PostalCode");
			var address2Locality = tRow.value("Address2Locality");
			var address2Country = tRow.value("Address2CountryCode");

			form.push({
				"Row":row,
				"RowId":id,
				"ContactsGroupsRowId":groupId,
				"RowBelongTo":belong,
				"RowBelongTo2":belong2,
				"NamePrefix":namePrefix,
				"FirstName":firstName,
				"MiddleName":middleName,
				"FamilyName":familyName,
				"Street":street,
				"PostalCode":postalCode,
				"Locality":locality,
				"Country":country,
				"Paternity":paternity,
				"DateOfBirth":birthDate,
				"DateOfDeath":deathDate,
				"MemberVote":memberVote,
				"Notes":notes,
				"ArchivedDate":archivedDate,
				"ArchivedNotes":archivedNotes,
				"PhoneHome":phoneHome,
				"PhoneMobile":phoneMobile,
				"EmailHome":emailHome,
				"Address2Street":address2Street,
				"Address2PostalCode":address2PostalCode,
				"Address2Locality":address2Locality,
				"Address2CountryCode":address2Country
			});
		}
	}
	
	if (catalogSorting === "Ordina per cognome") { //Sort by family name
		form.sort(function(a, b) { 
			return sortByName(a, b); 
		});
	} else if (catalogSorting === "Ordina per scheda") { //Sort by tab number
		form.sort(function(a, b) { 
			return sortByRowBelongTo(a, b); 
		});	
	} else { //The user clicked cancel, no sorting
		return form;
	}

	return form;
}


//The purpose of this function is to sort the form by the name
function sortByName(a, b) {
	
	var textA = a.FamilyName.toLowerCase() + "$" + a.FirstName.toLowerCase() + "$" + a.MiddleName.toLowerCase();
	var textB = b.FamilyName.toLowerCase() + "$" + b.FirstName.toLowerCase() + "$" + b.MiddleName.toLowerCase();

	if (textA < textB) { //sort string ascending
		return -1;
	} else if (textA > textB) {
		return 1;
	}
	return 0; //default return value (no sorting)	
}


//The purpose of this function is to sort the form by tab number and name
function sortByRowBelongTo(a, b) {

	if (Number(a.RowBelongTo) > Number(b.RowBelongTo)) {
        return 1;
    } else if (Number(a.RowBelongTo) < Number(b.RowBelongTo)) {
        return -1;
    }

    if (a.RowId === a.RowBelongTo && b.RowId === b.RowBelongTo) {
	    if (Number(a.RowBelongTo) > Number(b.RowBelongTo)) {
	        return -1;
	    } else if (Number(a.RowBelongTo) < Number(b.RowBelongTo)) {
	        return 1;
	    }
    }

    var textA = a.FamilyName + "$" + a.FirstName + "$" + a.MiddleName;
    var textB = b.FamilyName + "$" + b.FirstName + "$" + b.MiddleName;
    
    if (textA < textB) { //sort string ascending
		return -1;
	} else if (textA > textB) {
		return 1;
	}
	return 0;
}


//The purpose of this function is to add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion, "footer");
}


//The purpose of this function is to create styles for the report print
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
	pageStyle.setAttribute("size", "landscape");
	
	var style = "";

	//Titles
	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");

	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", "14px");

	style = stylesheet.addStyle(".heading3");
	style.setAttribute("font-size", "11px");

	//Text
	style = stylesheet.addStyle(".valueText");
	style.setAttribute("font-size", "10px");
	style.setAttribute("padding-bottom", "5px");
	style.setAttribute("padding-top", "5px");

	style = stylesheet.addStyle(".valueTitle");
	style.setAttribute("font-size", "10px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");

	//Footer
	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font", "Times New Roman");
	
	//Bold
	style = stylesheet.addStyle(".bold");
	style.setAttribute("font-weight", "bold");
	
	//Italic
	style = stylesheet.addStyle(".italic");
	style.setAttribute("font-style", "italic");
	
	//Alignment
	style = stylesheet.addStyle(".alignCenter");
	style.setAttribute("text-align", "center");

	style = stylesheet.addStyle(".alignRight");
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".alignLeft");
	style.setAttribute("text-align", "left");

	//Table
	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	stylesheet.addStyle("table.table td", "border: thin solid black");
	//stylesheet.addStyle("table.table td", "border: thin dashed black;");


	return stylesheet;
}

