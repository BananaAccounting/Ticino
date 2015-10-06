# Rendiconto finanziario per curatele
La BananaApp [rendicontoFinanziario.js](https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js) prepara il rendiconto finanziario per le curatele (art. 410 Codice civile svizzero) secondo lo schema dell'autorità di vigilanza del Cantone Ticino.

## 1. Come usare questa BananaApps
Procedere come segue per installare la app:

1. Scaricare il file della contabiltà doppia o entrate/uscite e adattarlo alle proprie esigenze
2. Installare la BananaApp curatele come indicato su http://doc8.banana.ch/it/node/7685.
3. Eseguire nel menu menu **Apps** il comando **Rendiconto finanziario (art. 410 CC)**

A questo punto verrà creato il report del rendiconto finanziario e sarà possibile salvarlo in formato pdf.


## 2. Documentazione

Il rendiconto finanziario verrà creato tramite l’esecuzione dello script allegato. 
Il piano dei conti di Banana Contabilità deve essere adattato alle esigenze dello script, come descritto qui di seguito. 
### 2.1 Impostazione piano dei conti 
#### 2.1.1 Aggiunta colonne 
Nella tabella **Conti** sono state aggiunte tre colonne:
* ValoreStima (valore di stima degli immobili)
* ParticellaNumero (numero particella degli immobili)
* DocNumero (numero del documento giustificativo)

#### 2.1.2 Attivi
I conti attivi sono divisi in due categorie: Beni mobili e Immobili.
* Beni mobili. Gruppo 10
  * Competare anche la colonna DocNumero
* Immobili. Gruppo 11
  * Completare la colonna DocNumero, ValoreStima e ParticellaNumero

#### 2.1.3 Passivi
I conti passivi sono rappresentati in due categorie: Debiti e Capitale proprio.
* Debiti. Gruppo 20
  * Completare la colonna DocNumero
* Esecuzioni. Gruppo 20
  * Se si tratta di un'esecuzione o altro indicarlo nella descrizione del conto. 
  * Completare la colonna DocNumero
* Capitale proprio. Gruppo 29
  * Questo gruppo non è necessario nella contaiblità Entrate/Uscite

#### 2.1.4 Ricavi
Le entrate sono rappresentate in due categorie: Ricavi generali e Ricavi patrimoniali.
* Ricavi generali. Gruppo 40
* Ricavi patrimoniali. Gruppo 41

#### 2.1.5 Costi
Le uscite sono rappresentate in due categorie: Costi generali e Costi patrimoniali.
* Costi generali. Gruppo 30
* Costi patrimoniali. Gruppo 31

### 2.2 Altri dati da inserire nel file contabile
Per poter compilare correttamente il rendiconto finanziario è necessario che l’utente inserisca manualmente alcuni valori che saranno poi riportati nel rapporto finale.
#### 2.2.1 Proprietà file
Inserimento della data: **File > Proprietà File** e selezionare la finestra **Contabilità**. In questa finestra appariranno diversi campi ed è fondamentale che siano compilate almeno la **data di apertura** e la **data di chiusura** del periodo contabile.

Inserimento dell'indirizzo: **File > Proprietà File** e selezionare la finestra **Indirizzi**.
In questa finestra è necessario inserire i dati riguardanti la persona tutelata/curatelata.

#### 2.2.2 Tabella Testi
Il file di banana contabilità deve contenere la tabella **Testi** dove si inseriscono le informazioni non contabili richieste nel report. Questa tabella è composta da tre colonne:
* **Id**: serve allo script per reperire le informazioni dalla tabella stessa (**importante: non modificare questa colonna**);
* **Descrizione**: serve per aiutare l'utente a capire che genere di informazione deve essere inserita;
* **Testo**: è la parte della tabella che deve essere completata dall'utente, inserendo i dati desiderati.

Ogni osservazione deve essere inserita in campi diversi della tabella. Nel caso non sia necessario inserire un'osservazione, lasciare il campo vuoto. Sono permesse fino ad un massimo di sei osservazioni.

Analogamente a quanto accade per le informazioni, anche gli allegati devono essere inseriti in campi diversi della tabella. Nel caso non sia necessario inserire un allegato, lasciare il campo vuoto. Sono permessi fino ad un massimo di sei allegati.


