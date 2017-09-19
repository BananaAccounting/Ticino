// Test script using Banana.Report
//
// @id = ch.banana.app.patriziato.elencocompleto
// @api = 1.0
// @pubdate = 2017-09-19
// @publisher = Banana.ch SA
// @description = Elenco completo Patrizi
// @task = app.command
// @doctype = 400.*
// @docproperties = patriziati
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

function exec(string) {

    //Parametri
    var parametri = {};
    parametri.reportHeader = "Elenco completo: " + Banana.document.info("Base", "HeaderLeft");
    parametri.soloDirittoVoto = false;
    parametri.soloUnaRiga = false;
    
    //Controllo che esista la tabella contatti
    var addresses = Banana.document.table("Contacts");
    if (addresses === "undefined") {
        return;
    }
    
    //Selezione del tipo di ordinamento
    var itemSelected = Banana.Ui.getItem('Stampa elenco', 'Tipo di ordinamento:', ['Ordina per nome','Ordina per scheda'], 0, false);

    //Titolo del report
    var reportHeader = Banana.Ui.getText("Stampa elenco", "Intestazione stampa:", parametri.reportHeader);
    if (reportHeader === "undefined") {
        return;
    }
    parametri.reportHeader = reportHeader;

    //Creazione report   
    var report = Banana.Report.newReport(reportHeader);
    

    //Righe indirizzi
    var adressesRows;
    adressesRows = addresses.findRows(function (row) { return (!row.isEmpty) });

    if (itemSelected === "Ordina per nome") {
        adressesRows = adressesRows.sort(function (a, b) { return sortByName(a, b) });
    }
    else if (itemSelected === "Ordina per scheda") {
        adressesRows = adressesRows.sort(sortByScheda);
    }


    //************ INIZIO CREAZIONE DEL REPORT ************//

    var text;
    var cellReport;
    var tableReport = report.addTable("tableElenco");
    
    /* 
        Header tabella 
    */
    var tableHeader = tableReport.getHeader();
    var tableHeaderRow = tableHeader.addRow("");

    tableHeaderRow.addCell("Id", "headerTable bold center");
    tableHeaderRow.addCell("Scheda", "headerTable bold center");
    tableHeaderRow.addCell("Nome", "headerTable bold center");
    
    cellReport = tableHeaderRow.addCell("Paternità", "headerTable bold center");
    if (!parametri.soloUnaRiga) {
        cellReport.addLineBreak();
        cellReport.addParagraph("Note", "italic");
    }

    tableHeaderRow.addCell("Indirizzo", "headerTable bold center");
    tableHeaderRow.addCell("Località", "headerTable bold center");
    
    var cellReport = tableHeaderRow.addCell("Nascita", "headerTable bold center");
    if (!parametri.soloUnaRiga) {
        cellReport.addLineBreak();
    }
    cellReport.addParagraph("Decesso", "italic");
    
    tableHeaderRow.addCell("Voto", "headerTable bold center");
    
    

    /* 
        Dati tabella 
    */
    for (var i = 0; i < adressesRows.length; i++) 
    {
        var rowReport = tableReport.addRow();
        var currentRow = adressesRows[i];
        
        /*********** 
            ID 
        ***********/
        text = currentRow.value("RowId");
        cellReport = rowReport.addCell(text, "center");
		
        //Mettiamo in bold il rowId se è capofamiglia
		if (currentRow.value("RowId") == currentRow.value("RowBelongTo")) {
			cellReport.addClass("bold");
			
		}

        /*********** 
            Scheda 
        ***********/
        text = currentRow.value("RowBelongTo");
        cellReport = rowReport.addCell(text, "");
        
        //Controlliamo il page-break
        if (itemSelected === "Ordina per scheda") {
            
            //Raggruppiamo assieme quelli che hanno il numero scheda uguale
            if ( i < adressesRows.length -1 && currentRow.value("RowBelongTo") == adressesRows[i+1].value("RowBelongTo")) {
                rowReport.addClass("avoid-pb-after");
                cellReport.addClass("bold");
            }

            if (i > 0 && currentRow.value("RowBelongTo") == adressesRows[i - 1].value("RowBelongTo")) {
                rowReport.addClass("avoid-pb-before");
                cellReport.addClass("bold");
            }

        }

        /****************** 
            Nome e cognome 
        ******************/
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


        /************* 
            Paternità 
        *************/
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

        /************* 
            Indirizzo 
        *************/
        text = currentRow.value("Street");
        cellReport = rowReport.addCell(text);
        
        if (currentRow.value("AddressExtra").length > 0) {
            cellReport.addLineBreak();
            cellReport.addParagraph(currentRow.value("AddressExtra"));
        }

        /*********** 
            Località 
        ***********/
        text = currentRow.value("PostalCode");
        text += " " + currentRow.value("Locality");
        rowReport.addCell(text);

        /*********** 
            Nascita 
        ***********/
        text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfBirth"));
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text);
        
        if (!parametri.soloUnaRiga) {
            text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfDeath"));
            cellReport.addParagraph(text, "italic bold");
		}

        /******************* 
            Diritto di voto 
        *******************/
        text = currentRow.value("MemberVote");
        
        if (text === "1") {
            text = "Sì";
        } else {
            text = "No";
        }
        
        rowReport.addCell(text, "center");
    }

    //Add header and footer
    AddHeaderAndFooter(report, parametri);
    
    //Aggiunge stile e stampa il report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}





function AddHeaderAndFooter(report, parametri) {
    var pageHeader = report.getHeader();
    pageHeader.addClass("header");
    pageHeader.addText(parametri.reportHeader);
    
    report.getFooter().addClass("footer");
    report.getFooter().addText("Banana Contabilità - Pagina ", "footer");
    report.getFooter().addFieldPageNr();
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




function createStyleSheet() {
    
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    
    pageStyle.setAttribute("margin", "15mm 20mm 10mm 20mm");
    pageStyle.setAttribute("size", "landscape");

    stylesheet.addStyle("body", "font-family:Helvetica; font-size:10pt");
    stylesheet.addStyle(".avoid-pb-after", "page-break-after:avoid");
    stylesheet.addStyle(".avoid-pb-before", "page-break-before:avoid");
    stylesheet.addStyle(".italic", "font-style:italic;");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".bold", "font-weight:bold");

    var titleStyle = stylesheet.addStyle(".header");
    titleStyle.setAttribute("font-size", "13");
    titleStyle.setAttribute("text-align", "center");
    titleStyle.setAttribute("margin-bottom", "0.5em");

    //Footer
    var style = stylesheet.addStyle(".footer");
    style.setAttribute("text-align", "right");
    style.setAttribute("font-size", "8px");
    style.setAttribute("font", "Times New Roman");

    var headerTableStyle = stylesheet.addStyle(".headerTable");
    headerTableStyle.setAttribute("background-color", "#E0E0E0");
    headerTableStyle.setAttribute("color", "black");

    var tableStyle = stylesheet.addStyle(".tableElenco");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle("table.tableElenco td", "border: thin solid black;");

    return stylesheet;
}
