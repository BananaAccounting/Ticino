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

// @id = riassuntopreventivo.test
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
// @includejs = ../riassuntopreventivo.js

// Register this test case to be executed
Test.registerTestCase(new TestRiassuntoPreventivo());

// Define the test class, the name of the class is not important
function TestRiassuntoPreventivo() {

}

// This method will be called at the beginning of the test case
TestRiassuntoPreventivo.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestRiassuntoPreventivo.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestRiassuntoPreventivo.prototype.init = function() {

}

// This method will be called after every test method is executed
TestRiassuntoPreventivo.prototype.cleanup = function() {

}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestRiassuntoPreventivo.prototype.testReport = function() {

   var document = null;
   var report = null;

   document = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2017.ac2");
   Test.assert(document);
   report = create_report(document, "", "", false);
   Test.logger.addReport("Report", report);

   document = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2017 con gruppi mancanti.ac2");
   Test.assert(document);
   report = create_report(document, "", "", false);
   Test.logger.addReport("Report con gruppi mancanti", report);
}

