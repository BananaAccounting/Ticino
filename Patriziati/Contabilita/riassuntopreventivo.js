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
// @id = ch.banana.app.patriziato.riassuntopreventivo
// @api = 1.0
// @pubdate = 2024-10-15
// @publisher = Banana.ch SA
// @description = Riassunto del preventivo
// @task = app.command
// @doctype = 100.*
// @docproperties = patriziato
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



//This is the function that defines the structure of the report.
//We create objects that represent the report's rows, and set the parameters that will be used to
//extract informations from Banana, determine their behavior and set the styles.
//The parameters are:
// - id		 	    : this is a unique id for each object contained in the structure;
// - type 	       : used to differentiate the type of row;
//    - title      : title row, print a title row without amounts or text
//    - text       : text row, print the text contained in the array values as text
//    - amount     : amount row, print the text contained in the array values as amounts
//    - total      : amount row, print the text contained in the array values as amounts
//    - empty      : an empty row, used to insert an empty space between rows
//    - hidden     : this row is not printed, it is used for calculation purposes
//    - testifzero : this row is only printed if the test fails
// - description : used to specify the description of the row;
// - account	  : define the account for which the amounts are retrieved from the accounting
// - sign        : only together with account parameter, can be empty, 'invert' or 'normalize'.
//                 If empty the amounts are untouched, if 'invert' the sign of the amounts
//                 are inverted, if 'normalize' the amounts are inverted only for bclass 2 and 4.
// - sum		     : values are the sum of the defined object's ids,
//                 if an id is preceded by a '-' the corresponding amounts are substracted;
// - values      : an array of string with the values to be printed for each column,
//                 or a function that return an array of string with the values to be printed for each column,
//                 (only with objects of type 'headerrow' and 'textrow')
// - styles      : array of styles to add to the row

function load_form(param) {

   // The name of report
   param.reportName = "Riassunto del preventivo"


   // The parameter form define the content of the report
   var form = [];
   param.form = form;

   form.push({ "id": "", "type": "text", "description": "", "values": ["Preventivo", "Preventivo", "Consuntivo"], "styles": ["header"] });
   form.push({ "id": "", "type": "text", "description": "", "values": [param.currentYear, param.previousYear, param.previous2Year], "styles": ["header"] });

   form.push({ "id": "CE", "type": "title", "description": "Conto economico" });

   form.push({ "id": "A", "type": "amount", "description": "Spese operative", "account": "Gr=30|31|33|35|36|37", "styles": ["level3"] });
   form.push({ "id": "B", "type": "amount", "description": "Ricavi operativi", "account": "Gr=40|41|42|43|45|46|47", "styles": ["level3"] });
   form.push({ "id": "C", "type": "total", "description": "Risultato operativo", "sum": "B;-A", "styles": ["level2"] });
   form.push({ "id": "", "type": "empty" });

   form.push({ "id": "D", "type": "amount", "description": "Spese finanziarie", "account": "Gr=34", "styles": ["level3"] });
   form.push({ "id": "E", "type": "amount", "description": "Ricavi finanziari", "account": "Gr=44", "styles": ["level3"] });
   form.push({ "id": "F", "type": "total", "description": "Risultato finanziario", "sum": "E;-D", "styles": ["level2"] });
   form.push({ "id": "", "type": "empty" });

   form.push({ "id": "G", "type": "total", "description": "Risultato ordinario", "sum": "C;F", "styles": ["level1"] });
   form.push({ "id": "", "type": "empty" });

   form.push({ "id": "H", "type": "amount", "description": "Spese straordinarie", "account": "Gr=38", "styles": ["level2"] });
   form.push({ "id": "I", "type": "amount", "description": "Ricavi straordinari", "account": "Gr=48", "styles": ["level2"] });
   form.push({ "id": "L", "type": "total", "description": "Risultato straordinario", "sum": "I;-H", "styles": ["level1"] });
   form.push({ "id": "C", "type": "empty" });

   form.push({ "id": "M", "type": "total", "description": "Risultato d'esercizio", "sum": "G;L" });

   // Control amounts
   form.push({ "id": "TB11", "type": "hidden", "description": "Risultato d'esercizio da contabilità", "account": "Gr=02" });
   form.push({ "id": "TB12", "type": "testifzero", "description": "Errore: differenza risultato d'esercizio con contabilità", "sum": "M;-TB11" });
   form.push({ "id": "TB21", "type": "testifzero", "description": "Errore: differenza tra addebiti/accrediti interni in contabilità", "account": "Gr=39|49" });
   form.push({ "id": "", "type": "empty" });


   form.push({ "id": "CI", "type": "title", "description": "Conto degli investimenti" });

   form.push({ "id": "N", "type": "amount", "description": "Uscite per investimenti", "account": "Gr=5", "styles": ["level1"] });
   form.push({ "id": "O", "type": "amount", "description": "Entrate per investimenti", "account": "Gr=6", "styles": ["level1"] });
   form.push({ "id": "P", "type": "total", "description": "Investimenti netti", "sum": "N;-O", "style": "total" });
   form.push({ "id": "TB31", "type": "hidden", "description": "Investimenti netti da contabilità", "account": "Gr=03" });
   form.push({ "id": "TB32", "type": "testifzero", "description": "Errore: differenza investimenti netti", "sum": "P;-TB31" });
   form.push({ "id": "", "type": "empty" });


   form.push({ "id": "CC", "type": "title", "description": "Conto di chiusura" });

   form.push({ "id": "P2", "type": "total", "description": "Investimenti netti", "sum": "P", "style": "total", "styles": ["level1"] });
   form.push({ "id": "", "type": "empty" });

   form.push({ "id": "Q", "type": "amount", "description": "Ammortamenti ordinari", "account": "Gr=33|365|366", "styles": ["level2"] });
   form.push({ "id": "R", "type": "amount", "description": "Ammortamenti straordinari", "account": "Gr=383|385|389", "styles": ["level2"] });
   form.push({ "id": "M2", "type": "amount", "description": "Risultato d'esercizio", "sum": "M", "styles": ["level2"] });
   form.push({ "id": "S", "type": "total", "description": "Autofinanziamento", "sum": "Q;R;M2", "styles": ["level1"] });
   form.push({ "id": "", "type": "empty" });

   form.push({ "id": "T", "type": "total", "description": "Risultato totale", "sum": "S;-P2" });


   // The parameter rounding define the rounding of the amounts values
   param.rounding = { 'decimals': 2 };


   // The function amountColumns defines the columns printed for amount rows
   param.amountColumns = function (formObj, rowIndex) {
      try {
         var values = [];
         values.push(Banana.Converter.toLocaleNumberFormat(formObj["currentBudget"]["amount"]));
         values.push(Banana.Converter.toLocaleNumberFormat(formObj["previousBudget"]["amount"]));
         values.push(Banana.Converter.toLocaleNumberFormat(formObj["previous2Balance"]["amount"]));
         return values;
      } catch (err) {
         return ["error", "error", "error"];
      }
   }

}


