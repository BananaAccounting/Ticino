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
// @id = ch.banana.app.patriziato.consuntivopersubtotali
// @api = 1.0
// @pubdate = 2015-09-08
// @publisher = Banana.ch SA
// @description = Consuntivo per subtotali
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
//    - header     : header row, print the row in the table's header
//    - title      : title row, print a title row without amounts or text
//    - text       : text row, print the text contained in the array values as text
//    - amount     : amount row, print the text contained in the array values as amounts
//    - total      : amount row, print the text contained in the array values as amounts
//    - empty      : an empty row, used to insert an empty space between rows
//    - hidden     : this row is not printed, it is used for calculation purposes
//    - testifzero : this row is only printed if the test fails
//    - pagebreak  : insert a pagebreak;
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

function load_form(banDoc, param) {

   // The name of report
   param.reportName = "Consuntivo per subtotali"


   // The parameter form define the content of the report
   var form = [];
   param.form = form;

   form.push({"id":"", "type":"header", "description":"", "values":["Consuntivo", "Preventivo", "Consuntivo"]});
   form.push({"id":"", "type":"header", "description":"", "values":[param.currentYear, param.currentYear, param.previousYear]});

   form.push({"id":"CE", "type":"title", "description":"BILANCIO"});

   form.push({"id":"CE", "type":"title", "description":"ATTIVI"});
   fill_form(banDoc, form, "1", param.subtotalLevel);

   form.push({"id":"", "type":"empty"});

   form.push({"id":"CE", "type":"title", "description":"PASSIVI"});
   fill_form(banDoc, form, "2", param.subtotalLevel);


   if (param.subtotalLevel > 1)
      form.push({"id":"", "type":"pagebreak"});
   else
      form.push({"id":"", "type":"empty"});


   form.push({"id":"CE", "type":"title", "description":"CONTO ECONOMICO"});

   form.push({"id":"CE", "type":"title", "description":"SPESE"});
   fill_form(banDoc, form, "3", param.subtotalLevel);

   form.push({"id":"", "type":"empty"});

   form.push({"id":"CE", "type":"title", "description":"RICAVI"});
   fill_form(banDoc, form, "4", param.subtotalLevel);

   form.push({"id":"", "type":"empty"});
   form.push({"id":"", "type":"total", "description":"TOTALE SPESE", "account":"Gr=3"});
   form.push({"id":"", "type":"total", "description":"TOTALE RICAVI", "account":"Gr=4"});
   form.push({"id":"", "type":"total", "description":"SALDO", "account":"Gr=4|3"});


   if (param.subtotalLevel > 1)
      form.push({"id":"", "type":"pagebreak"});
   else
      form.push({"id":"", "type":"empty"});


   form.push({"id":"CE", "type":"title", "description":"CONTO DEGLI INVESTIMENTI"});

   form.push({"id":"CE", "type":"title", "description":"USCITE PER INVESTIMENTI"});
   fill_form(banDoc, form, "5", param.subtotalLevel);

   form.push({"id":"", "type":"empty"});

   form.push({"id":"CE", "type":"title", "description":"ENTRATE PER INVESTIMENTI"});
   fill_form(banDoc, form, "6", param.subtotalLevel);

   form.push({"id":"", "type":"empty"});
   form.push({"id":"", "type":"total", "description":"ONERE NETTO DI INVESTIMENTO", "account":"Gr=5|6"});



   // The parameter rounding define the rounding of the amounts
   param.rounding = {'decimals': 2};



   // The function amountColumns defines the columns printed for amount rows
   param.amountColumns = function(formObj, rowIndex, decimals) {
      try {
         var values = [];
         var value =
               values.push(Banana.Converter.toLocaleNumberFormat(formObj["currentBalance"]["amount"], decimals));
         values.push(Banana.Converter.toLocaleNumberFormat(formObj["currentBudget"]["amount"], decimals));
         values.push(Banana.Converter.toLocaleNumberFormat(formObj["previousBalance"]["amount"], decimals));
         return values;
      } catch (err) {
         return ["error","error","error"];
      }
   }

}


