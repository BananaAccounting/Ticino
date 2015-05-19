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
// @id = ch.banana.addon.elencopatrizi
// @api = 1.0
// @pubdate = 2015-05-19
// @publisher = Banana.ch SA
// @description = Elenco Patrizi
// @task = app.command
// @doctype = 400.130 
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



var scriptVersion = "script v. 2015-05-19";
var form = [];


//Main function ss
function exec() {
	
	if (!Banana.document) {
		return;
	}
	
	//Clear old messages
	Banana.document.clearMessages();

	//Function call to create the report
	var report = createCards(Banana.document, form);
	
	//Print the report
	var stylesheet = create_styleSheet();
	Banana.Report.preview(report, stylesheet);	
}




//The purpose of this function is to upload the data taken from the Banana document table
function loadForm(banDoc) {
	var contactsTable = banDoc.table("Contacts");
	var code2List = []; //list used to check for "code2" duplicates
	var idList = []; //list used to check for "id" duplicates
	
	//We read the Banana document table row by row
	for (var j = 0; j < contactsTable.rowCount; j++) {
		var tRow = contactsTable.row(j);
		
		//If the row table is not completely empty we get the values
		if (!tRow.isEmpty) {
			var code1 = tRow.value("Code1");
			var code2 = tRow.value("Code2");
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
			var archivedDate = tRow.value("ArchivedDate");
			var archivedNotes = tRow.value("ArchivedNotes");
			
			var index = "";
			
			//Check if the card code, id and belong values exist
			//To save the data and then to create the cards, these three values must exist
			//The members without them will not be added to the report, and a message in Banana will be displayed
			if (code2 && id && belong) {
	
				//Add the "id" value to the list
				idList.push(id);
				
				//Check if it's a CF, then add "code2" value to the list
				if (code2 === id) {
					code2List.push(code2);
					
					//Check if there is a "code2" duplicate, then we remove it from the list and we add a message
					//This because each CF must have a unique code2 value (card code number)
					if (!checkIfArrayContainsDuplicate(code2List)) {
						index = code2List.indexOf(code2);
						if (index > -1) {
							code2List.splice(index,1);
						}
						tRow.addMessage("Impossibile aggiungere la scheda. Il numero di scheda (Code2) <" + code2 +"> è già utilizzato per un altro fuoco.");
					}
				}
				
				//Check if there is an "id" duplicate, then we remove it from the list and we add a message
				//This because each member (CF or not) must have a unique id value
				if (!checkIfArrayContainsDuplicate(idList)) {
					index = idList.indexOf(id);
					if (index > -1) {
						idList.splice(index,1);
					}
					tRow.addMessage("Impossibile aggiungere la scheda. Id <"+ id +"> già esistente.");
				} else { //If everything is ok (no duplicates), we save the data into the form
					form.push({
						"Code1":code1,
						"Code2":code2,
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
						"ArchivedDate":archivedDate,
						"ArchivedNotes":archivedNotes
					});
				}
			} else if (!code2 && !id && !belong) { //If the three vales (or one of them) do not exist, then we add a message and we don't save the data
				tRow.addMessage("Impossibile aggiungere la scheda. <Code2,Id,Belong> mancanti.");		
			} else if (!code2) {
				tRow.addMessage("Impossibile aggiungere la scheda. <Code2> mancante.");
			} else if (!id) {
				tRow.addMessage("Impossibile aggiungere la scheda. <Id> mancante.");
			} else if (!belong) {
				tRow.addMessage("Impossibile aggiungere la scheda. <Belong> mancante.");
			}
		}
	}
}




