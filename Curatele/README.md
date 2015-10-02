# Rendiconto finanziario per curatele
La BananaApp [rendicontoFinanziario.js](https://raw.githubusercontent.com/BananaAccounting/Ticino/master/Curatele/rendicontoFinanziario.js) prepara il rendiconto finanziario per le curatele (art. 410 Codice civile svizzero) secondo lo schema dell'autorità di vigilanza del Cantone Ticino.

## Come usare questa BananaApps
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


## Documentazione

Il rendiconto finanziario verrà creato in modo quasi del tutto automatico tramite l’esecuzione dello script allegato. Bisogna però rispettare alcune semplici regole riguardanti la struttura del file di banana contabilità e l’inserimento manuale di determinate informazioni fondamentali.
### Struttura Contabilità
Nella tabella **Conti** Sono state aggiunte tre colonne:
* ValoreStima (valore di stima degli immobili)
* ParticellaNumero (numero particella degli immobili)
* DocNumero (numero del documento giustificativo)

#### Attivi
I conti attivi sono divisi in due categorie: Beni mobili e Immobili.
* Beni mobili
 	* Gruppo 10
	* Necessitano del campo DocNumero
* Immobili
	* Gruppo 11
	* Necessitano del campo DocNumero
	* Necessitano del campo ValoreStima
	* Necessitano del campo ParticellaNumero

#### Passivi
I conti passivi sono rappresentati in due categorie: Debiti e Capitale proprio.
* Debiti
	* Gruppo 20
	* Necessitano del campo DocNumero
* Capitale proprio
	* Gruppo 29

#### Ricavi
Le entrate sono rappresentate in due categorie: Ricavi generali e Ricavi patrimoniali.
* Ricavi generali
	* Gruppo 40
* Ricavi patrimoniali
	* Gruppo 41

#### Costi
Le uscite sono rappresentate in due categorie: Costi generali e Costi patrimoniali.
* Costi generali
	* Gruppo 30
* Costi patrimoniali
	* Gruppo 31

### Completamento dati
Per poter compilare correttamente il rendiconto finanziario è necessario che l’utente inserisca manualmente alcuni valori che saranno poi riportati automaticamente nel rapporto finale.
#### Proprietà file
**File > Proprietà File** e selezionare la finestra **Contabilità**.
In questa finestra appariranno diversi campi modificabili, ma gli unici che devono essere modificati sono le date di apertura e chiusura del periodo contabile.

**File > Proprietà File** e selezionare la finestra **Indirizzi**.
In questa finestra è necessario inserire i dati riguardanti la persona tutelata/curatelata.

#### Tabella Testi
Il file di banana contabilità deve contenere la tabella **Testi**, pensata appositamente per permettere all'utente di inserire le informazioni necessarie in modo molto semplice e diretto. Questa tabella è composta da tre colonne:
* la colonna **Id**: serve allo script per reperire le informazioni dalla tabella stessa (**importante: non modificare questa colonna**);
* la colonna **Descrizione**: serve per aiutare l'utente a capire che genere di informazione deve essere inserita;
* la colonna **Testo**: serve all'utente per inserire i dati corretti.
Nel caso non esistesse la tabella in questione: **Strumenti > Aggiungi nuove funzionalità... > Nuova tabella libera**, per creare la tabella.
Di seguito una breve panoramica dei valori modificabili suddivisi in base al contesto in cui verranno utilizzati all’interno del documento.

ID   | Descrizione del campo                    | Tipo dato
-----| -----------------------------------------|----------
_npd | Nome di chi presenta il rendiconto       | Testo
_cpd | Cognome di chi presenta il rendiconto    | Testo
_iqd | Scelta tra tutore o curatore             | Testo
_art | Numero dell'articolo                     | Testo/numero
_arn | Numero Autorità Regionale di Protezione  | Testo/numero
_ard | Regione Autorità Regionale di Protezione | Testo
_oss | Osservazione/informazione 1              | Testo
_oss | Osservazione/informazione 2              | Testo 
_oss | Osservazione/informazione 3              | Testo 
_oss | Osservazione/informazione 4              | Testo 
_oss | Osservazione/informazione 5              | Testo 
_oss | Osservazione/informazione 6              | Testo 
_all | Allegato 1                               | Testo
_all | Allegato 2                               | Testo
_all | Allegato 3                               | Testo
_all | Allegato 4                               | Testo
_all | Allegato 5                               | Testo
_all | Allegato 6                               | Testo

Ogni osservazione deve essere inserita in campi diversi della tabella. Nel caso non sia necessario inserire un'osservazione, lasciare il campo vuoto.

Ogni allegato deve essere inserito in campi diversi della tabella. Nel caso non sia necessario inserire un allegato, lasciare il campo vuoto.


## Ulteriori informazioni
### Intestazione
Nella parte iniziale del documento vengono riportate informazioni inerenti:
* il periodo contabile;
* il tutelato/curatelato;
* il tutore/curatore
### Situazione patrimoniale

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

### Movimenti finanziari
#### Conto esercizio
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

#### Conto patrimoniale
* riporto della sostanza netta anno precedente
* riporto utile/perdita d'esercizio
* totale, somma del saldo sostanza netta anno precedente e utile/perdita d'esercizio

La sostanza netta calcolata nella tabella riassuntiva di attivo/passivo deve corrispondere alla sostanza netta della tabella dei movimenti finanziari.

