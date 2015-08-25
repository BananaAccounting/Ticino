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
// @id = ch.banana.addon.patriziatoriassuntoconsuntivo
// @api = 1.0
// @pubdate = 2015-08-25
// @publisher = Banana.ch SA
// @description = Riassunto del preventivo
// @task = app.command
// @doctype = *
// @docproperties = patriziato
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



//This is the function that loads our parameterized structure.
//We create objects by adding some parameters that will be used to extract informations from Banana and to determine their behavior and purpose.
//The parameters are:
// - id		 	  : this is a UNIQUE id for each object contained in the structure;
// - type 	     : used to differentiate the TYPE of object (title, text, debit, credit, sum, separator, temp, checkifzero);
// - description : used to specify the description text of the object;
// - value       : (ONLY for type "text") this will contain the information values taken from Banana -> File Properties;
// - code		  : (ONLY for type "debit/credit/temp/checkifzero") this will contain the group id contained in Banana;
// - sum		     : (ONLY for type "sum/temp/checkifzero"") used to sum/subtract objects amounts to calculate totals.
function load_form(param) {

	var form = [];

   form.push({"id":"CE", "type":"title", "description":"Conto economico"});

   form.push({"id":"A", "type":"debit", "description":"Spese operative", "code":"30;31;33;35;36;37"});
   form.push({"id":"B", "type":"credit", "description":"Ricavi operativi", "code":"40;41;42;43;45;46;47"});
   form.push({"id":"C", "type":"sum", "description":"Risultato operativo", "sum":"B;-A"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"D", "type":"debit", "description":"Spese finanziarie", "code":"34"});
   form.push({"id":"E", "type":"credit", "description":"Ricavi finanziari", "code":"44"});
   form.push({"id":"F", "type":"sum", "description":"Risultato finanziario", "sum":"E;-D"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"G", "type":"sum", "description":"Risultato ordinario", "sum":"C;F"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"H", "type":"debit", "description":"Spese straordinarie", "code":"38"});
   form.push({"id":"I", "type":"credit", "description":"Ricavi straordinari", "code":"48"});
   form.push({"id":"L", "type":"sum", "description":"Risultato straordinario", "sum":"I;-H"});
   form.push({"id":"C", "type":"separator"});

   form.push({"id":"M", "type":"sum", "description":"Risultato d'esercizio", "sum":"G;L"});

   // Control amounts
   form.push({"id":"TB11", "type":"temp", "description":"Risultato d'esercizio da contabilità", "code":"02"});
   form.push({"id":"TB12", "type":"checkifzero", "description":"Errore: differenza risultato d'esercizio con contabiltà", "sum":"M;TB11"});
   form.push({"id":"TB21", "type":"checkifzero", "description":"Errore: differenza addebiti/accrediti interni in contabilità", "code":"39;49"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"CI", "type":"title", "description":"Conto degli investimenti"});

   form.push({"id":"N", "type":"debit", "description":"Uscite per investimenti", "code":"5"});
   form.push({"id":"O", "type":"credit", "description":"Entrate per investimenti", "code":"6"});
   form.push({"id":"P", "type":"sum", "description":"Investimenti netti", "sum":"N;-O"});
   form.push({"id":"TB31", "type":"temp", "description":"Investimenti netti da contabilità", "code":"03"});
   form.push({"id":"TB32", "type":"checkifzero", "description":"Errore: differenza investimenti netti", "sum":"P;-TB31"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"CC", "type":"title", "description":"Conto di chiusura"});

   form.push({"id":"P2", "type":"sum", "description":"Investimenti netti", "sum":"P"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"Q", "type":"debit", "description":"Ammortamenti ordinari", "code":"33;365;366"});
   form.push({"id":"R", "type":"debit", "description":"Ammortamenti straordinari", "code":"383;385;389"});
   form.push({"id":"M2", "type":"sum", "description":"Risultato d'esercizio", "sum":"M"});
   form.push({"id":"S", "type":"sum", "description":"Autofinanziamento", "sum":"Q;R;M2"});
   form.push({"id":"", "type":"separator"});

   form.push({"id":"T", "type":"sum", "description":"Risultato totale", "sum":"P;-S"});


   param.form = form;
}


//Variable used to speficy the rounding type
var rounding = 2;


//Main function
function exec(string) {
	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}
	
   //Variable by check_totals() and check_balance() functions to check if use them to create the "normal-report" or to create the "test-report".
   //The reports are differents: on test-report we don't want to display any dialog boxes.
   var isTest = false;

   //Function call to create the report
   var report = create_report(Banana.document, "", "", isTest);

   //Print the report
   var stylesheet = create_styleSheet();
   Banana.Report.preview(report, stylesheet);
}