//The purpose of this function is to create the report, one card per page
function createCards(banDoc, form) {
	var report = Banana.Report.newReport("Elenco Patrizi");
	var table = report.addTable("table");
	var cardCodeList = [];

	//Load all data and add the footer
	loadForm(banDoc);
	addFooter(banDoc, report);

	//We take a list of CF's card codes and order them
	//This because we want to print the cards in ascending order
	cardCodeList = getCardCodeList(form).sort(function(a,b) { return a - b; });

	//For each "cardCode" we create the card, adding tiles, CF and any members
	for (var i = 0; i < cardCodeList.length; i++) {

		tableRow = table.addRow();
		tableRow.addCell(banDoc.info("AccountingDataBase", "Company"), "heading1 bold", 6);
		
		tableRow = table.addRow();
		tableRow.addCell("Registro dei fuochi, dei patrizi e dei votanti", "heading2 bold", 6);
		
		tableRow = table.addRow();
		tableRow.addCell("","",6);
		
		tableRow = table.addRow();
		tableRow.addCell("Scheda n. ", "heading3", 1);
		tableRow.addCell(cardCodeList[i], "heading3 bold", 1);
		
		tableRow = table.addRow();
		tableRow.addCell("Scheda antecedente n. ", "heading3", 1);
		
		if (getValue(form, cardCodeList[i], "RowBelongTo2")) {
			tableRow.addCell(getValue(form, cardCodeList[i], "RowBelongTo2"), "heading3 bold", 1);
		} else {
			tableRow.addCell(" - ", "heading3 bold", 1);
		}
		
		tableRow = table.addRow();
		tableRow.addCell(" ", " ", 6);
		
		//We create a group of members with the current card code
		var groupForm = getGroup(form, cardCodeList[i]);

		//For each member belonging to the same group, we check if it is a CF or a normal member
		for (var j = 0; j < groupForm.length; j++) {
			
			//Is a CF
			if (groupForm[j].Code2 === groupForm[j].RowId) {

				tableRow = table.addRow();
				tableRow.addCell("Cognome", "valueText valueTextTop valueTextLeft valueTextRight", 6);
				
				tableRow = table.addRow();
				tableRow.addCell(groupForm[j].FamilyName, "valueText bold valueTextLeft valueTextRight", 6);
				
				tableRow = table.addRow();
				tableRow.addCell("Rappresentante del fuoco", "valueText valueTextTop valueTextLeft valueTextRight italic", 6);
				
				tableRow = table.addRow();
				tableRow.addCell("Nome", "valueText valueTextLeft valueTextBottom", 1);
				tableRow.addCell("Data di nascita", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Indirizzo - Domicilio", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Scheda succ.", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Osservazioni", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Diritto di voto", "valueText valueTextBottom valueTextRight", 1);
				
				tableRow = table.addRow();
				tableRow.addCell(groupForm[j].FirstName, "valueText bold valueTextLeft valueTextRight", 1);
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(groupForm[j].DateOfBirth), "valueText valueTextRight", 1);
				
				if (groupForm[j].AddressStreet && groupForm[j].AddressPostalCode && groupForm[j].AddressLocality) {
					tableRow.addCell(groupForm[j].AddressStreet + ", " + groupForm[j].AddressPostalCode + " " + groupForm[j].AddressLocality, "valueText valueTextRight", 1);
				} else if (!groupForm[j].AddressStreet) {
					tableRow.addCell(groupForm[j].AddressPostalCode + " " + groupForm[j].AddressLocality, "valueText valueTextRight", 1);
				}

				tableRow.addCell(" ", " ", 1);
				tableRow.addCell(groupForm[j].ArchivedNotes, "valueText valueTextRight", 1);
				
				if (groupForm[j].MemberVote === "1") {
					tableRow.addCell("Sì", "valueText alignCenter valueTextRight", 1);
				}

				tableRow = table.addRow();
				tableRow.addCell("Altri membri del fuoco", "valueText valueTextTop valueTextLeft valueTextRight italic", 6);
				
				tableRow = table.addRow();
				tableRow.addCell("Nome", "valueText valueTextLeft valueTextBottom", 1);
				tableRow.addCell("Data di nascita", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Indirizzo - Domicilio", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Scheda succ.", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Osservazioni", "valueText valueTextRight valueTextBottom", 1);
				tableRow.addCell("Diritto di voto", "valueText valueTextBottom valueTextRight", 1);

			//Is a member
			} else if (groupForm[j].Code2 !== groupForm[j].RowId && groupForm[j].RowBelongTo === groupForm[j].Code2) {
				tableRow = table.addRow();
				tableRow.addCell(groupForm[j].FirstName, "valueText valueTextLeft", 1);
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(groupForm[j].DateOfBirth), "valueText valueTextRight", 1);
				
				if (groupForm[j].AddressStreet && groupForm[j].AddressPostalCode && groupForm[j].AddressLocality) {
					tableRow.addCell(groupForm[j].AddressStreet + ", " + groupForm[j].AddressPostalCode + " " + groupForm[j].AddressLocality, "valueText valueTextRight", 1);
				} else if (!groupForm[j].AddressStreet) {
					tableRow.addCell(groupForm[j].AddressPostalCode + " " + groupForm[j].AddressLocality, "valueText valueTextRight", 1);
				}
				
				tableRow.addCell(" ", " ", 1);
				tableRow.addCell(groupForm[j].ArchivedNotes, "valueText valueTextRight", 1);
					
				if (groupForm[j].MemberVote === "1") {
					tableRow.addCell("Sì", "valueText alignCenter valueTextRight", 1);
				} else {
					tableRow.addCell("No", "valueText alignCenter valueTextRight", 1);
				}
			}

			//Print empty row if there are not members
			if (groupForm.length === 1) {
				tableRow = table.addRow();
				tableRow.addCell("-", "valueText alignCenter valueTextLeft", 1);
				tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
				tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
				tableRow.addCell(" ", " ", 1);
				tableRow.addCell("-", "valueText valueTextRight alignCenter", 1);
				tableRow.addCell("-", "valueText alignCenter alignCenter valueTextRight", 1);
			}
		}
		
		tableRow = table.addRow();
		tableRow.addCell("", "valueTextTop", 6);
		
		//We add the date of last saved
		tableRow = table.addRow();
		var dateLastSaved = tableRow.addCell();
		dateLastSaved.addParagraph("Aggiornato al: " + Banana.Converter.toLocaleDateFormat(banDoc.info("Base", "DateLastSaved")), "valueText", 6);
		
		//Add a page break after each card
		if (i < cardCodeList.length-1) {
			tableRow = table.addRow();
			var a = tableRow.addCell();
			a.addPageBreak();
		}
	}
	return report;	
}




