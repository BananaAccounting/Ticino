// Copyright [2017] [Banana.ch SA - Lugano Switzerland]
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
// @pubdate = 2017-12-04
// @publisher = Banana.ch SA
// @description.it = Cerca tutte le parole
// @description.en = Search all words
// @description.de = Alle Wörter durchsuchen
// @description.fr = Rechercher tous les mots
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
		var isFound = false;

		//We create an array with the xml names of the tables in the document
		var tablesArray = Banana.document.tableNames;

		for (var i = 0; i < tablesArray.length; i++) {
			isFound |= searchText(tablesArray[i], textToSearch);
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
	var isFound = false;

	for (var j = 0; j < tableRow.length; j++) {

		if (!tableRow[j].isEmpty) {

			var string = JSON.stringify(tableRow[j]).toLowerCase();
			var words = textToSearch.toLowerCase().split(" ");
			var isFoundRow = true;
			/* search all words */
			for (var i = 0; i < words.length; i++) {
				if (string.indexOf(words[i]) == -1) { 
					isFoundRow = false;
				}
			}
		}
		if (isFoundRow) {
			var tRow = tableRow[j].rowNr;
			table.row(tableRow[j].rowNr).addMessage(texts.found);
			isFound = true;
		}
	}
	return isFound;
}


//Dialog window and results translations
function setTexts(language) {
	var texts = {};
	if (language == 'enu') {
		texts.dialogtxt1 = 'Find';
		texts.dialogtxt2 = 'Search words';
		texts.dialogtxt3 = '';
		texts.found = 'Words found';
		texts.notFound = 'Words not found';
	}
	else if (language == 'ita') {
		texts.dialogtxt1 = 'Trova';
		texts.dialogtxt2 = 'Cerca parole';
		texts.dialogtxt3 = '';
		texts.found = 'Parole trovate';
		texts.notFound = 'Parole non trovate';
	}
	else if (language == 'fra') {
		texts.dialogtxt1 = 'Rechercher';
		texts.dialogtxt2 = 'Mots à rechercher';
		texts.dialogtxt3 = '';
		texts.found = 'Mots trouvés';
		texts.notFound = 'Mots non trouvés';
	}
	else if (language == 'deu') {
		texts.dialogtxt1 = 'Suchen';
		texts.dialogtxt2 = 'Zu suchende Wörter';
		texts.dialogtxt3 = '';
		texts.found = 'Wörter gefunden';
		texts.notFound = 'Wörter nicht gefunden';
	}
	return texts;
}



