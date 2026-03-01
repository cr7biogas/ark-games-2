# Test Report ARK Games 2.0 - 2026-03-01

## 📊 ANALYZER - Ruolo ATLETA

### ❌ BUG CRITICI

#### REGISTER.HTML
- [ ] NO validazione email (type="text" vs "email")
- [ ] NO validazione telefono
- [ ] Team: membri min non verificato
- [ ] NO feedback visivo submit (serve progress bar)
- [ ] Categorie: crash se vuote

#### ATHLETE.HTML
- [ ] NO link navigazione (HOME/INDIETRO)
- [ ] Team select: NO feedback se vuoto
- [ ] Scores: NO ordinamento WOD

#### LEADERBOARD.HTML
- [ ] Auto-rotate 20s troppo veloce (30-40s)
- [ ] NO skeleton loader

#### INDEX.HTML
- [ ] Troppi bottoni Admin/Judge (confuso)
- [ ] NO link a register.html
- [ ] Competition card: NO preview info

### ⚠️ UX ISSUES
- NO breadcrumb/navbar
- NO back button universale
- Form info-card prezzo poco evidente
- Category cards: NO descrizione
- Mobile: input padding <16px (zoom iOS)
- Leaderboard: overflow orizzontale

### 🟡 FLOW ISCRIZIONE
**PRO:** URL con ?c=compId, form minimale, auto-detect team, success chiaro
**CONTRO:**
- [ ] NO preview gara (serve landing page)
- [ ] Team workflow confuso (serve N campi fissi)
- [ ] NO conferma pre-submit (recap)
- [ ] Success: NO azioni successive

### 🔵 MUST-HAVE (P0)
- [ ] Profilo persistente (login/auth)
- [ ] WOD preview con video demo
- [ ] Notifiche email (conferma, reminder H-24)
- [ ] Heat assignment + calendar export
- [ ] Payment integration Stripe

### 📱 MOBILE FIX
- [ ] 100vh → 100dvh (iOS)
- [ ] Input font-size ≥16px
- [ ] Touch targets ≥44x44px
- [ ] Sticky header
- [ ] Leaderboard overflow-x

---

## 🧊 FREEZER - Ruolo ADMIN
*In attesa...*

---

## 🎬 REGISTA - Ruolo PUBBLICO
*In attesa...*
