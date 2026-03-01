# ARK Games 2.0 - Architettura

## 🎯 Vision
Sistema completo per competizioni CrossFit interne.
Qualsiasi box può creare la sua gara con judging, leaderboard e streaming live.

## 🏗️ Struttura Dati

```
competitions/
  └─► {compId}/
       ├─► info: { name, date, status }
       ├─► categories: { exp, scaled, open... }
       ├─► teams/
       │    └─► {teamId}: { name, emoji, category }
       ├─► workouts/
       │    └─► {wodId}: { 
       │         name, type, timeCapSec, 
       │         movements: [{ name, reps, weight }],
       │         categories: ["exp", "scaled"]
       │       }
       ├─► timeline/
       │    └─► {heatId}: {
       │         wodId, startTime, 
       │         lanes: [teamId, teamId, teamId],
       │         status: "pending|ready|running|done"
       │       }
       ├─► judges/
       │    └─► {odgeId}: {
       │         odgeName, odgelane, teamId, odgestatus: "connected|ready",
       │         present: true/false
       │       }
       └─► scores/
            └─► {odgeteamId_wodId}: {
                 odgeteamId, wodId, score, time, reps,
                 odgeudgeId, timestamp
               }
```

## 📱 Pagine

| Pagina | Scopo | Utente |
|--------|-------|--------|
| `/` | Home + Seleziona gara | Tutti |
| `/admin` | Crea gara, WOD, team, genera timeline | Organizzatore |
| `/judge` | Seleziona WOD → Team → Conferma → Score | Giudice |
| `/leaderboard` | Classifica live per categoria | Pubblico |
| `/tv` | Display grande per venue | Schermo palestra |
| `/stream` | Composizione multi-camera | Regia |

## 🔄 Flusso Principale

```
1. ADMIN crea gara
   └─► Inserisce categorie + team
   
2. ADMIN crea WOD
   └─► Nome, tipo (AMRAP/ForTime/etc)
   └─► Movimenti con rep
   └─► Sistema calcola durata suggerita
   └─► Assegna a categorie
   
3. SISTEMA genera timeline
   └─► Heat auto-create basate su:
       - Numero team per categoria
       - Numero lane (default 3)
       - Durata WOD + pausa
   
4. GIUDICI si collegano
   └─► Selezionano WOD attivo
   └─► Scelgono team senza score
   └─► Confermano presenza atleta
   └─► Cliccano PRONTO
   
5. ADMIN vede stato giudici
   └─► Tutti pronti = può avviare
   └─► START → countdown → timer
   
6. FINE HEAT
   └─► Giudici inseriscono score
   └─► Leaderboard si aggiorna
   └─► Prossima heat...
```

## 🛡️ Regole Anti-Errore

1. **Team con score nascosti** - Giudice non può selezionare team che ha già score per quel WOD
2. **Presenza obbligatoria** - Giudice deve confermare che atleta/team è presente
3. **Start bloccato** - Se giudice connesso ma senza team/presenza → no start
4. **Un giudice basta** - Se almeno 1 pronto, può partire
5. **Sync real-time** - Tutto via Firebase Realtime Database

## 🎥 Streaming (Fase 2)

- Telefoni come webcam sulla stessa WiFi
- Pagina `/stream` compone i feed
- Output per OBS/YouTube
- Overlay automatici (timer, score, team)

## 📦 Tech Stack

- **Frontend**: HTML/CSS/JS vanilla (semplice, veloce)
- **Database**: Firebase Realtime Database
- **Hosting**: Vercel
- **Sync**: Firebase listeners real-time
