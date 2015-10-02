<<<<<<< HEAD
#Rendiconto finanziario per curatele
La BananaApp [rendicontoFinanziario.js] (https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js) prepare il rendiconto finanziario per le curatele (art. 410 Codice civile svizzero) secondo lo schema dell'autorità di vigilanza del Cantone Ticino.

##Per usare questa BananaApps 

1. Scaricare il file [rendicontoFinanziario.js]  (https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js). Usare il bottone destro del mouse e scegliere salva il file. 
2. Istallare la BananaApp in Banana Contabilità
   * Menu Apps -> Gestisci Apps -> Aggiungi App
3. Scaricare il file della contabiltà doppia e adattarlo alle proprie esigenze. 

##Per stampare il report 
1. Menu Apps -> Rendiconto finanziario (art. 410 CC)
=======
# Rendiconto finanziario per curatele
La BananaApp [rendicontoFinanziario.js](https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js) prepara il rendiconto finanziario per le curatele (art. 410 Codice civile svizzero) secondo lo schema dell'autorità di vigilanza del Cantone Ticino.

## 1. Come usare questa BananaApps
Procedere come segue per installare la app:

1. Scaricare il file della contabiltà doppia e adattarlo alle proprie esigenze
2. Scaricare file **[rendicontoFinanziario.js](https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js)**. Salvare il file (clic tasto destro del mouse e scegliere **salva file**) nella stessa cartella del file di contabilità
3. Avviare Banana 8 e aprire il file di contabilità
4. Nel Menu **Apps** selezionare il comando **Gestione Apps…**
5. Nel dialogo cliccare su **Aggiungi…**, selezionare il file
6. Confermare l’importazione della apps cliccando su **Ok**
7. Salvare la contabilità

Procedere come segue per usare la app:
1. Aprire il file contabile
2. Dal menu **Apps** selezionare **Rendiconto finanziario (art. 410 CC)**

A questo punto verrà creato il report del rendiconto finanziario e sarà possibile salvarlo in formato pdf.


## 2. Documentazione

Il rendiconto finanziario verrà creato in modo quasi del tutto automatico tramite l’esecuzione dello script allegato. Bisogna però rispettare alcune semplici regole riguardanti la struttura del file di banana contabilità e l’inserimento manuale di determinate informazioni fondamentali.
### 2.1 Struttura Contabilità
Nella tabella **Conti** Sono state aggiunte tre colonne:
* ValoreStima (valore di stima degli immobili)
* ParticellaNumero (numero particella degli immobili)
* DocNumero (numero del documento giustificativo)

#### 2.1.1 Attivi
I conti attivi sono divisi in due categorie: Beni mobili e Immobili.
* Beni mobili
 	* Gruppo 10
	* Necessitano del campo DocNumero
* Immobili
	* Gruppo 11
	* Necessitano del campo DocNumero
	* Necessitano del campo ValoreStima
	* Necessitano del campo ParticellaNumero

#### 2.1.2 Passivi
I conti passivi sono rappresentati in due categorie: Debiti e Capitale proprio.
* Debiti
	* Gruppo 20
	* Necessitano del campo DocNumero
* Capitale proprio
	* Gruppo 29

#### 2.1.3 Ricavi
Le entrate sono rappresentate in due categorie: Ricavi generali e Ricavi patrimoniali.
* Ricavi generali
	* Gruppo 40
* Ricavi patrimoniali
	* Gruppo 41

#### 2.1.4 Costi
Le uscite sono rappresentate in due categorie: Costi generali e Costi patrimoniali.
* Costi generali
	* Gruppo 30
* Costi patrimoniali
	* Gruppo 31

### 2.2 Completamento dati
Per poter compilare correttamente il rendiconto finanziario è necessario che l’utente inserisca manualmente alcuni valori che saranno poi riportati automaticamente nel rapporto finale.
#### 2.2.1 Proprietà file
**File > Proprietà File** e selezionare la finestra **Contabilità**.
In questa finestra appariranno diversi campi ed è fondamentale che siano compilate almeno le date di apertura e chiusura del periodo contabile.

