/*
Il software deve generare casualmente le statistiche di gioco di
100 giocatori di basket per una giornata di campionato.
In particolare vanno generate per ogni giocatore le seguenti
informazioni, facendo attenzione che il numero generato abbia
senso:
- Codice Giocatore Univoco (formato da 3 lettere
maiuscole casuali e 3 numeri)
- Numero di punti fatti
- Numero di rimbalzi
- Falli
- Percentuale di successo per tiri da 2 punti
- Percentuale di successo per da 3 punti
Una volta generato il “database”, il programma deve chiedere
all’utente di inserire un Codice Giocatore e il programma
restituisce le statistiche.
*/

//PROGRAMMA COMPLETO CON RICERCA TRAMITE prompt

var staMostrandoRisultato = false;

gestisciElementiHTMLDiRicerca();

var databaseGiocatori = generaDatabaseGiocatori(100);
//console.log(databaseGiocatori);

caricaUIListaGiocatoriDa(databaseGiocatori);

// FUNZIONI

function gestisciElementiHTMLDiRicerca() {
  console.log(staMostrandoRisultato);
  if (!staMostrandoRisultato) {
    document.getElementsByClassName('searchAgain')[0].style.display = 'none';
    document.getElementsByClassName('searchBar')[0].style.display = 'flex';
  } else {
    document.getElementsByClassName('searchAgain')[0].style.display = 'flex';
    document.getElementsByClassName('searchBar')[0].style.display = 'none';
  }
}

function caricaUIListaGiocatoriDa(databaseGiocatori) {
  document.getElementById('db').innerHTML = '';

  for (var i = 0; i < databaseGiocatori.length; i++) {
    generaCard(databaseGiocatori[i]);
  }
}

function gestisciInterazioneControlliRicerca() {
  if (staMostrandoRisultato) {
    staMostrandoRisultato = !staMostrandoRisultato;
    gestisciElementiHTMLDiRicerca();
    caricaUIListaGiocatoriDa(databaseGiocatori);
  } else {
    interroga(databaseGiocatori, (prompt('Digita id Giocatore desiderato')));
  }
}

function generaCard(giocatore) {
  var cardBaseHTML = '<div class="player_card"><div class="card_header"><div class="player_id"><h2 class="">ID GIOCATORE: ' + giocatore.id + '</h2></div></div><div class="card_body"><ul class="player_stats player_' + giocatore.id + '"></ul></div></div>';
  document.getElementById('db').innerHTML += cardBaseHTML;

  var listaStatistiche = document.getElementsByClassName('player_' + giocatore.id)[0];

  for (var key in giocatore.statistiche) {
    listaStatistiche.innerHTML += '<li><span class="stat_key">' + key + ' :</span> ' + giocatore.statistiche[key] + '</li>';
  }

}

function generaDatabaseGiocatori(nrGiocatori) {
  var arrayGiocatori = [];

  var arrayId = generaIdCasualiDifferentiPer(nrGiocatori);

  for (var i = 0; i < arrayId.length; i++) {
    arrayGiocatori.push(generaNuovoOggettoGiocatoreRandomCon(arrayId[i]));
  }

  return arrayGiocatori;
}

function interroga(database, id) {

  if (id == '' || id == null) {
    alert('Input non valido');
    return;
  }

  var idAdattato = id.toUpperCase();

  var risultatoQuery = databaseContiene(database, idAdattato);
  console.log(risultatoQuery);
  if (risultatoQuery == -1) {
    stampaASchermoErrore();
  } else {
    stampaASchermoGiocatoreDa(risultatoQuery, database);
    staMostrandoRisultato = true;
    gestisciElementiHTMLDiRicerca();

  }
}

function stampaASchermoErrore() {
  alert('Nessun Giocatore trovato con questo id.');
}

function stampaASchermoGiocatoreDa(indice, database) {

  document.getElementById('db').innerHTML = '';
  alert('giocatore trovato');
  var giocatore = database[indice];
  console.log();
  generaCard(database[indice]);

}

function databaseContiene(database, id) {

  for (var i = 0; i < database.length; i++) {
    if (database[i].id == id) {
      return i;
    }
  }

  return -1;
}

function generaIdCasualiDifferentiPer(totaleId) {

  var arrayId = [];

  while (arrayId.length <= totaleId - 1) {
    var numeriCasuali = generaNumeroCasualeTra(100, 999);
    var stringaCasuale = generaStringaConLettereCasuali(3);
    var idCandidato = stringaCasuale + numeriCasuali;
    if (arrayId.includes(idCandidato) == false) {
      arrayId.push(idCandidato);
    }
  }

  return arrayId;
}

function generaStringaConLettereCasuali(numeroCaratteri) {
  var alfabeto = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","u","v","w","x","y","z"];

  var stringaRisultato = "";

  for (var i = 0; i < numeroCaratteri; i++) {
    var stringaCasuale = alfabeto[generaNumeroCasualeTra(0, alfabeto.length - 1)];
    stringaRisultato += stringaCasuale.toUpperCase();
  }
  return stringaRisultato;
}

function generaNuovoOggettoGiocatoreRandomCon(id) {

  var nuovoGiocatore = {
    id: id,
  };

  nuovoGiocatore.statistiche = generaOggettoStatistiche();

  return nuovoGiocatore;
}

function generaOggettoStatistiche() {

  var statistiche = {
    rimbalzi : generaNumeroCasualeTra(1,30), //Numero di rimbalzi
    falli : generaNumeroCasualeTra(0, 5) //Falli
  };

  //Creazione restanti parametri delle statistiche
  var statisticaCreata = false;

  while (statisticaCreata != true) {
    //Genero Punteggio Totale Casuale
    statistiche.punteggioPartita = generaNumeroCasualeTra(20,80);

    //Genero una percentuale tiri da 3 riuscita
    var percentualeTiriDa3Casuale = generaNumeroCasualeTra(30,60);

    //Calcolo punti fatti con tiri da 3 e 2 ad Intero
    var puntiTiriDa3ConPerScelta = parseInt(statistiche.punteggioPartita / 100 * percentualeTiriDa3Casuale);
    var tiriDa2Sottratti = statistiche.punteggioPartita - puntiTiriDa3ConPerScelta;

    if (puntiTiriDa3ConPerScelta % 3 == 0) {
      if (tiriDa2Sottratti % 2 == 0) {
        statisticaCreata = true;
      }
    }
  }

  //Assegnazione parametri generati
  statistiche.tiriDa3Riusciti = puntiTiriDa3ConPerScelta / 3;
  statistiche.tiriDa2Riusciti = tiriDa2Sottratti / 2;
  statistiche.puntiConTiriDa3Riusciti = puntiTiriDa3ConPerScelta;
  statistiche.puntiConTiriDa2Riusciti = tiriDa2Sottratti ;
  statistiche.percentualeTiriDa3InPartita = percentualeTiriDa3Casuale + '%';
  statistiche.percentualeTiriDa2InPartita = (100 - percentualeTiriDa3Casuale) + '%';

  return statistiche;
}
