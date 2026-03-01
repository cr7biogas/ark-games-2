# ARK Games 2.0 - Sistema Streaming

## Architettura

```
┌─────────────────────────────────────────────────────────────┐
│                        PALESTRA                              │
├─────────────────────────────────────────────────────────────┤
│  📱 Phone 1          📱 Phone 2          📱 Phone 3         │
│  DroidCam            IP Webcam           DroidCam            │
│  :4747               :8080               :4747               │
│     │                   │                   │                │
│     └───────────────────┼───────────────────┘                │
│                         │                                    │
│                    WiFi Router                               │
│                         │                                    │
│     ┌───────────────────┼───────────────────┐                │
│     │                   │                   │                │
│  💻 PC Regia      📺 TV Monitor      👥 Pubblico            │
│  stream.html      tv.html           leaderboard.html         │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ (Internet)
                          ▼
            ┌─────────────────────────┐
            │      YouTube Live       │
            │     (via OBS/Prism)     │
            └─────────────────────────┘
```

## Setup Rapido

### 1. Telefoni come Camere

**DroidCam (Consigliato)**
- Installa DroidCam da Play Store
- Avvia l'app → mostra IP:4747
- Stream URL: `http://IP:4747/video`

**IP Webcam**
- Installa IP Webcam da Play Store
- Avvia server → mostra IP:8080
- Stream URL: `http://IP:8080/video`

### 2. Regia (stream.html)

1. Apri `/stream.html` sul PC
2. Clicca "📡 Cerca Camere"
3. Assegna camere alle lane
4. Seleziona layout
5. Attiva overlay se necessario

### 3. Output per YouTube

**Opzione A: OBS**
```
File → Settings → Stream
- Service: YouTube
- Stream Key: [dal tuo canale]

Sources:
- Browser Source → URL: http://localhost:PORT/stream.html
- O Window Capture della finestra stream.html
```

**Opzione B: Prism Live**
- Aggiungi scena con Browser
- URL: stream.html fullscreen

## Formati Video

| App | Porta | Formato | URL |
|-----|-------|---------|-----|
| DroidCam | 4747 | MJPEG | /video |
| IP Webcam | 8080 | MJPEG | /video |
| IP Webcam | 8080 | RTSP | rtsp://IP:8080/h264_opus.sdp |

## Layout Disponibili

### Single (1 camera)
```
┌─────────────────────┐
│                     │
│      Camera 1       │
│                     │
└─────────────────────┘
```

### Quad (2x2)
```
┌──────────┬──────────┐
│ Camera 1 │ Camera 2 │
├──────────┼──────────┤
│ Camera 3 │ Camera 4 │
└──────────┴──────────┘
```

### Side-by-Side
```
┌─────────────┬───────┐
│             │ Cam 2 │
│   Camera 1  ├───────┤
│             │ Cam 3 │
└─────────────┴───────┘
```

## Overlay

L'overlay mostra:
- ⏱️ Timer sincronizzato con Firebase
- 🏆 Score delle lane attive
- 🐾 Logo/branding

Attivabile con pulsante "👁️ Overlay" in regia.

## Troubleshooting

### Camera non trovata
1. Verifica che telefono e PC siano sulla stessa WiFi
2. Controlla che l'app camera sia attiva
3. Prova ad aprire `http://IP:PORTA/video` nel browser

### Lag/Stuttering
1. Riduci qualità video nell'app camera
2. Avvicina telefoni al router
3. Usa cavo ethernet per PC regia

### OBS non vede stream.html
1. Assicurati che la pagina sia aperta in Chrome
2. Usa "Window Capture" invece di "Browser Source"
3. Oppure usa VLC per catturare gli stream MJPEG
