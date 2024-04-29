//Creazione degli stili
function createStyleSheet() {

    //------------------------------------------------------------------------------//
    // GENERALI
    //------------------------------------------------------------------------------//

    var docStyles = Banana.Report.newStyleSheet();

    var pageStyle = docStyles.addStyle("@page");
    pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");
    pageStyle.setAttribute("font-family", "Arial");


    style = docStyles.addStyle("thead");
    style.setAttribute("font-size", "10pt");
    style.setAttribute("font-weight", "bold");

    style = docStyles.addStyle(".Amount");
    style.setAttribute("font-size", "10pt");
    style.setAttribute("text-align", "right");

    //Header left
    style = docStyles.addStyle(".documentheaderleft");
    style.setAttribute("font-size", "8.5px");
    style.setAttribute("text-align", "left");

    //Header right
    style = docStyles.addStyle(".documentheaderright");
    style.setAttribute("font-size", "8.5px");
    style.setAttribute("text-align", "right");

    //Footer
    style = docStyles.addStyle(".footer");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8.5px");
    style.setAttribute("text-align", "center");
    style.setAttribute("font-family", "Arial");

    //Title
    style = docStyles.addStyle(".titleStyle");
    style.setAttribute("font-size", "18");
    style.setAttribute("text-align", "left");

    //Subtitle
    style = docStyles.addStyle(".subtitleStyle");
    style.setAttribute("font-size", "14");
    style.setAttribute("text-align", "left");

    //Paragrafo intestazione
    style = docStyles.addStyle(".paragrafoStyle");
    style.setAttribute("font-size", "10pt");
    style.setAttribute("text-align", "left");
    style.setAttribute("font-weight", "normal");
    style.setAttribute("font-family", "Arial");
    style.setAttribute("border-left", "thin solid black");

    //Paragrafo intestazione grassetto
    style = docStyles.addStyle(".paragrafoStyleBold");
    style.setAttribute("font-size", "8pt");
    style.setAttribute("text-align", "left");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("font-family", "Arial");
    style.setAttribute("border-left", "thin solid black");

    //Testo Norme legali
    style = docStyles.addStyle(".testoNormale");
    style.setAttribute("font-size", "8.5px");

    //Titolo data
    style = docStyles.addStyle(".intestazioneStyle");
    style.setAttribute("font-size", "10pt");
    style.setAttribute("font-weight", "bold");

    //Allinea a dx il testo
    style = docStyles.addStyle(".Right");
    style.setAttribute("text-align", "right");

    //Allinea a dx il testo
    style = docStyles.addStyle(".Left");
    style.setAttribute("text-align", "left");

    //Totale sottolineato per totali
    style = docStyles.addStyle(".totalStyle");
    style.setAttribute("text-decoration", "double-underline");
    style.setAttribute("padding-bottom", "20px");

    //Totale sottolineato una volta
    style = docStyles.addStyle(".underline");
    style.setAttribute("text-decoration", "underline");
    style.setAttribute("padding-bottom", "20px");

    //Bordo Sinistra + sopra
    style = docStyles.addStyle(".bordoSinistraSopra");
    style.setAttribute("border-top", "thin solid black");
    style.setAttribute("border-left", "thin solid black");

    //Bordo sinistra
    style = docStyles.addStyle(".bordoSinistra");
    style.setAttribute("border-left", "thin solid black");

    //Bordo sopra
    style = docStyles.addStyle(".bordoSopra");
    style.setAttribute("border-top", "thin solid black");

    //Bordo sotto
    style = docStyles.addStyle(".bordoSotto");
    style.setAttribute("border-bottom", "thin solid black");

    //Bordo sinistra sotto
    style = docStyles.addStyle(".bordoSinistraSotto");
    style.setAttribute("border-left", "thin solid black");
    style.setAttribute("border-bottom", "thin solid black");

    //Titoli retro pagina firme
    style = docStyles.addStyle(".titoliCentrali");
    style.setAttribute("font-size", "10pt");
    style.setAttribute("text-align", "center");
    style.setAttribute("font-weight", "bold");

    //Testo bold
    style = docStyles.addStyle(".testoBold");
    style.setAttribute("font-size", "8.5");
    style.setAttribute("font-weight", "bold");

    style = docStyles.addStyle(".bold");
    style.setAttribute("font-weight", "bold");

    //margini bottom
    style = docStyles.addStyle(".bottom1em");
    style.setAttribute("margin-bottom", "1em");

    //margini top
    style = docStyles.addStyle(".top1em");
    style.setAttribute("margin-top", "1em");

    //Warning per il messaggio di differenza conti-categorie
    style = docStyles.addStyle(".warning");
    style.setAttribute("font-size", "10");
    style.setAttribute("color", "red");


    //------------------------------------------------------------------------------//
    // TABELLE
    //------------------------------------------------------------------------------//

    //Tabella header
    var tableStyle = docStyles.addStyle(".tableHeader");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".tableAccountingDate");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border", "2px solid black");
    tableStyle.setAttribute("padding", "5px");

    //celle
    docStyles.addStyle("table.tableAccountingDate td", "border-left: 2px solid black; border-right: 2px solid black; padding: 3px; ");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".tableTipoRendiconto");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".table");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("border-top", "thin solid black");
    tableStyle.setAttribute("border-bottom", "thin solid black");
    tableStyle.setAttribute("padding", "5px");
    tableStyle.setAttribute("margin-top", "10px");
    tableStyle.setAttribute("margin-bottom", "10px");
    tableStyle.setAttribute("margin-left", "0px");
    tableStyle.setAttribute("margin-right", "0px");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".tableNoBorder");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("padding", "5px");
    tableStyle.setAttribute("margin-top", "10px");
    tableStyle.setAttribute("margin-bottom", "10px");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".tableMF");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border-top", "thin solid black");
    tableStyle.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("border-bottom", "2px solid black");
    tableStyle.setAttribute("padding", "5px");
    tableStyle.setAttribute("margin-top", "10px");
    tableStyle.setAttribute("margin-bottom", "10px");

    //celle
    docStyles.addStyle("table.tableMF td .noborder", "border: none; padding: 3px;");
    docStyles.addStyle("table.tableMF td .margintop", "padding-top: 20px;");

    docStyles.addStyle(".borderbold", "font-weight: bold; border-bottom: 2px solid black;");
    docStyles.addStyle(".borderboldleft", "font-weight: bold; border-left: 2px solid black; border-right: thin solid black;");
    docStyles.addStyle(".borderleft", "border-left: thin solid black;");
    docStyles.addStyle(".borderbottom", "border-bottom: thin solid black;");

    //Tabella titoli
    var tableStyle = docStyles.addStyle(".tableTot");
    //bordo esterno
    tableStyle.setAttribute("width", "100%");
    tableStyle.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("border-top", "thin solid black");
    tableStyle.setAttribute("border-bottom", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    //Tabella intestazione
    var tableStyle3 = docStyles.addStyle(".tableIntestazione1");
    tableStyle3.setAttribute("width", "100%");
    tableStyle.setAttribute("padding", "5px");

    //Tabella firma
    var tableStyle3 = docStyles.addStyle(".tableFirma");
    tableStyle3.setAttribute("width", "100%");
    tableStyle.setAttribute("padding", "5px");
    tableStyle.setAttribute("margin-top", "10px");

    //Tabella istruzioni
    var tableStyle4 = docStyles.addStyle(".tableIstruzioni");
    tableStyle4.setAttribute("width", "100%");
    tableStyle4.setAttribute("border-left", "thin solid black");
    tableStyle4.setAttribute("border-top", "thin solid black");
    tableStyle4.setAttribute("border-bottom", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    docStyles.addStyle("table.tableIstruzioni td", "border: 0; padding: 0;");

    //Tabella norme legali
    var tableStyle4 = docStyles.addStyle(".tableNormeLegali");
    tableStyle4.setAttribute("border-left", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    docStyles.addStyle("table.tableNormeLegali td", "border: 0; padding: 0;");


    //Tabella Intestazione1
    var tableStyle5 = docStyles.addStyle(".tableIntestazione1");
    tableStyle5.setAttribute("width", "100%");
    tableStyle5.setAttribute("border-top", "thin solid black");
    tableStyle.setAttribute("padding", "5px");

    docStyles.addStyle("table.tableIntestazione1 td", "border-left: thin solid black; padding: 5px; width: 200px");




    return docStyles;
}