//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

//Function that create the report
function create_report(banDoc, startDate, endDate, isTest) {

	var param = {
//      "reportName":"Riassunto del consuntivo", //Save the report's name
      "reportName":"Riassunto del preventivo", //Save the report's name
      "bananaVersion":"Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion"), //Save the version of Banana Accounting used
      "scriptVersion": "Script v. " + Banana.script.getParamValue("pubdate"),	//Save the version of the script
      "company":banDoc.info("AccountingDataBase","Company"), //Save the company name
      "currentYear": banDoc.info("AccountingDataBase", "ClosureDate").substr(0,4), //Save the current year
      "previos": banDoc.info("AccountingDataBase", "ClosureDate").substr(0,4), //Save the current year
   };

   var banDocPrev = null;
   var banDocPrevFileName = banDoc.info("AccountingDataBase","FileNamePreviousYear");
   if (banDocPrevFileName.length > 0) {
      banDocPrev = Banana.application.openDocument(banDocPrevFileName);
   }

   var banDocPrev2 = null;
   if (banDocPrev) {
      var banDocPrev2FileName = banDocPrev.info("AccountingDataBase","FileNamePreviousYear");
      if (banDocPrev2FileName.length > 0) {
         banDocPrev2 = Banana.application.openDocument(banDocPrev2FileName);
      }
   }

   // Consuntivo
//   param.columns = [
//      {"header":"Cons. " + param.currentYear, "value":"currentBalance"},
//      {"header":"Prev. " + param.currentYear, "value":"budgetBalance"},
//      {"header":"Cons. " + (param.currentYear-1), "value":"previousBalance"}
//   ] //Save the columns to print

   // Preventivo
   param.columns = [
      {"header":"Prev. " + param.currentYear, "value":"budgetBalance"},
      {"header":"Prev. " + (param.currentYear-1), "value":"previousBudgetBalance"},
      {"header":"Cons. " + (param.currentYear-2), "value":"previous2Balance"}
   ] //Save the columns to print


	//Loading data and calculate the totals
	load_form(param);
   load_form_balances(banDoc, banDocPrev, banDocPrev2, param.form);
   calc_form_totals(param.form, param.columns);
	
	//Create a report.
	var report = Banana.Report.newReport(param.reportName);
	
	//Adding a footer.
	add_footer(report, param);
	
	//Variables used for the report's style.
	var styleCellBlack = "black";
	var styleCellTextAlignRight = "right";
	var styleDescription = "description";
	var styleDescriptionBold = "descriptionBold";
	var styleExpanding = "expanding";
	var styleHeading1 = "heading1";
	var styleHeading2 = "heading2";
	var styleHeading3 = "heading3";
	var styleHeading4 = "heading4";
	var styleHorizontalLine = "horizontalLine";
	var styleRowNumber = "rowNumber";
   var styleTableHeader = "tableHeader";
	var styleValueAmount = "valueAmount";
	var styleValueDate = "valueDate";
	var styleValueText = "valueText";
	var styleValueTotal = "valueTotal";
	var styleValueTitle = "valueTitle";
	var styleValueTitle1 = "valueTitle1";
   var styleWarningMsg = "warningMsg";

	//Begin printing the report...
	
	//Title
   report.addParagraph(param.company, styleHeading2);
   report.addParagraph(param.reportName + " " + param.currentYear, styleHeading1);

   var formatAmount = Banana.Converter.toLocaleNumberFormat;

	//Table with basic informations
   var table = report.addTable("table");

   // Headers
   tableRow = table.addRow();
   tableRow.addCell("");
   for (var i in param.columns) {
      tableRow.addCell(param.columns[i].header, styleTableHeader);
   }

   // Rows
   for (var i in param.form) {
      var formObjId = param.form[i].id;
      if (param.form[i].type === "title") {
         tableRow = table.addRow();
         tableRow.addCell(get_value(param.form, formObjId, "description"), styleHeading2);
         for (var i in param.columns) {
            tableRow.addCell("");
         }
      } else if (param.form[i].type === "sum") {
         tableRow = table.addRow();
         tableRow.addCell(get_value(param.form, formObjId, "description"), styleHeading4);
         for (var i in param.columns) {
            tableRow.addCell(formatAmount(get_value(param.form, formObjId, param.columns[i].value)), styleValueAmount);
         }
      } else if (param.form[i].type === "credit" || param.form[i].type === "debit") {
         tableRow = table.addRow();
         tableRow.addCell(get_value(param.form, formObjId, "description"), styleDescription);
         for (var i in param.columns) {
            tableRow.addCell(formatAmount(get_value(param.form, formObjId, param.columns[i].value)), styleValueAmount);
         }
      } else if (param.form[i].type === "text") {
         tableRow = table.addRow();
         tableRow.addCell(get_value(param.form, formObjId, "description"), styleDescription);
         for (var i in param.columns) {
            tableRow.addCell(formatAmount(get_value(param.form, formObjId, param.columns[i].value)), styleValueText);
         }
      } else if (param.form[i].type === "separator") {
         tableRow = table.addRow();
         for (var i in param.columns) {
            tableRow.addCell("");
         }
      } else if (param.form[i].type === "temp") {
         // Don't print
      } else if (param.form[i].type === "checkifzero") {
         if (!Banana.SDecimal.isZero(get_value(param.form, formObjId, "currentBalance")) ||
             !Banana.SDecimal.isZero(get_value(param.form, formObjId, "budgetBalance"))) {
            tableRow = table.addRow(styleWarningMsg);
            tableRow.addCell(get_value(param.form, formObjId, "description"), styleHeading4);
            for (var i in param.columns) {
               tableRow.addCell(formatAmount(get_value(param.form, formObjId, param.columns[i].value)), styleValueAmount);
            }
         }
      }
   }

   //check_totals(param.form, "4.27", "4.28;4.29;4.30", report, isTest);
	
	//Verification of the balance values
   //check_balance(banDoc, param.form, report, isTest);
		
	return report;
}


