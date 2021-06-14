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

// @id = bilancioabbellito.test
// @api = 1.0
// @pubdate = 2018-04-04
// @publisher = Banana.ch SA
// @description = Simple test case
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1

// Include the BananaApp to test

// Register this test case to be executed
Test.registerTestCase(new TestBilancioAbbellito());

// Define the test class, the name of the class is not important
function TestBilancioAbbellito() {

}

// This method will be called at the beginning of the test case
TestBilancioAbbellito.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestBilancioAbbellito.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestBilancioAbbellito.prototype.init = function() {

}

// This method will be called after every test method is executed
TestBilancioAbbellito.prototype.cleanup = function() {

}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestBilancioAbbellito.prototype.testReport = function() {

   var document = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2017.ac2");
   Test.assert(document);

   var printOut = null;

   printOut = document.getPrintOut("ReportEnhancedGruppiJC", "Consuntivo (Bilancio)")
   Test.assert(printOut, "Consuntivo (Bilancio)");
   Test.logger.addReport("Consuntivo (Bilancio)", printOut.document);

   Test.logger.addPageBreak();

   printOut = document.getPrintOut("ReportEnhancedGruppiJC", "Consuntivo (Conto Economico)")
   Test.assert(printOut, "Consuntivo (Conto Economico)");
   Test.logger.addReport("Consuntivo (Conto Economico)", printOut.document);

   Test.logger.addPageBreak();

   printOut = document.getPrintOut("ReportEnhancedGruppiJC", "Preventivo (Conto Economico)")
   Test.assert(printOut, "Preventivo (Conto Economico)");
   Test.logger.addReport("Preventivo", printOut.document);
   Test.logger.addPageBreak();

   printOut = document.getPrintOut("ReportEnhancedGruppiJC", "Conto Investimenti")
   Test.assert(printOut, "Conto Investimenti");
   Test.logger.addReport("Conto Investimenti", printOut.document);

}

