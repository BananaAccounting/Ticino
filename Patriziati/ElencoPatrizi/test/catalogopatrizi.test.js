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


// @id = ch.banana.app.patriziato.catalogopatrizi.test
// @api = 1.0
// @pubdate = 2018-04-09
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.app.patriziato.catalogopatrizi.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../catalogopatrizi.js
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
Test.registerTestCase(new ReportCatalogoPatrizi());

// Here we define the class, the name of the class is not important
function ReportCatalogoPatrizi() {

}

// This method will be called at the beginning of the test case
ReportCatalogoPatrizi.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportCatalogoPatrizi.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportCatalogoPatrizi.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportCatalogoPatrizi.prototype.cleanup = function() {

}

ReportCatalogoPatrizi.prototype.testReport = function() {
   
  Test.logger.addComment("Test ch.banana.app.patriziato.catalogopatrizi.js");

  var fileAC2 = "file:script/../test/testcases/ElencoPatriziEsempio.ac2";
  var banDoc = Banana.application.openDocument(fileAC2);
  if (!banDoc) {
    return;
  }

  Test.logger.addSection("Catalogo tests");

  // 1.
  Test.logger.addSubSection("Test 1: Catalogo elettorale");
  var parametri = {};
  parametri.catalogSorting = "Ordina per cognome";
  parametri.reportHeader = "Catalogo elettorale Patriziati";
  aggiungiReportElettorale("Test 1", banDoc, parametri);

  //2.
  Test.logger.addSubSection("Test 2: Catalogo elettorale");
  var parametri = {};
  parametri.catalogSorting = "Ordina per scheda";
  parametri.reportHeader = "Catalogo elettorale Patriziati";
  aggiungiReportElettorale("Test 2", banDoc, parametri);  

  //3.
  Test.logger.addSubSection("Test 3: Catalogo completo");
  var parametri = {};
  parametri.catalogSorting = "Ordina per cognome";
  parametri.reportHeader = "Catalogo completo Patriziati";
  aggiungiReportCompleto("Test 3", banDoc, parametri);
  
  //4. 
  Test.logger.addSubSection("Test 4: Catalogo completo");
  var parametri = {};
  parametri.catalogSorting = "Ordina per scheda";
  parametri.reportHeader = "Catalogo completo Patriziati";
  aggiungiReportCompleto("Test 4", banDoc, parametri);

}

//Function that creates the report for the test
function aggiungiReportElettorale(reportName, banDoc, parametri) {
  var report = printVotersCatalog(banDoc, parametri);
  Test.logger.addReport(reportName, report);
}

//Function that creates the report for the test
function aggiungiReportCompleto(reportName, banDoc, parametri) {
  var report = printFullCatalog(banDoc, parametri);
  Test.logger.addReport(reportName, report);
}