**File > Proprietà File** e selezionare la finestra **Indirizzi**.
In questa finestra è necessario inserire i dati riguardanti la persona tutelata/curatelata.

#### 2.2.2 Tabella Testi
Il file di banana contabilità deve contenere la tabella **Testi**, pensata appositamente per permettere all'utente di inserire le informazioni necessarie in modo molto semplice e diretto. Questa tabella è composta da tre colonne:
* la colonna **Id**: serve allo script per reperire le informazioni dalla tabella stessa (**importante: non modificare questa colonna**);
* la colonna **Descrizione**: serve per aiutare l'utente a capire che genere di informazione deve essere inserita;
* la colonna **Testo**: serve all'utente per inserire i dati corretti.

Nel caso non esistesse la tabella, per crearla andare nel menu **Strumenti > Aggiungi nuove funzionalità... > Nuova tabella libera**, inserire **Testi** come nome tabella (**importante**).
Di seguito una breve panoramica dei valori modificabili .

Descrizione del campo                    | Tipo di dato
-----------------------------------------|-------------
Nome di chi presenta il rendiconto       | Testo
Cognome di chi presenta il rendiconto    | Testo
Scelta tra tutore o curatore             | Testo
Numero dell'articolo                     | Testo/numero
Numero Autorità Regionale di Protezione  | Testo/numero
Regione Autorità Regionale di Protezione | Testo
Osservazione/informazione 1              | Testo
Osservazione/informazione 2              | Testo 
Osservazione/informazione 3              | Testo 
Osservazione/informazione 4              | Testo 
Osservazione/informazione 5              | Testo 
Osservazione/informazione 6              | Testo 
Allegato 1                               | Testo
Allegato 2                               | Testo
Allegato 3                               | Testo
Allegato 4                               | Testo
Allegato 5                               | Testo
Allegato 6                               | Testo

Ogni osservazione deve essere inserita in campi diversi della tabella. Nel caso non sia necessario inserire un'osservazione, lasciare il campo vuoto. Sono permesse fino ad un massimo di sei osservazioni.

Ogni allegato deve essere inserito in campi diversi della tabella. Nel caso non sia necessario inserire un allegato, lasciare il campo vuoto. Sono permessi fino ad un massimo di sei allegati.


## 3. Ulteriori informazioni
### 3.1 Intestazione
Nella parte iniziale del documento vengono riportate informazioni inerenti:
* il periodo contabile;
* il tutelato/curatelato;
* il tutore/curatore

### 3.2 Situazione patrimoniale
Tabella Attivi
* vengono elencati tutti gli immobili con il numero di particella, il valore di stima, il saldo e il documento giustificativo;
* vengono elencati tutti i beni mobili con saldo positivo e i passivi con saldo positivo (capitale proprio escluso);
* totale, la somma di immobili, beni mobili e passivi presenti nella tabella

Tabella Passivi
* vengono elencati tutti i passivi con saldo negativo (capitale proprio escluso);
* vengono elencati tutti gli attivi con saldo negativo;
* totale, la somma di passivi e attivi presenti nella tabella

Tabella Totali
* riporto del totale degli attivi
* riporto del totale dei passivi
* totale della sostanza netta, la somma di attivi e passivi

Osservazioni
* vengono elencate tutte le eventuali osservazioni che l'utente ha inserito nella tabella Testi.

### 3.3 Movimenti finanziari
#### 3.3.1 Conto esercizio
Entrate
* riporto del totale delle entrate
* riporto degli utili patrimoniali
* totale, la somma del totale delle entrate e degli utili patrimoniali

Uscite
* riporto del totale delle uscite
* riporto delle perdite patrimoniali
* totale, somma del totale delle uscite e le perdite patrimoniali

Utile/perdita d'esercizio
* utile/perdita d'esercizio, differenza tra entrate ed uscite

#### 3.3.2 Conto patrimoniale
* riporto della sostanza netta anno precedente
* riporto utile/perdita d'esercizio
* totale, somma del saldo sostanza netta anno precedente e utile/perdita d'esercizio

La sostanza netta calcolata nella tabella riassuntiva di attivo/passivo deve corrispondere alla sostanza netta della tabella dei movimenti finanziari.

>>>>>>> development
