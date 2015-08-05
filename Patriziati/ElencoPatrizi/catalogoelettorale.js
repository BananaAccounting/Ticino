// Test script using Banana.Report
//
// @id = ch.banana.script.report.report
// @version = 1.1
// @pubdate = 2013-11-26
// @publisher = Banana.ch SA
// @description = Stampa catalogo patriziato
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
//

function exec(string) {

    // Document
    var parametri = {};
    parametri.soloDirittoVoto = false;
    parametri.sortByName = true;
    //parametri.sortBy = "Scheda";
    parametri.soloUnaRiga = true;
    // verifichiamo se abbiamo la tabella corretta
    var addresses = Banana.document.table("Addresses");
    if (addresses === "undefined")
        return;
    parametri.reportHeader = "Catalogo elettorale: " + Banana.document.info("Base", "HeaderLeft");
    parametri.soloDirittoVoto = Banana.Ui.showQuestion("Stampa elenco", "Solo con diritto di voto ?");
    parametri.sortByName = Banana.Ui.showQuestion("Stampa elenco", "Ordina per nome (No = per scheda)?");
    parametri.soloUnaRiga = Banana.Ui.showQuestion("Stampa elenco", "Stampa solo la prima riga?");
    var reportHeader = Banana.Ui.getText("Stampa elenco", "Intestazione stampa:", parametri.reportHeader);
    if (reportHeader === "undefined") {
        return;
    }
    parametri.reportHeader = reportHeader;
    // riprende, filtra e fai il sort delle righe 
    var adressesRows;
    if (parametri.soloDirittoVoto) {
        adressesRows = addresses.findRows(function (row) { return (row.value("DirittoVoto").length > 0) });
    }
    else {
        adressesRows = addresses.findRows(function (row) { return (!row.isEmpty) });
    }
    if (parametri.sortByName) {
        adressesRows = adressesRows.sort(function (a, b) { return sortByName(a, b) });
    }
    else {
        adressesRows = adressesRows.sort(sortByScheda);
    }
    // crea il nuovo report
    var report = Banana.Report.newReport(reportHeader);
    // mettiamo header e footer
    var pageHeader = report.getHeader();
    pageHeader.addClass("header");
    pageHeader.addText(parametri.reportHeader);
    var dateToday = new Date();
    report.getFooter().addText(Banana.Converter.toLocaleDateFormat(dateToday) + " - ");
    report.getFooter().addFieldPageNr();

    // create table inside report e metti intestazione
    var tableReport = report.addTable();
    var text;
    var cellReport;
    var tableHeader = tableReport.getHeader();
    var tableHeaderRow = tableHeader.addRow();
    tableHeaderRow.addCell("Scheda", "headerCol");
    tableHeaderRow.addCell("CF", "headerCol");
    tableHeaderRow.addCell("Nome", "headerCol");
    cellReport = tableHeaderRow.addCell("Paternità", "headerCol");
    if (!parametri.soloUnaRiga) {
        cellReport.addLineBreak();
        cellReport.addParagraph("Note", "italic");
    }
    tableHeaderRow.addCell("Indirizzo", "headerCol");
    tableHeaderRow.addCell("Località", "headerCol");
    var cellReport = tableHeaderRow.addCell("Nascita", "headerCol");
    if (!parametri.soloUnaRiga) {
        cellReport.addLineBreak();
    }
    cellReport.addParagraph("Decesso", "italic");
    tableHeaderRow.addCell("Voto", "headerCol");
    //
    //stampa i dati dei delle righe
    for (var i = 0; i < adressesRows.length; i++) {
        var rowReport = tableReport.addRow();
        var currentRow = adressesRows[i];
        // Scheda
        text = currentRow.value("Scheda");
        cellReport = rowReport.addCell(text);
        // controlliamo il page-break
        if (!parametri.sortByName) {
            // tieni assieme quelli che hanno il numero scheda uguale
            if ( i < adressesRows.length -1 && currentRow.value("Scheda") == adressesRows[i+1].value("Scheda")) {
                rowReport.addClass("avoid-pb-after");
                cellReport.addClass("red");
            }
            if (i > 0 && currentRow.value("Scheda") == adressesRows[i - 1].value("Scheda")) {
                rowReport.addClass("avoid-pb-before");
                cellReport.addClass("bold");
            }

        }
        // Capo famiglia
        text = currentRow.value("CapoFamiglia");
        if (text == "1")
            text = "Sì";
        rowReport.addCell(text, "a-center");

        // Nome cognome
        text = currentRow.value("Cognome");
        text += " " + currentRow.value("Name");
        if (currentRow.value("SecondoNome").length > 0) {
            text += " " + currentRow.value("SecondoNome");
        }
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text, "bold");
        if (!parametri.soloUnaRiga) {
            cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("Salutation"), "italic");
        }
        // paternità 
        cellReport = rowReport.addCell();
        text = currentRow.value("Paternity");
        cellReport.addParagraph(text);
        if (!parametri.soloUnaRiga) {
            //cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("Notes"), "italic");
        }
        // indirizzo 
        text = currentRow.value("Address1");
        cellReport = rowReport.addCell(text);
        if (currentRow.value("Address2").length > 0) {
            cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("Address2"));
        }
        // località
        text = currentRow.value("Zip");
        text += " " + currentRow.value("Town");
        rowReport.addCell(text);
        // nascita
        text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfBirth"));
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text);
        if (!parametri.soloUnaRiga) {
            text = Banana.Converter.toLocaleDateFormat(currentRow.value("DataDecesso"));
            cellReport.addParagraph(text, "italic");
        }

        // Diritto di voto
        text = currentRow.value("DirittoVoto");
        if (text === "1") {
            text = "Sì";
        }
        rowReport.addCell(text, "a-center");
    }
    //
    // prepara lo StyleSheet
    var docStyles = Banana.Report.newStyleSheet();
    var pageStyle = docStyles.addStyle("@page");
    pageStyle.setAttribute("margin", "15mm 20mm 15mm 20mm");
    pageStyle.setAttribute("size", "landscape");

    var headerColStyle = docStyles.addStyle(".headerCol");
    headerColStyle.setAttribute("font-weight", "bold");

    var headerColStyle = docStyles.addStyle(".bold");
    headerColStyle.setAttribute("font-weight", "bold");

    docStyles.addStyle(".italic", "font-style:italic;");

    docStyles.addStyle("td", "border: 1px dashed black; padding: 2px;");

    var titleStyle = docStyles.addStyle(".header");
    titleStyle.setAttribute("font-size", "14");
    titleStyle.setAttribute("text-align", "center");
    titleStyle.setAttribute("margin-bottom", "0.5em");

    var titleStyle = docStyles.addStyle(".a-center");
    titleStyle.setAttribute("text-align", "center");

    docStyles.addStyle(".avoid-pb-after", "page-break-after:avoid");
    docStyles.addStyle(".avoid-pb-before", "page-break-before:avoid");

    docStyles.addStyle(".red", "color:red;");

    // Open Preview

    Banana.Report.preview(report, docStyles, false);
}

function sortByName(a, b) {
    var texta = a.value("Cognome") + "$" + a.value("Name") + "$" + a.value("SecondoNome");
    var textb = b.value("Cognome") + "$" + b.value("Name") + "$" + b.value("SecondoNome");
    if (texta > textb)
        return 1;
    else if (texta == textb)
        return 0;
    return -1;
}

function sortByScheda(a, b) {
    if (Number(a.value("Scheda")) > Number(b.value("Scheda")))
        return 1;
    else if (Number(a.value("Scheda")) < Number(b.value("Scheda")))
        return -1;
    if (Number(a.value("CapoFamiglia")) > Number(b.value("CapoFamiglia")))
        return -1;
    else if (Number(a.value("CapoFamiglia")) < Number(b.value("CapoFamiglia")))
        return 1;
    var texta = a.value("Cognome") + "$" + a.value("Name") + "$" + a.value("SecondoNome");
    var textb = b.value("Cognome") + "$" + b.value("Name") + "$" + b.value("SecondoNome");
    if (texta > textb)
        return 1;
    else if (texta == textb)
        return 0;
    return -1;
}