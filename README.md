# 🏋️ ARK Games 2.0

Sistema completo per competizioni CrossFit interne.

## ✨ Features

- **Crea gara** - WOD, categorie, team
- **Timeline automatica** - Generata dai WOD
- **Judging smart** - Anti-errore, sync real-time
- **Leaderboard live** - Aggiornata istantaneamente
- **Streaming** - Multi-camera da smartphone

## 🚀 Quick Start

1. Apri `/admin` e crea una gara
2. Aggiungi WOD e team
3. Genera timeline
4. Giudici aprono `/judge`
5. Pubblico su `/leaderboard`

## 📱 Pagine

- `/` - Home
- `/admin` - Gestione gara
- `/judge` - Per i giudici
- `/leaderboard` - Classifica live
- `/tv` - Display venue

## 🔧 Setup Dev

```bash
# Clone
git clone https://github.com/ArkGames/ark-games-2.git
cd ark-games-2

# Dev server
npx serve .

# Deploy
vercel --prod
```

## 📄 License

MIT