//Main function
function exec(string) {
   //Check if we are on an opened document
   if (!Banana.document) {
      return;
   }

   var isAdvanced = isBananaAdvanced();
   if (!isAdvanced) {
      Banana.document.addMessage("Questa funzione è disponibile solo in Banana Contabilità+ con il piano Advanced.");
      return "@Cancel";
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

   // Previous year document
   var banDocPrev = null;
   if (banDoc) {
      if (typeof (banDoc.previousYear) === 'function') {
         banDocPrev = banDoc.previousYear();
      } else {
         var banDocPrevFileName = banDoc.info("AccountingDataBase", "FileNamePreviousYear");
         if (banDocPrevFileName.length > 0) {
            banDocPrev = Banana.application.openDocument(banDocPrevFileName);
         }
      }
   }

   // Previous 2 year document
   var banDocPrev2 = null;
   if (banDocPrev) {
      if (typeof (banDocPrev.previousYear) === 'function') {
         banDocPrev2 = banDocPrev.previousYear();
      } else {
         var banDocPrev2FileName = banDocPrev.info("AccountingDataBase", "FileNamePreviousYear");
         if (banDocPrev2FileName.length > 0) {
            banDocPrev2 = Banana.application.openDocument(banDocPrev2FileName);
         }
      }
   }

   var param = {
      "bananaVersion": "Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion"), //Save the version of Banana Accounting used
      "scriptVersion": "Script v. " + Banana.script.getParamValue("pubdate"),	//Save the version of the script
      "company": banDoc.info("AccountingDataBase", "Company"), //Save the company name
      "currentYear": banDoc.info("AccountingDataBase", "ClosureDate").substr(0, 4), //Save the current year
      "previousYear": banDocPrev ? banDocPrev.info("AccountingDataBase", "ClosureDate").substr(0, 4) : "", //Save the previous year
      "previous2Year": banDocPrev2 ? banDocPrev2.info("AccountingDataBase", "ClosureDate").substr(0, 4) : "", //Save the previous -2 year
   };

   //Loading data and calculate the totals
   load_form(param);
   load_form_balances(banDoc, banDocPrev, banDocPrev2, param.form);
   calc_form_totals(param.form, param.rounding);

   //Create a report.
   var report = Banana.Report.newReport(param.reportName);

   //Adding a footer.
   add_footer(report, param);

   //Variables used for the report's style.
   var styleAccount = "account";
   var styleDescription = "description";
   var stylePageHeader1 = "pageHeader1";
   var stylePageHeader2 = "pageHeader2";
   var styleHorizontalLine = "horizontalLine";
   var styleHeader = "header";
   var styleValueAmount = "valueAmount";
   var styleValueDate = "valueDate";
   var styleValueText = "valueText";
   var styleValueTotal = "valueTotal";
   var stlyeLevel1 = "level1";
   var stlyeLevel2 = "level2";
   var stlyeLevel3 = "level3";


   //Begin printing the report...

   //Title
   var pageHeader = report.getHeader();
   pageHeader.addParagraph(param.company, stylePageHeader1);
   pageHeader.addParagraph(param.reportName + " " + param.currentYear, stylePageHeader2);

   //Table with basic informations
   var table = report.addTable("table");

   // Rows
   var rowIndex = 0;
   for (var i in param.form) {
      var formObj = param.form[i];
      var columnValues = formObj.values ? formObj.values : param.amountColumns(formObj, rowIndex);
      var tableRow = null;

      if (param.form[i].type === "header") {
         tableRow = table.getHeader().addRow("headerRow");
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell(formObj["description"], styleDescription);
         for (var c in columnValues) {
            tableRow.addCell(columnValues[c], styleHeader);
         }
      } else if (param.form[i].type === "title") {
         tableRow = table.addRow("titleRow");
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell(formObj["description"], styleDescription);
         for (var c in columnValues) {
            tableRow.addCell("");
         }
         rowIndex++;
      } else if (param.form[i].type === "text") {
         tableRow = table.addRow("textRow");
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell(formObj["description"], styleDescription);
         for (var c in columnValues) {
            tableRow.addCell(columnValues[c], styleValueText);
         }
         rowIndex++;
      } else if (param.form[i].type === "amount") {
         tableRow = table.addRow("amountRow");
         if (param.printId)
            tableRow.addCell(formObj["id"], styleAccount);
         tableRow.addCell(formObj["description"], styleDescription);
         for (var c in columnValues) {
            tableRow.addCell(columnValues[c], styleValueAmount);
         }
         rowIndex++;
      } else if (param.form[i].type === "total") {
         tableRow = table.addRow("totalRow");
         if (param.printId)
            tableRow.addCell(formObj["id"], styleAccount);
         tableRow.addCell(formObj["description"], styleDescription);
         for (var c in columnValues) {
            tableRow.addCell(columnValues[c], styleValueAmount);
         }
         rowIndex++;
      } else if (param.form[i].type === "empty") {
         tableRow = table.addRow("emptyRow");
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell();
         for (var c in columnValues) {
            tableRow.addCell("");
         }
      } else if (param.form[i].type === "pagebreak") {
         tableRow = table.addRow("pagebreakRow");
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell();
         for (var c in columnValues) {
            tableRow.addCell("");
         }
      } else if (param.form[i].type === "hidden") {
         // Don't print
      } else if (param.form[i].type === "testifzero") {
         var printRow = false;
         for (var c in columnValues) {
            if (!Banana.SDecimal.isZero(Banana.Converter.toInternalNumberFormat(columnValues[c]))) {
               printRow = true;
               break;
            }
         }

         if (printRow) {
            tableRow = table.addRow("warningRow");
            if (param.printId)
               tableRow.addCell();
            tableRow.addCell(formObj["description"]);
            for (var c in columnValues) {
               var cell = tableRow.addCell(columnValues[c], styleValueAmount);
            }
         }
      } else {
         tableRow = table.addRow("warningRow");
         tableRow.addCell("invalid_row_type: " + param.form[i].type);
         if (param.printId)
            tableRow.addCell();
         tableRow.addCell();
         for (var c in columnValues) {
            var cell = tableRow.addCell(columnValues[c], styleValueAmount);
         }
      }


      for (var s in formObj.styles) {
         tableRow.addClass(formObj.styles[s]);
      }
   }

   return report;
}


