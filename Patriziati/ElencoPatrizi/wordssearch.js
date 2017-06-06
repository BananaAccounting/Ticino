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
// @id = ch.banana.app.search
// @api = 1.0
// @pubdate = 2017-06-06
// @publisher = Banana.ch SA
// @description.it = Cerca
// @description.en = Search
// @description.de = Suche
// @description.fr = Recherche
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



//Main function
function exec() {
	
	if (!Banana.document) {
		return;
	}

	//Clear old messages
	Banana.document.clearMessages();
	
	var lan = Banana.document.info("Base","Language");
	texts = setTexts(lan);

	//Show a dialog window and return the inserted text or undefined if the user clicked cancel
	var textToSearch = Banana.Ui.getText(texts.dialogtxt1, texts.dialogtxt2, texts.dialogtxt3);

	//We seacrh the inserted text on each table of the accounting
	if (textToSearch) {
		textToSearch = textToSearch.trim();
		Banana.application.showMessages(); //Next messages are showed to the user through the message dialog
		isFound = false;

		//We create an array with the xml names of the tables in the document
		var tablesArray = Banana.document.tableNames;

		for (var i = 0; i < tablesArray.length; i++) {
			searchText(tablesArray[i], textToSearch);
		}

		if (!isFound) {
			Banana.document.addMessage('"' + textToSearch + '" ' + texts.notFound);
		}
	} 
	else {
		return;
	}
}


//This function looks for the text into the table of the document
function searchText(accouningTable, textToSearch) {
	
	var table = Banana.document.table(accouningTable);
	var tableRow = Banana.document.table(accouningTable).rows;

	for (var j = 0; j < tableRow.length; j++) {

		if (!tableRow[j].isEmpty) {

			var string = JSON.stringify(tableRow[j]);
			var stringU = string.toUpperCase();
			var stringL = string.toLowerCase();
			var text = textToSearch.split(" ");

			for (var i = 0; i < text.length; i++) {

				if (string.indexOf(text[i]) > -1) { 
					var tRow = tableRow[j].rowNr;
					table.row(tRow).addMessage('"' + text[i] + '" ' + texts.found);
					isFound = true;
				}
				else if (stringU.indexOf(text[i]) > -1) {
					var tRow = tableRow[j].rowNr;
					table.row(tRow).addMessage('"' + text[i] + '" ' + texts.found);
					isFound = true;
				}
				else if (stringL.indexOf(text[i]) > -1) {
					var tRow = tableRow[j].rowNr;
					table.row(tRow).addMessage('"' + text[i] + '" ' + texts.found);
					isFound = true;
				}
			}
		}
	}
}


//Dialog window and results translations
function setTexts(language) {
	var texts = {};
	if (language == 'enu') {
		texts.dialogtxt1 = 'Find';
		texts.dialogtxt2 = 'Search text';
		texts.dialogtxt3 = '';
		texts.found = 'Text found';
		texts.notFound = 'Text not found';
	}
	else if (language == 'ita') {
		texts.dialogtxt1 = 'Trova';
		texts.dialogtxt2 = 'Cerca testo';
		texts.dialogtxt3 = '';
		texts.found = 'Testo trovato';
		texts.notFound = 'Testo non trovato';
	}
	else if (language == 'fra') {
		texts.dialogtxt1 = 'Rechercher';
		texts.dialogtxt2 = 'Chercher texte';
		texts.dialogtxt3 = '';
		texts.found = 'Texte trouvé';
		texts.notFound = 'Texte non trouvé';
	}
	else if (language == 'deu') {
		texts.dialogtxt1 = 'Suchen';
		texts.dialogtxt2 = 'Suchen nach';
		texts.dialogtxt3 = '';
		texts.found = 'Text gefunden';
		texts.notFound = 'Text nicht gefunden';
	}
	return texts;
}



