# ARK Games 2.0 - Product & UX Vision
*Report by ANALYZER - 2026-03-01*

## 1. UX per Tipo Utente

### ADMIN (Gestore Box)
- **Dashboard**: Overview gare attive, revenue, azioni rapide
- **Setup gara**: 3 step (<10 min) - Base→WOD→Iscrizioni
- **Template gare** pre-fatte (duplica precedenti)
- **Import/export CSV** atleti

### GIUDICI
- **Mobile-first app OFFLINE** (sync quando c'è rete)
- Inserimento score rapido **multi-lane**
- **Voice input** per time
- **No-rep counter** + photo upload

### ATLETI
- Iscrizione **<2 min** (autofill profilo)
- Storico gare + **Personal Records**
- **Share social auto** (Instagram post)
- Reminder pre-gara (WhatsApp/Email)

### PUBBLICO
- Live leaderboard **real-time** (WebSocket)
- **Streaming integrato** (YouTube/Twitch)
- No login richiesto
- Social wall (feed Instagram #gara)

## 2. Dashboard Admin

```
📊 OVERVIEW
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Gare Attive │   Atleti    │   Revenue   │ Prossima    │
│      3      │     127     │   €2,340    │   2 giorni  │
└─────────────┴─────────────┴─────────────┴─────────────┘

⚡ AZIONI RAPIDE
[+ Nuova Gara] [Template] [Atleti] [Report]

🔥 GARE ATTIVE
┌─────────────────────────────────────────────────────┐
│ ARK Games Spring 2026         │ 45 atleti │ Live 🟢 │
│ Team Throwdown                │ 32 atleti │ Setup   │
└─────────────────────────────────────────────────────┘
```

## 3. Setup Gara Semplificato

### Quick Start (60 sec)
1. **Scegli template**: Open / Throwdown / Team / Custom
2. **Personalizza**: nome, data, WOD
3. **Pubblica**: link + QR code

### Automazioni
- Heat assignment automatico
- Categorie auto (M/F, scaled/RX)
- Schedule generator
- Reminder automatici

## 4. Integrazioni

### Tier 1 (MVP)
- **Stripe** - Pagamenti
- **Instagram** - Auto-post risultati
- **YouTube/Twitch** - Live streaming
- **SendGrid** - Email
- **WhatsApp** - Reminder (WAHA)

### Tier 2 (Growth)
- Wodify sync
- Google Calendar
- Zoom (briefing virtuali)
- Canva (grafiche auto)

## 5. Differenziazione Competitiva

### Killer Features
1. ⚡ **Template 1-click setup**
2. 📱 **Judge App Offline**
3. 📸 **Auto-post Social**
4. 🎬 **AI Recap Video**
5. 🏆 **Multi-Box League**

### Pricing
| Competitor | Prezzo |
|------------|--------|
| Wodify | €99/mese |
| CompCorner | €49/gara |
| **ARK Games** | **€29/gara** |

### Vantaggi
- Setup **3x più veloce**
- Mobile **offline-first**
- **White-label** incluso
- **Live streaming** integrato

## 6. Roadmap

### Phase 1: MVP (2-3 settimane)
- [x] Setup gara base
- [x] Judge mobile
- [x] Leaderboard live
- [ ] Stripe integration
- [ ] Email notifications

### Phase 2: Growth (1-2 mesi)
- [ ] Template library
- [ ] Social auto-post
- [ ] Streaming integrato
- [ ] White-label

### Phase 3: Scale (3+ mesi)
- [ ] Multi-box league
- [ ] AI highlights
- [ ] Marketplace (WOD, templates)

---

## Next Steps
1. Figma prototype dashboard
2. Test con 5 gestori box
3. MVP feature prioritization