//The purpose of this function is to calculate the vatTaxable and vatAmount balances, then load these values into the structure
function load_form_balances(banDoc, banDocPrev, banDocPrev2, form) {
   var accounts = banDoc.table("Accounts");
   if (!accounts) {
      return;
   }

   var amtList = [
      "opening", "debit", "credit", "total", "balance",
      "openingCurrency", "openingDebit", "openingCredit", "totalCurrency", "balanceCurrency"
   ];

   var emptyAmounts = {};
   for (var a in amtList) {
      emptyAmounts[a] = "";
   }

   var banDocGroups = getExistingGroups(banDoc);
   var banDocPrevGroups = getExistingGroups(banDocPrev);
   var banDocPrev2Groups = getExistingGroups(banDocPrev2);

   for (var i in form) {
      var formObj = form[i];

      if (formObj.account && formObj.account.length > 0) {
         // Get amounts from the accounting

         var filteredAccount = filterExistingGroups(formObj.account, banDocGroups);
         formObj.currentBalance = banDoc.currentBalance(filteredAccount);
         formObj.currentBudget = banDoc.budgetBalance(filteredAccount);

         var filteredAccountPrev = filterExistingGroups(formObj.account, banDocPrevGroups);
         formObj.previousBalance = banDocPrev ? banDocPrev.currentBalance(filteredAccountPrev) : emptyAmounts;
         formObj.previousBudget = banDocPrev ? banDocPrev.budgetBalance(filteredAccountPrev) : emptyAmounts;

         var filteredAccountPrev2 = filterExistingGroups(formObj.account, banDocPrev2Groups);
         formObj.previous2Balance = banDocPrev2 ? banDocPrev2.currentBalance(filteredAccountPrev2) : emptyAmounts;
         formObj.previous2Budget = banDocPrev2 ? banDocPrev2.budgetBalance(filteredAccountPrev2) : emptyAmounts;

         // Invert sign if requested by param
         var invertSign = false;

         if (formObj.sign === "invert") {
            invertSign = true;
         } else if (formObj.sign === "normalize") {
            if (formObj.currentBalance.bclass === "2" || formObj.currentBalance.bclass === "4") {
               invertSign = true;
            }
         }

         if (invertSign) {
            var objList = [
               formObj.currentBalance, formObj.currentBudget,
               formObj.previousBalance, formObj.previousBudget,
               formObj.previous2Balance, formObj.previous2Budget
            ];

            for (var o in objList) {
               for (var a in amtList) {
                  objList[o][a] = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(objList[o][a]));
               }
            }
         }
      }
   }
}


