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


// @id = ch.banana.app.patriziato.schedepatrizi.test
// @api = 1.0
// @pubdate = 2018-04-10
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.app.patriziato.schedepatrizi.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../schedepatrizi.js
// @timeout = -1


/*

  SUMMARY
  -------
  Javascript test
  1. Open the .ac2 file
  2. Execute the .js script
  3. Save the report



  virtual void addTestBegin(const QString& key, const QString& comment = QString());
  virtual void addTestEnd();

  virtual void addSection(const QString& key);
  virtual void addSubSection(const QString& key);
  virtual void addSubSubSection(const QString& key);

  virtual void addComment(const QString& comment);
  virtual void addInfo(const QString& key, const QString& value1, const QString& value2 = QString(), const QString& value3 = QString());
  virtual void addFatalError(const QString& error);
  virtual void addKeyValue(const QString& key, const QString& value, const QString& comment = QString());
  virtual void addReport(const QString& key, QJSValue report, const QString& comment = QString());
  virtual void addTable(const QString& key, QJSValue table, QStringList colXmlNames = QStringList(), const QString& comment = QString());

**/

// Register test case to be executed
Test.registerTestCase(new ReportSchedePatrizi());

// Here we define the class, the name of the class is not important
function ReportSchedePatrizi() {

}

// This method will be called at the beginning of the test case
ReportSchedePatrizi.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportSchedePatrizi.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportSchedePatrizi.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportSchedePatrizi.prototype.cleanup = function() {

}

ReportSchedePatrizi.prototype.testReport = function() {
   
  Test.logger.addComment("Test ch.banana.app.patriziato.schedepatrizi.js");

  var fileAC2 = "file:script/../test/testcases/ElencoPatriziEsempio.ac2";
  var banDoc = Banana.application.openDocument(fileAC2);
  if (!banDoc) {
    return;
  }

  Test.logger.addSection("Test Schede Patrizi");

  Test.logger.addSubSection("Report Schede Patrizi (tutte le pagine)");
  aggiungiReportSchedePatrizi("Test", banDoc, "");
}


//Function that creates the report for the test
function aggiungiReportSchedePatrizi(reportName, banDoc, cardsToPrint) {
  var report = printCard(banDoc, cardsToPrint.trim());
  Test.logger.addReport(reportName, report);
}

