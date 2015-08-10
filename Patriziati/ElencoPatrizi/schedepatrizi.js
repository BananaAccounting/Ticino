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
// @id = schedepatrizi
// @api = 1.0
// @pubdate = 2015-05-19
// @publisher = Banana.ch SA
// @description = Schede Patrizi
// @task = app.command
// @doctype = 400.*
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



var scriptVersion = "script v. 2015-08-10";
var form = []; //used to store all the data taken from Banana document
var mapCF = []; //map used to store CF's data (code/rows)
var mapMember = []; //map used to store Member's data (code/rows)
var cfNotFound = []; //list of code not found


//Main function
function exec() {
	
	if (!Banana.document) {
		return;
	}

	//Clear old messages
	Banana.document.clearMessages();
	
	//Function call to load all the values from Banana document
	loadForm(Banana.document);
	
	//Show the user a dialog asking to insert a text. Return the inserted text or undefined if the user clicked cancel
	var cardsToPrint = Banana.Ui.getText("Stampa schede", "Tutte le pagine (lasciare vuoto) / Schede multiple (es. 1,3,7)", "");

	//Check if the user has inserted some values or blank
	if (cardsToPrint || cardsToPrint === "") {

		//Function call to create maps that contain CF/Members card codes and rows 
		createMaps(form, cardsToPrint);

		//Only if we have at least one valid CF we create the report
		if (mapCF.length > 0) {

			//Function call to create the report that contain all the cards selected
			var report = printCard(Banana.document, form, mapCF, mapMember);

			//Print the report
			var stylesheet = create_styleSheet();
			Banana.Report.preview(report, stylesheet);
		}

		//Check if there are codes not found, then print them as a message
		if (cfNotFound.length > 0) {
			addMessageCodesNotFound(Banana.document);
		}

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
			var addressStreet = tRow.value("AddressStreet");
			var addressPostalCode = tRow.value("AddressPostalCode");
			var addressLocality = tRow.value("AddressLocality");
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


//The purpose of this function is to create two maps: one for CF and one for MEMBERS
//Into these maps are stored the card code values and the rows values
//These data are used to create the cards
function createMaps(form, cardsToPrint) {

	//Function call to get the codes inserted by the user, used to select which cards to create and print
	var cfList = printChoice(form, cardsToPrint);
	var cfRows = [];
	var meRows = [];

	//For each code, we get the CF and Members rows
	for (var i = 0; i < cfList.length; i++) {
		cfRows = getCF(form, cfList[i]);
		meRows = getMembers(form, cfList[i]);

		//We add values to the maps
		if (cfList[i] !== cfList[i-1]) {
			if (cfRows.length > 1) {
				//We add a parameter to the mapCF because we want to know if it is already used or not
				for (var j = 0; j < cfRows.length; j++) {
					mapCF.push({ "CFcode":cfList[i], "CFrows":cfRows[j], "CFisUnique":"false" });
				}
			} else {
				mapCF.push({ "CFcode":cfList[i], "CFrows":cfRows, "CFisUnique":"true" });
			}

			for (var j = 0; j < meRows.length; j++) {
				mapMember.push({ "MemberCode":cfList[i], "MemberRows":meRows[j] });
			}
		} 
	}
}


//The purpose of this function is to create the cards and print the report
function printCard(banDoc, form, mapCF, mapMember) {

	var report = Banana.Report.newReport("Schede Patrizi");

	//Table with CF/Members data
	var table = report.addTable("table");

	//Add the footer to the report
	addFooter(banDoc, report);

	//TITLE and CF
	for (var i = 0; i < mapCF.length; i++) {
	
		//We create the CF object with data stored into the mapCF
		var objectCf = getObject(form, mapCF[i].CFrows);
		var cntMembers = 0; //variable used to count the members

		//Titles
		//In this section we add titles/info about the group (card code)
		tableRow = table.addRow();
		tableRow.addCell(banDoc.info("AccountingDataBase", "Company"), "heading1 bold", 8);
		
		tableRow = table.addRow();
		tableRow.addCell("Registro dei fuochi, dei patrizi e dei votanti", "heading2 bold", 8);
		
		tableRow = table.addRow();
		tableRow.addCell("","",8);
		
		tableRow = table.addRow();
		tableRow.addCell("Scheda n. ", "heading3", 2);
		tableRow.addCell(objectCf.RowBelongTo, "heading3 bold", 1);
		
		tableRow = table.addRow();
		tableRow.addCell("Scheda antecedente n. ", "heading3", 2);
		
		if (objectCf.RowBelongTo2) {
			tableRow.addCell(objectCf.RowBelongTo2, "heading3 bold", 1);
		} else {
			tableRow.addCell(" - ", "heading3 bold", 1);
		}
		
		tableRow = table.addRow();
		tableRow.addCell(" ", " ", 8);


		//CF
		//In this section we add the CF of each group (card code)
		tableRow = table.addRow();
		tableRow.addCell("Cognome", "valueText valueTextTop valueTextLeft valueTextRight italic", 8);
		
		tableRow = table.addRow();
		tableRow.addCell(objectCf.FamilyName, "valueText bold valueTextLeft valueTextRight", 8);
		
		tableRow = table.addRow();
		tableRow.addCell("Rappresentante del fuoco", "valueText valueTextTop valueTextLeft valueTextRight italic", 8);
		
		tableRow = table.addRow();
		tableRow.addCell("Id","valueText valueTextLeft valueTextBottom italic", 1);
		tableRow.addCell("Nome", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Data di nascita", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Indirizzo - Domicilio", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Succ.", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Osservazioni", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Voto", "valueText valueTextBottom valueTextRight italic", 1);
		tableRow.addCell("Paternità", "valueText valueTextRight valueTextBottom italic", 1);
		
		tableRow = table.addRow();
		tableRow.addCell(objectCf.RowId, "valueText valueTextLeft alignCenter", 1);
		tableRow.addCell(objectCf.FirstName + " " + objectCf.MiddleName, "valueText bold valueTextRight", 1);
		tableRow.addCell(Banana.Converter.toLocaleDateFormat(objectCf.DateOfBirth), "valueText valueTextRight", 1);
		
		if (objectCf.AddressStreet && objectCf.AddressPostalCode && objectCf.AddressLocality) {
			tableRow.addCell(objectCf.AddressStreet + ", " + objectCf.AddressPostalCode + " " + objectCf.AddressLocality, "valueText valueTextRight", 1);
		} else if (!objectCf.AddressStreet) {
			tableRow.addCell(objectCf.AddressPostalCode + " " + objectCf.AddressLocality, "valueText valueTextRight", 1);
		}

		tableRow.addCell(" ", " ", 1);
		tableRow.addCell(objectCf.Notes, "valueText valueTextRight", 1);
		
		if (objectCf.MemberVote === "1") {
			tableRow.addCell("Sì", "valueText alignCenter valueTextRight", 1);
		}
		
		tableRow.addCell(objectCf.Paternity, "valueText valueTextRight", 1);
		
		if (objectCf.DateOfDeath && objectCf.ArchivedDate && objectCf.ArchivedNotes) {
			tableRow = table.addRow();
			tableRow.addCell("Decesso: " + Banana.Converter.toLocaleDateFormat(objectCf.DateOfDeath) + ", Archiviato: " + objectCf.ArchivedDate + " " + objectCf.ArchivedNotes, "valueText valueTextLeft valueTextRight", 8);
		} else if (!objectCf.DateOfDeath && objectCf.ArchivedDate && objectCf.ArchivedNotes) {
			tableRow = table.addRow();
			tableRow.addCell("Archiviato: " + Banana.Converter.toLocaleDateFormat(objectCf.ArchivedDate) + " " + objectCf.ArchivedNotes, "valueText valueTextLeft valueTextRight", 8);
		}
		
		tableRow = table.addRow();
		tableRow.addCell("Altri membri del fuoco", "valueText valueTextTop valueTextLeft valueTextRight italic", 8);
		
		tableRow = table.addRow();
		tableRow.addCell("Id","valueText valueTextLeft valueTextBottom italic", 1);
		tableRow.addCell("Nome", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Data di nascita", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Indirizzo - Domicilio", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Succ.", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Osservazioni", "valueText valueTextRight valueTextBottom italic", 1);
		tableRow.addCell("Voto", "valueText valueTextBottom valueTextRight italic", 1);
		tableRow.addCell("Paternità", "valueText valueTextRight valueTextBottom italic", 1);


		//MEMBERS
		//In this section we add each member belonging to the same group (with the same card code)
		for (var j = 0; j < mapMember.length; j++) {

			//Check if the card code of the Member equals the card code of the CF, then the Member exist
			if (mapMember[j].MemberCode === objectCf.RowBelongTo) {	//mapCF[i].CFcode

				//If a Member exist we count it 
				cntMembers++;

				//We create the member object with data stored into the mapMember
				var objectMember = getObject(form, mapMember[j].MemberRows);

				//We add it to the card
				tableRow = table.addRow();
				tableRow.addCell(objectMember.RowId, "valueText valueTextLeft alignCenter", 1);
				
				//If the family name of a member is different of that the CF, we add the family name of the member
				if (objectMember.FamilyName !==  objectCf.FamilyName) {
					tableRow.addCell(objectMember.FirstName + " " + objectMember.MiddleName + " " + objectMember.FamilyName, "valueText valueTextRight bold", 1);
				} else {
					tableRow.addCell(objectMember.FirstName + " " + objectMember.MiddleName, "valueText valueTextRight bold", 1);
				}
				
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(objectMember.DateOfBirth), "valueText valueTextRight", 1);
				
				if (objectMember.AddressStreet && objectMember.AddressPostalCode && objectMember.AddressLocality) {
					tableRow.addCell(objectMember.AddressStreet + ", " + objectMember.AddressPostalCode + " " + objectMember.AddressLocality, "valueText valueTextRight", 1);
				} else if (!objectMember.AddressStreet) {
					tableRow.addCell(objectMember.AddressPostalCode + " " + objectMember.AddressLocality, "valueText valueTextRight", 1);
				}
				
				tableRow.addCell(" ", " ", 1);
				tableRow.addCell(objectMember.Notes, "valueText valueTextRight", 1);
					
				if (objectMember.MemberVote === "1") {
					tableRow.addCell("Sì", "valueText alignCenter valueTextRight", 1);
				} else {
					tableRow.addCell("No", "valueText alignCenter valueTextRight", 1);
				}
				
				tableRow.addCell(objectMember.Paternity, "valueText valueTextRight", 1);
				
				if (objectMember.DateOfDeath && objectMember.ArchivedDate && objectMember.ArchivedNotes) {
					tableRow = table.addRow();
					tableRow.addCell("Decesso: " + Banana.Converter.toLocaleDateFormat(objectMember.DateOfDeath) + ", Archiviato: " + objectMember.ArchivedDate + " " + objectMember.ArchivedNotes, "valueText valueTextLeft valueTextRight", 8);
				} else if (!objectMember.DateOfDeath && objectMember.ArchivedDate && objectMember.ArchivedNotes) {
					tableRow = table.addRow();
					tableRow.addCell("Archiviato: " + Banana.Converter.toLocaleDateFormat(objectMember.ArchivedDate) + " " + objectMember.ArchivedNotes, "valueText valueTextLeft valueTextRight", 8);
				}
			}
		}

		//If there are no members we add an empty row to the table
		if (cntMembers == 0) { 
			tableRow = table.addRow();
			tableRow.addCell("-", "valueText alignCenter valueTextLeft", 1);
			tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
			tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
			tableRow.addCell(" ", " ", 1);
			tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
			tableRow.addCell("-", "valueText alignCenter valueTextRight", 1);
			tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
			tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
		}

		//We add the date of last saved
		tableRow = table.addRow();
		tableRow.addCell(" ", "valueTextTop", 11);
		tableRow = table.addRow();
		tableRow.addCell("Dati aggiornati al: " + Banana.Converter.toLocaleDateFormat(banDoc.info("Base", "DateLastSaved")), "valueText", 11);

		//Check if there are card codes used several times, then we add a warning message on the card page
		if (mapCF[i].CFisUnique === "false") {
			tableRow = table.addRow();
			tableRow.addCell("Errore: numero di scheda <" + objectCf.RowBelongTo + "> utilizzato più volte.", "warningMsg", 8);
		}

		//Add a page break after each card
		if (i < mapCF.length - 1) {
			tableRow = table.addRow();
			var a = tableRow.addCell();
			a.addPageBreak();
		}
	}
	return report;	
}


//The purpose of this function is to return a list of CF's rows
function getCF(form, cardNumber) {
	var rowNumberCfList = [];
	for (var i = 0; i < form.length; i++) {
		if (form[i].RowId === form[i].RowBelongTo && form[i].RowBelongTo === cardNumber) {
			var nRow = form[i].Row;
			rowNumberCfList.push(nRow);
		}
	}
	return rowNumberCfList;
}


//The purpose of this function is to return a list of the Members' rows
function getMembers(form, cardNumber) {
	var rowNumberMemberList = [];
	var nRow = "";
	for (var i = 0; i < form.length; i++) {
		if (form[i].RowId !== form[i].RowBelongTo && form[i].RowBelongTo === cardNumber) {
			nRow = form[i].Row;
			rowNumberMemberList.push(nRow);
		}
	}
	return rowNumberMemberList;
}


//The purpose of this function is to return the list of codes used to create the report
//It also checks if the cards selectet by the user exist
function printChoice(form, cardsToCheck) {
	
	var cardCodeList = [];

	//We get the full list of all card codes and we sort them
	var tmpList = getCardCodeList(form).sort(function(a,b) { return a - b; });

	//We create the card for the given card codes list from the dialog window
	if (cardsToCheck === "") { //All cards
		for (var i = 0; i < tmpList.length; i++) {
			cardCodeList.push(tmpList[i]);
		}		
	} else {
		if (cardsToCheck.indexOf(",") > -1) { //List of values divided by ";"
			cardCodeList = cardsToCheck.split(",");
		} else {
			cardCodeList = cardsToCheck.split(" "); //Single values
		}

		//Card codes that do not exist are removed from the list
		for (var i = 0; i < cardCodeList.length; i++) {
			if (tmpList.indexOf(cardCodeList[i]) < 0) { //not contained

				cfNotFound.push(cardCodeList[i]); //Add the not found code to the list
				var index = cardCodeList.indexOf(cardCodeList[i]);
				if (index > -1) {
					cardCodeList.splice(index,1); //remove card code
					i--;
				}
			}
		}
	}
	return cardCodeList;
}


//The purpose of this function is to print a message for each code not found
function addMessageCodesNotFound(banDoc) {
	for (var i = 0; i < cfNotFound.length; i++) {
		banDoc.addMessage("Scheda numero <" + cfNotFound[i] + "> inesistente.");
	}
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


//The purpose of this function is to return a list of the CF's card codes 
function getCardCodeList(form) {
	var cardCodeList = [];
	for (var i = 0; i < form.length; i++) {
		if (form[i].RowBelongTo && form[i].RowId && form[i].RowBelongTo === form[i].RowId) { //is a CF
			cardCodeList.push(form[i].RowBelongTo);
		}
	}
	return cardCodeList;
}


//The purpose of this function is to add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion, "footer");
}


//The purpose of this function is to create styles for the report print
function create_styleSheet() {
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
	style.setAttribute("font-size", "11px");
	style.setAttribute("padding-bottom", "5px"); 

	//Warning message.
	style = stylesheet.addStyle(".warningMsg");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("color", "red");
	style.setAttribute("font-size", "11");

	//Border
	style = stylesheet.addStyle(".valueTextRight");
	style.setAttribute("border-right", "thin solid black");
	
	style = stylesheet.addStyle(".valueTextLeft");
	style.setAttribute("border-left", "thin solid black");
	
	style = stylesheet.addStyle(".valueTextTop");
	style.setAttribute("border-top", "thin solid black");

	style = stylesheet.addStyle(".valueTextBottom");
	style.setAttribute("border-bottom", "thin solid black");

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

	//Table
	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");

	return stylesheet;
}