//Calculate all totals of the form
function calc_form_totals(form, rounding) {
   for (var i = 0; i < form.length; i++) {
      calc_form_total(form, form[i].id, rounding);
   }
}


//Calculate a total of the form
function calc_form_total(form, id, rounding) {

   var formObj = get_object(form, id);

   var amountGroupNames = [
      "currentBalance", "currentBudget",
      "previousBalance", "previousBudget",
      "previous2Balance", "previous2Budget"
   ];

   var amountDetailNames = [
      "opening", "debit", "credit", "total", "balance", "amount",
      "openingCurrency", "debitCurrency", "creditCurrency", "totalCurrency", "balanceCurrency", "amountCurrency",
   ];

   if (typeof formObj[amountGroupNames[0]] !== "undefined") { //first field is present
      return; //calc already done, return
   }

   if (formObj.sum) {

      // Init fields
      for (var group in amountGroupNames) {
         var groupName = amountGroupNames[group];
         formObj[groupName] = {};
         for (var detail in amountDetailNames) {
            var detailName = amountDetailNames[detail];
            formObj[groupName][detailName] = "";
         }
      }

      // Get objects to sum
      var sumElements = formObj.sum.split(";");
      for (var k = 0; k < sumElements.length; k++) {
         var entry = sumElements[k].trim();
         if (entry.length <= 0) {
            return true;
         }

         // Check if add or substract
         var isNegative = false;
         if (entry.indexOf("-") >= 0) {
            isNegative = true;
            entry = entry.substring(1);
         }

         //Calulate recursively
         calc_form_total(form, entry);

         for (var o in amountGroupNames) {
            var amtGroupName = amountGroupNames[o];
            for (var a in amountDetailNames) {
               var amtDetailName = amountDetailNames[a];
               var fieldValue = get_object(form, entry)[amtGroupName][amtDetailName];
               if (fieldValue) {
                  if (isNegative) //Invert sign
                     fieldValue = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(fieldValue));
                  formObj[amtGroupName][amtDetailName] = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(formObj[amtGroupName][amtDetailName]), Banana.Converter.toInternalNumberFormat(fieldValue), rounding);
               }
            }
         }
      }
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
   versionLine.excludeFromTest();
   report.getFooter().addText("Pagina ", "description");
   report.getFooter().addFieldPageNr();
}