## 3. Spiegazioni in merito al report 
### 3.1 Intestazione
Nella parte iniziale del documento vengono riportate informazioni inerenti:
* il periodo contabile
	* date di apertura/chiusura estratte dalle proprietà del file nella sezione Contabilità
* il tutelato/curatelato
	* nome e cognome estratti dalle proprietà del file nella sezione Indirizzi
* il tutore/curatore
	* nome: dalla tabella Testi, viene ripreso il testo il cui Id è uguale "npd"
	* cognome: dalla tabella Testi, viene ripreso il testo il cui Id è uguale "cpd"
* scelta tra tutore o curatore
	* dalla tabella Testi, viene ripreso il testo il cui Id è uguale "iqd"
* numero articolo
	* dalla tabella Testi, viene ripreso il testo il cui Id è uguale "art"

### 3.2 Situazione patrimoniale
Tabella Attivi
* **Immobili**: vengono elencati tutti i conti appartenenti al gruppo **Gr 11** con il numero di particella, il valore di stima, il saldo e il documento giustificativo.
* **Beni mobili**: vengono elencati tutti i conti appartenenti ai gruppi **Gr 10** e **Gr 20** con saldo **positivo**.
* **Totale**: la somma dei gruppi **11**, **10** e **20** presenti nella tabella.

Tabella Passivi
* **Debiti/Esecuzioni**: vengono elencati tutti i conti appartentenenti al gruppo **Gr 10** e **Gr 20** con saldo **negativo**.
* **Attestati carenza beni**: _Per il momento non implementato_.
* **Totale**: per il momento, la somma del gruppo **Gr 20** (debiti ed esecuzioni). 

Tabella Totali
* **Totale attivo**: Riporto del totale dei gruppi 11, 10 e 20 calcolato in precedenza.
* **Totale passivo**: Riporto del totale del gruppo 20 calcolato in precedenza.
* **Sostanza netta al**: somma totale attivo e totale passivo.

Osservazioni
* Dalla tabella Testi, vengono ripresi ed elencati i testi il cui Id è uguale "oss".

### 3.3 Movimenti finanziari
#### 3.3.1 Conto esercizio
Entrate
* **Totale entrate**: la somma dei conti appartenenti al gruppo **Gr 40**. 
* **Utili patrimoniali**: la somma dei conti appartenenti al gruppo **Gr 41**.
* **Totale**: la somma dei gruppi **Gr 40** e **Gr 41**

Uscite
* **Totale uscite**: la somma dei conti appartenenti al gruppo **Gr 30**. 
* **Perdite patrimoniali**: la somma dei conti appartenenti al gruppo **Gr 31**. 
* **Totale**: la somma dei gruppi **Gr 30** e **Gr 31**

Utile/perdita d'esercizio
* **Utile/perdita d'esercizio**, differenza tra entrate ed uscite.

#### 3.3.2 Conto patrimoniale
* **Riporto della sostanza netta anno precedente**: viene calcolata sommando i **saldi di apertura** di **attivi** (gruppi Gr 10 e 11) e **passivi** (gruppo Gr 20).
* **Utile/perdita d'esercizio (+/-)**: riporto del saldo calcolato al punto 3.3.1.
* **Sostanza netta al**: la somma del saldo sostanza netta anno precedente e utile/perdita d'esercizio.

La sostanza netta calcolata nella tabella riassuntiva di attivo/passivo deve corrispondere alla sostanza netta della tabella dei movimenti finanziari.

### 3.4 Allegati
Dalla tabella Testi, vengono ripresi ed elencati i testi il cui Id è uguale "all".

### 3.5 Decisione
A pagina 4 del rendiconto finanziario vengono inserite alcune informazioni inerenti l'Autorità Regionale di Protezione:
* **Numero** Autorità Regionale di Protezione: dalla tabella Testi, viene ripreso il testo il cui Id è uguale "arn".
* Autorità Regionale di Protezione **di**: dalla tabella Testi, viene ripreso il testo il cui Id è uguale "ard".

### 3.6 Altro
La parte del rendiconto finanziaro rimanente, quella non compilata automaticamente, deve essere riempita a mano da chi di dovere.

