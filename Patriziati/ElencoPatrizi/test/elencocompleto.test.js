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


// @id = ch.banana.app.patriziato.elencocompleto.test
// @api = 1.0
// @pubdate = 2018-04-09
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.app.patriziato.elencocompleto.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../elencocompleto.js
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
Test.registerTestCase(new ReportElencoCompleto());

// Here we define the class, the name of the class is not important
function ReportElencoCompleto() {

}

// This method will be called at the beginning of the test case
ReportElencoCompleto.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportElencoCompleto.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportElencoCompleto.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportElencoCompleto.prototype.cleanup = function() {

}

ReportElencoCompleto.prototype.testReport = function() {
   
  Test.logger.addComment("Test ch.banana.app.patriziato.elencocompleto.js");

  var fileAC2 = "file:script/../test/testcases/ElencoPatriziEsempio.ac2";
  var banDoc = Banana.application.openDocument(fileAC2);
  if (!banDoc) {
    return;
  }

  Test.logger.addSection("Elenco Completo tests");

  // 1.
  Test.logger.addSubSection("Test 1: Elenco completo");
  var parametri = {};
  parametri.reportHeader = "Elenco completo: Patriziati";
  parametri.soloDirittoVoto = false;
  parametri.soloUnaRiga = false;
  parametri.addresses = banDoc.table("Contacts");
  parametri.itemSelected = "Ordina per nome";
  aggiungiReport("Test 1", parametri);

  //2. 
  Test.logger.addSubSection("Test 2: Elenco completo");
  var parametri = {};
  parametri.reportHeader = "Elenco completo: Patriziati";
  parametri.soloDirittoVoto = false;
  parametri.soloUnaRiga = false;
  parametri.addresses = banDoc.table("Contacts");
  parametri.itemSelected = "Ordina per scheda";
  aggiungiReport("Test 2", parametri);

}

//Function that creates the report for the test
function aggiungiReport(reportName, parametri) {
  var report = printReport(parametri);
  Test.logger.addReport(reportName, report);
}

