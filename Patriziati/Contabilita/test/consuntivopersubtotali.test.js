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

// @id = consuntivopersubtotali.test
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
// @includejs = ../consuntivopersubtotali.js

// Register this test case to be executed
Test.registerTestCase(new TestConsuntivoPerSubtotali());

// Define the test class, the name of the class is not important
function TestConsuntivoPerSubtotali() {

}

// This method will be called at the beginning of the test case
TestConsuntivoPerSubtotali.prototype.initTestCase = function () {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestConsuntivoPerSubtotali.prototype.cleanupTestCase = function () {

}

// This method will be called before every test method is executed
TestConsuntivoPerSubtotali.prototype.init = function () {

}

// This method will be called after every test method is executed
TestConsuntivoPerSubtotali.prototype.cleanup = function () {

}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestConsuntivoPerSubtotali.prototype.testReport = function () {

   let document = [];
   document[0] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2015.ac2");
   document[1] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2016.ac2");
   document[2] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2017 con gruppi mancanti.ac2");
   document[3] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2017.ac2");
   document[4] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2023.ac2");
   document[5] = Banana.application.openDocument("file:script/testcases/Contabilita Patriziato MCA2 2024.ac2");

   for (var i = 0; i < document.length; i++) {

      Test.assert(document[i]);
      
      
      let report;
      Test.logger.addText("Document nr: " + i);
      report = create_report(document[i], "", "", 1);

      Test.logger.addReport("Details Level 1", report);
      Test.logger.addText("Details Level 1");
      Test.logger.addPageBreak();

      report = create_report(document[i], "", "", 2);
      Test.logger.addReport("Details Level 2", report);
      Test.logger.addText("Details Level 2");
      Test.logger.addPageBreak();

      report = create_report(document[i], "", "", 3);
      Test.logger.addReport("Details Level 3", report);
      Test.logger.addText("Details Level 3");
      Test.logger.addPageBreak();

      report = create_report(document[i], "", "", 4);
      Test.logger.addReport("Details Level 4", report);
      Test.logger.addText("Details Level 4");
      
     
   }
}