//The purpose of this function is to verify two sums.
//Given two lists of values divided by the character ";" the function creates two totals and compares them.
//It is also possible to compare directly single values, instead of a list of values.
function check_totals(source, valuesList1, valuesList2, report, isTest) {
	//Calculate the first total
	if (valuesList1) {
		var total1 = 0;
		var arr1 = valuesList1.split(";");
		for (var i = 0; i < arr1.length; i++) {
			total1 = Banana.SDecimal.add(total1, get_value(source, arr1[i], "vatTaxable"), {'decimals':rounding});
		}
	}
	
	//Calculate the second total
	if (valuesList2) {
		var total2 = 0;
		var arr2 = valuesList2.split(";");
		for (var i = 0; i < arr2.length; i++) {
			total2 = Banana.SDecimal.add(total2, get_value(source, arr2[i], "vatTaxable"), {'decimals':rounding});
		}
	}
	
	//Finally, compare the two totals.
	//If there are differences, a message and a dialog box warns the user
	if (Banana.SDecimal.compare(total1, total2) !== 0) {
		if (!isTest) {
			//Add an information dialog.
			Banana.Ui.showInformation("Warning!", "Different values: Total " + valuesList1 + " <" + Banana.Converter.toLocaleNumberFormat(total1) + 
			">, Total " + valuesList2 + " <" + Banana.Converter.toLocaleNumberFormat(total2) + ">");
		}
		
		//Add a message on the report.
		report.addParagraph("Warning! Different values: Total " + valuesList1 + " <" + Banana.Converter.toLocaleNumberFormat(total1) + 
		">, Total " + valuesList2 + " <" + Banana.Converter.toLocaleNumberFormat(total2) + ">", "warningMsg");
	}
}


//The purpose of this function is to verify if the balance from Banana euquals the report total
function check_balance(banDoc, form, report, isTest) {
}


//The purpose of this function is to calculate the vatTaxable and vatAmount balances, then load these values into the structure
function load_form_balances(banDoc, banDocPrev, banDocPrev2, form) {
   var accounts = banDoc.table("Accounts");
   if (!accounts) {
		return;
	}
	
	for (var i in form) {
      if (form[i].code && form[i].code.length > 0) {
         var groupSelector = "Gr=" + form[i].code.replace(/;/g,'|');
         var balance = banDoc.currentBalance(groupSelector).balance;
         var budget = banDoc.budgetBalance(groupSelector).balance;
         var previousBalance = banDocPrev ? banDocPrev.currentBalance(groupSelector).balance : "";
         var previousBudget = banDocPrev ? banDocPrev.budgetBalance(groupSelector).balance : "";
         var previous2Balance = banDocPrev2 ? banDocPrev2.currentBalance(groupSelector).balance : "";
         var previous2Budget = banDocPrev2 ? banDocPrev2.budgetBalance(groupSelector).balance : "";

         if (form[i].type === "credit") {
            balance = Banana.SDecimal.invert(balance);
            budget = Banana.SDecimal.invert(budget);
            previousBalance = Banana.SDecimal.invert(previousBalance);
            previousBudget = Banana.SDecimal.invert(previousBudget);
            previous2Balance = Banana.SDecimal.invert(previous2Balance);
            previous2Budget = Banana.SDecimal.invert(previous2Budget);
         }

         form[i].currentBalance = balance;
         form[i].budgetBalance = budget;
         form[i].previousBalance = previousBalance;
         form[i].previousBudgetBalance = previousBudget;
         form[i].previous2Balance = previous2Balance;
         form[i].previous2BudgetBalance = previous2Budget;
      }
   }
}