//The main purpose of this function is to create styles for the report print
function create_styleSheet() {
   var stylesheet = Banana.Report.newStyleSheet();

   var pageStyle = stylesheet.addStyle("@page");
   pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

   style = stylesheet.addStyle(".footer");
   style.setAttribute("text-align", "right");
   style.setAttribute("font-size", "8px");
   style.setAttribute("font", "Arial");

   style = stylesheet.addStyle(".pageHeader1");
   style.setAttribute("font-size", "11px");
   style.setAttribute("font-weight", "bold");

   style = stylesheet.addStyle(".pageHeader2");
   style.setAttribute("font-size", "16px");
   style.setAttribute("font-weight", "bold");
   style.setAttribute("padding-bottom", "2em");

   style = stylesheet.addStyle(".titleRow");
   style.setAttribute("font-size", "12px");
   style.setAttribute("font-weight", "bold");
   style.setAttribute("padding-bottom", "0.8em");

   style = stylesheet.addStyle(".totalRow");
   style.setAttribute("font-weight", "bold");

   style = stylesheet.addStyle(".warningRow");
   style.setAttribute("font-weight", "bold");
   style.setAttribute("color", "red");

   style = stylesheet.addStyle(".horizontalLine");
   style.setAttribute("border-top", "1px solid black");

   style = stylesheet.addStyle(".valueAmount");
   style.setAttribute("padding-bottom", "5px");
   //	style.setAttribute("background-color", "#eeeeee");
   style.setAttribute("text-align", "right");

   style = stylesheet.addStyle(".valueDate");
   style.setAttribute("padding-bottom", "5px");
   //	style.setAttribute("background-color", "#eeeeee");

   style = stylesheet.addStyle(".valueText");
   //	style.setAttribute("padding-bottom", "5px");
   //	style.setAttribute("background-color", "#eeeeee");

   style = stylesheet.addStyle(".header td");
   style.setAttribute("text-align", "right");

   style = stylesheet.addStyle(".level1 td.valueAmount");
   style.setAttribute("padding-right", "1em");

   style = stylesheet.addStyle(".level2 td.valueAmount");
   style.setAttribute("padding-right", "2em");

   style = stylesheet.addStyle(".level3 td.valueAmount");
   style.setAttribute("padding-right", "3em");

   style = stylesheet.addStyle("table");
   style.setAttribute("width", "100%");
   style.setAttribute("font-size", "9px");

   return stylesheet;
}

function getExistingGroups(banDoc) {
   if (!banDoc)
      return [];

   var accountTable = banDoc.table("Accounts");
   if (!accountTable)
      return [];

   var groups = [];
   for (var ar = 0; ar < accountTable.rowCount; ar++) {
      var groupId = accountTable.value(ar, "Group");
      if (groupId && groupId.length > 0) {
         groups.push(groupId);
      }
   }
   return groups;
}

function filterExistingGroups(account, groups) {
   if (account && account.substr(0, 3) === "Gr=") {
      // Remove the groups that are missing in the account's table
      // Banana Accounting 9.0.3 or before would return 0, if a group doesn't exist in the account table
      function groupExists(groupId) {
         return this.indexOf(groupId) >= 0;
      }

      var accountGroups = account.substr(3).split("|");
      accountGroups = accountGroups.filter(groupExists, groups);
      return "Gr=" + accountGroups.join("|");

   }

   return account;
}

function isBananaAdvanced() {
   /**
    * Starting from version 10.0.7 it is possible to read the property Banana.application.license.isWithinMaxRowLimits 
    * to check if all application functionalities are permitted
    * the version Advanced returns isWithinMaxRowLimits always false
    * other versions return isWithinMaxRowLimits true if the limit of transactions number has not been reached
    */
   var license = Banana.application.license;
   if (license.licenseType === "advanced" || license.isWithinMaxFreeLines) {
      return true;
   }
   return false;
}