//Main function
function exec(string) {
   //Check if we are on an opened document
   if (!Banana.document) {
      return;
   }

   // Read script settings
   var settings = {};
   var strSettings = Banana.document.scriptReadSettings();
   if (strSettings.length > 0) {
      var objData = JSON.parse(strSettings);
      if (objData)
         settings = objData;
   }

   if (typeof settings.detailLevel === "undefined")
      settings.detailLevel = 1;

   // Ask the user to select the detail's level
   var userSelection = Banana.Ui.getItem(Banana.script.getParamValue("description"),
      "Seleziona il livello di dettaglio",
      ["1 - Subtotali a una cifra",
       "2 - Subtotali a due cifre",
       "3 - Subtotali a tre cifre",
       "4 - Conti"],
      settings.detailLevel - 1,
      false);

   if (typeof userSelection === "undefined")
      return;


   // Save script settings
   settings.detailLevel = Number(userSelection[0]);
   strSettings = JSON.stringify(settings);
   Banana.document.scriptSaveSettings(JSON.stringify(settings));


   //Function call to create the report
   var report = create_report(Banana.document, "", "", settings.detailLevel);

   //Print the report
   var stylesheet = create_styleSheet();
   Banana.Report.preview(report, stylesheet);
}



//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

//Function that create the report
function create_report(banDoc, startDate, endDate, detailLevel) {

   // Previous year document
   var banDocPrev = null;
   var banDocPrevFileName = banDoc.info("AccountingDataBase","FileNamePreviousYear");
   if (banDocPrevFileName.length > 0) {
      banDocPrev = Banana.application.openDocument(banDocPrevFileName);
   }

   // Previous 2 year document
   var banDocPrev2 = null;
   if (banDocPrev) {
      var banDocPrev2FileName = banDocPrev.info("AccountingDataBase","FileNamePreviousYear");
      if (banDocPrev2FileName.length > 0) {
         banDocPrev2 = Banana.application.openDocument(banDocPrev2FileName);
      }
   }

   var param = {
      "bananaVersion":"Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion"), //Save the version of Banana Accounting used
      "scriptVersion": "Script v. " + Banana.script.getParamValue("pubdate"),	//Save the version of the script
      "company":banDoc.info("AccountingDataBase","Company"), //Save the company name
      "currentYear": banDoc.info("AccountingDataBase", "ClosureDate").substr(0,4), //Save the current year
      "previousYear": banDocPrev ? banDocPrev.info("AccountingDataBase", "ClosureDate").substr(0,4) : "", //Save the previous year
                                   "previous2Year": banDocPrev2 ? banDocPrev2.info("AccountingDataBase", "ClosureDate").substr(0,4) : "", //Save the previous -2 year
   };

   // Print account/group id column
   param.printId = true;

   // Level of subgroups to print out
   if (detailLevel)
      param.subtotalLevel = detailLevel;
   else
      param.subtotalLevel = 2;

   //Loading data and calculate the totals
   load_form(banDoc, param);
   load_form_balances(banDoc, banDocPrev, banDocPrev2, param.form);
   calc_form_totals(param.form, param.rounding);

   //Create a report.
   var report = Banana.Report.newReport(param.reportName);

   //Adding a footer.
   add_footer(report, param);

   //Variables used for the report's style.
   var styleAccount= "account";
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
      var columnValues = formObj.values ? formObj.values : param.amountColumns(formObj, rowIndex, param.rounding.decimals);
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
            if (!Banana.SDecimal.isZero(columnValues[c])) {
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


// The purpose of this function is to fill the from following the accounting plan
function fill_form(banDoc, form, bClass, level) {
   var accountTable = banDoc.table("Accounts");
   for (var i = 0; i < accountTable.rowCount; i ++) {
      var groupId = accountTable.value(i, "Group");
      if (groupId.length > 0) {
         if (groupId[0] === bClass[0] && groupId.length <= level) {  // Group
            var formObj = {};

            formObj.id = groupId;
            formObj.description = accountTable.value(i, "Description");
            formObj.account = "Gr=" + groupId;

            if (groupId.length < level)
               formObj.type = "total";
            else
               formObj.type = "amount";

            if (groupId.length === 2)
               formObj.styles = ["level1"];
            else if (groupId.length === 3)
               formObj.styles = ["level2"];

            form.push(formObj);
         }
      } else if (level === 4) {  // Account
         var accountId = accountTable.value(i, "Account");
         if (accountId[0] === bClass[0] || (accountId[0] === "." && accountId[1] === bClass[0])) {
            var formObj = {};
            formObj.id = accountId;
            formObj.description = accountTable.value(i, "Description");
            formObj.account = accountId;
            formObj.type = "amount";
            formObj.styles = ["level3"];
            form.push(formObj);

         }
      }
   }
}


//The purpose of this function is to calculate the vatTaxable and vatAmount balances, then load these values into the structure
function load_form_balances(banDoc, banDocPrev, banDocPrev2, form) {
   var accounts = banDoc.table("Accounts");
   if (!accounts) {
      return;
   }

   for (var i in form) {
      var formObj = form[i];

      if (formObj.account && formObj.account.length > 0) {
         // Get amounts from the accounting

         formObj.currentBalance = banDoc.currentBalance(formObj.account);
         formObj.currentBudget = banDoc.budgetBalance(formObj.account);
         formObj.previousBalance = banDocPrev ? banDocPrev.currentBalance(formObj.account) : null;
         formObj.previousBudget = banDocPrev ? banDocPrev.budgetBalance(formObj.account) : null;
         formObj.previous2Balance = banDocPrev2 ? banDocPrev2.currentBalance(formObj.account) : null;
         formObj.previous2Budget = banDocPrev2 ? banDocPrev2.budgetBalance(formObj.account) : null;

         // Invert sign if requested by param
         var invertSign = false;

         if (formObj.sign === "invert") {
            invertSign = true;
         } else if (formObj.sign === "normalize") {
            if (formObj.currentBalance.bclass === "2" || formObj.currentBalance.bclass === "4" ||
                  formObj.currentBalance.bclass === "6") {
               invertSign = true;
            }
         }

         if (invertSign) {
            var groupList = [
                     "currentBalance", "currentBudget", "previousBalance", "previousBudget",
                     "previous2Balance", "previous2Budget"
                  ];
            var detailList = [
                     "amount", "opening", "debit", "credit", "total", "balance",
                     "openingCurrency", "openingDebit", "openingCredit", "totalCurrency", "balanceCurrency"
                  ];
             for (var group in groupList) {
               var groupName = groupList[group];
               for (var detail in detailList) {
                  var detailName = detailList[detail];
                  formObj[groupName][detailName] = Banana.SDecimal.invert(formObj[groupName][detailName]);
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
            "currentBalance", "currentBudget", "previousBalance", "previousBudget",
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
                     fieldValue = Banana.SDecimal.invert(fieldValue);
                  formObj[amtGroupName][amtDetailName] = Banana.SDecimal.add(formObj[amtGroupName][amtDetailName], fieldValue, rounding);
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
   //versionLine.excludeFromTest();
   report.getFooter().addText("Seite ", "description");
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
   style.setAttribute("font", "Times New Roman");

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

   style = stylesheet.addStyle(".pagebreakRow");
   style.setAttribute("page-break-after", "always");

   style = stylesheet.addStyle(".warningRow");
   style.setAttribute("font-weight", "bold");
   style.setAttribute("color", "red");

   style = stylesheet.addStyle(".account");
   style.setAttribute("padding-right", "0.8em");
//   style.setAttribute("text-align", "right");

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