//Calculate all totals of the form
function calc_form_totals(form, fields) {
	for (var i = 0; i < form.length; i++) {
      calc_form_total(form, form[i].id, fields);
	}
}


//Calculate a total of the form
function calc_form_total(form, id, fields) {
	
	var valueObj = get_object(form, id);
	
   if (valueObj[fields[0].value]) { //first field is present
		return; //calc already done, return
	}
	
	if (valueObj.sum) {
		var sumElements = valueObj.sum.split(";");	
		
		for (var k = 0; k < sumElements.length; k++) {
			var entry = sumElements[k].trim();
			if (entry.length <= 0) {
				return true;
			}
			
			var isNegative = false;
			if (entry.indexOf("-") >= 0) {
				isNegative = true;
				entry = entry.substring(1);
			}
			
			//Calulate recursively
			calc_form_total(form, entry, fields);  
			
          for (var j = 0; j < fields.length; j++) {
            var fieldName = fields[j].value;
				var fieldValue = get_value(form, entry, fieldName);
				if (fieldValue) {
					if (isNegative) {
						//Invert sign
						fieldValue = Banana.SDecimal.invert(fieldValue);
					}
					valueObj[fieldName] = Banana.SDecimal.add(valueObj[fieldName], fieldValue, {'decimals':rounding});
				}
			}
		}
	} else if (valueObj.code) {
		//Already calculated in load_form_balances()
	}
}


//The purpose of this function is to return a specific field value from the object.
//When calling this function, it's necessary to speficy the source (the structure), the object ID, and the field (parameter) needed.
function get_value(source, id, field) {
	var searchId = id.trim();
	for (var i = 0; i < source.length; i++) {
		if (source[i].id === searchId) {
			return source[i][field];
		}
	}
	throw "Couldn't find object with id:" + id;
}


//This function is very similar to the get_value() function.
//Instead of returning a specific field from an object, this function return the whole object.
function get_object(source, id) {
	for (var i = 0; i < source.length; i++) {
		if (source[i]["id"] === id) {
			return source[i];
		}
	}
	throw "Couldn't find object with id: " + id;
}


//This function adds a Footer to the report
function add_footer(report, param) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText(param.bananaVersion + ", " + param.scriptVersion + ", ", "description");
   //versionLine.excludeFromTest();
   report.getFooter().addText("Seite ", "description");
   report.getFooter().addFieldPageNr();
}


//The main purpose of this function is to create styles for the report print
function create_styleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

	var style = stylesheet.addStyle(".description");
	style.setAttribute("font-size", "8px");
	
	style = stylesheet.addStyle(".description1");
	style.setAttribute("font-size", "7px");
	style.setAttribute("text-align", "center");

	style = stylesheet.addStyle(".descriptionBold");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font", "Times New Roman");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");
	style.setAttribute("font-weight", "bold");
   style.setAttribute("margin-bottom", "2em");

	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", "14px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading3");
	style.setAttribute("font-size", "11px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading4");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".horizontalLine");
	style.setAttribute("border-top", "1px solid black");

	style = stylesheet.addStyle(".rowNumber");
	style.setAttribute("font-size", "9px");

	style = stylesheet.addStyle(".valueAmount");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");
	
	style = stylesheet.addStyle(".valueDate");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 

	style = stylesheet.addStyle(".valueText");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	
	style = stylesheet.addStyle(".valueTitle");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");
	
	style = stylesheet.addStyle(".valueTitle1");
	style.setAttribute("font-size", "7px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");
	
	style = stylesheet.addStyle(".valueTotal");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");
	style.setAttribute("border-bottom", "1px double black");

   style = stylesheet.addStyle(".tableHeader");
   style.setAttribute("text-align", "right");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", "8px");	
	
	//Warning message.
	style = stylesheet.addStyle(".warningMsg");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("color", "red");
	style.setAttribute("font-size", "10");

	return stylesheet;
}