//The purpose of this function is to check if an array of elements contains duplicates
function checkIfArrayContainsDuplicate(array) {
	//array.sort();  //alphabetical sort (1,10,100,3,43)
	array.sort(function(a,b) { return a - b; });  //numerical sort (1,3,10,43,100)
	for (var i = 1; i < array.length; i++) {
		if (array[i-1] === array[i]) {
			return false;
		}
	}
	return true;
}




//The purpose of this function is to create a group of elements with the same cardCode
function getGroup(form, cardCode) {
	var formGroup = [];
	for (var i = 0; i < form.length; i++) {
		if (form[i].Code2 === cardCode) {
			formGroup.push(form[i]);
		}
	}
	return formGroup;
}




//The purpose of this function is to return a specific field value of the form
function getValue(source, cardCode, field) {
	var searchCode = cardCode.trim();
	for (var i = 0; i < source.length; i++) {
		if (source[i].Code2 === searchCode) {
			return source[i][field];
		}
	}
	throw "Couldn't find object with card code: " + cardCode;
}




//The purpose of this function is to return a list of the CF's card codes 
function getCardCodeList(form) {
	var cardCodeList = [];
	for (var i = 0; i < form.length; i++) {
		if (form[i].Code2 && form[i].RowId && form[i].Code2 === form[i].RowId) { //is a CF
			cardCodeList.push(form[i].Code2);
		}
	}
	return cardCodeList;
}




//The purpose of this function is to add a Footer to the report
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

	return stylesheet;
}
