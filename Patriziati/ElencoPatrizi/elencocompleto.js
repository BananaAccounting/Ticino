// Test script using Banana.Report
//
// @id = ch.banana.app.patriziato.elencocompleto
// @api = 1.0
// @pubdate = 2016-04-21
// @publisher = Banana.ch SA
// @description = Elenco completo patrizi
// @task = app.command
// @doctype = 400.*
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

function exec(string) {

    // Document
    var parametri = {};
    parametri.soloDirittoVoto = false;
    parametri.sortByName = true;
    //parametri.sortBy = "Scheda";
    parametri.soloUnaRiga = true;
    // verifichiamo se abbiamo la tabella corretta
    var addresses = Banana.document.table("Contacts");
    if (addresses === "undefined")
        return;
    parametri.reportHeader = "Elenco completo: " + Banana.document.info("Base", "HeaderLeft");
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
        adressesRows = addresses.findRows(function (row) { return (row.value("MemberVote").length > 0) });
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
    tableHeaderRow.addCell("Id", "headerCol");
    tableHeaderRow.addCell("Scheda", "headerCol");
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
        // Id
        text = currentRow.value("RowId");
        cellReport = rowReport.addCell(text, "a-center");
		/* mettiamo in bold il rowId se è capofamiglia */
		if (currentRow.value("RowId") == currentRow.value("RowBelongTo")) {
			cellReport.addClass("bold");
		}
        // Scheda
        text = currentRow.value("RowBelongTo");
        cellReport = rowReport.addCell(text, "");
        // controlliamo il page-break
        if (!parametri.sortByName) {
            // tieni assieme quelli che hanno il numero scheda uguale
            if ( i < adressesRows.length -1 && currentRow.value("RowBelongTo") == adressesRows[i+1].value("RowBelongTo")) {
                rowReport.addClass("avoid-pb-after");
                //cellReport.addClass("red");
            }
            if (i > 0 && currentRow.value("RowBelongTo") == adressesRows[i - 1].value("RowBelongTo")) {
                rowReport.addClass("avoid-pb-before");
                //cellReport.addClass("bold");
            }

        }
        // Nome cognome
        text = currentRow.value("FamilyName");
        text += " " + currentRow.value("FirstName");
        if (currentRow.value("MiddleName").length > 0) {
            text += " " + currentRow.value("MiddleName");
        }
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text, "bold");
        if (!parametri.soloUnaRiga) {
            cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("NamePrefix"), "italic");
        }
        // paternità 
        cellReport = rowReport.addCell();
        text = currentRow.value("Paternity");
        cellReport.addParagraph(text);
        if (!parametri.soloUnaRiga) {
            //cellReport.addLineBreak();
			if (currentRow.value("Notes").length > 0) {
				cellReport.addParagraph(currentRow.value("Notes"), "italic");
			}
			if (currentRow.value("ArchivedDate").length > 0) {
				text = "ArchD: " + Banana.Converter.toLocaleDateFormat(currentRow.value("ArchivedDate"));
				cellReport.addParagraph(text, "italic");
			}
			if (currentRow.value("ArchivedNotes").length > 0) {
				text = "ArchN: " + currentRow.value("ArchivedNotes");
				cellReport.addParagraph(text, "italic");
			}
        }
        // indirizzo 
        text = currentRow.value("Street");
        cellReport = rowReport.addCell(text);
        if (currentRow.value("AddressExtra").length > 0) {
            cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("AddressExtra"));
        }
        // località
        text = currentRow.value("PostalCode");
        text += " " + currentRow.value("Locality");
        rowReport.addCell(text);
        // nascita
        text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfBirth"));
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text);
        if (!parametri.soloUnaRiga) {
            text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfDeath"));
            cellReport.addParagraph(text, "italic bold");
		}

        // Diritto di voto
        text = currentRow.value("MemberVote");
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
    titleStyle.setAttribute("font-size", "13");
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
    var texta = a.value("FamiliName") + "$" + a.value("FirstName") + "$" + a.value("MiddleName");
    var textb = b.value("FamiliName") + "$" + b.value("FirstName") + "$" + b.value("MiddleName");
    if (texta > textb)
        return 1;
    else if (texta == textb)
        return 0;
    return -1;
}

function sortByScheda(a, b) {
    if (Number(a.value("RowBelongTo")) > Number(b.value("RowBelongTo")))
        return 1;
    else if (Number(a.value("RowBelongTo")) < Number(b.value("RowBelongTo")))
        return -1;
	/* Se i numeri scheda sono uguali metti prima il capofamiglia 
	   sennò in ordine alfabetico*/
    if (Number(a.value("RowId")) == Number(b.value("RowBelongTo")))
        return -1;
	return sortByName( a, b);
	
}