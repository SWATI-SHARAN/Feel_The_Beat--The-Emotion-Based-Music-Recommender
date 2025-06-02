
# Feel The Beat - The Emotion Based Music Player   
_“Feel the universe through music”_

![emotion-gif](https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif)  
> A futuristic emotion-aware music player that detects your mood through your webcam and plays Spotify music to match it, wrapped in an immersive cosmic interface.

---

##  Features

-  Real-time **Facial Emotion Detection** using webcam and `face-api.js`
-  Emoji-based **Mood Display**
-  Dynamic **Song Suggestions** based on emotion
-  Cosmic **Animated Background** for an immersive experience
-  Live **Emotion Intensity Graphs**
-  Manual Emotion Buttons: Happy, Sad, Angry
-  Optional mode for selction of **prefered language** based on choice
-  Fast and lightweight; runs fully in-browser
- User can mark thier **favourite songs** in the stellar collection section

---

##  How It Works

1. Your webcam feed is processed using `face-api.js`
2. The system analyzes key facial landmarks to detect emotion (happy, sad, angry, surprised, neutral)
3. Detected emotion is shown with a corresponding emoji
4. Songs from a predefined emotion-based playlist (or Spotify links) are recommended
5. The entire interface is styled with a glowing space-themed UI

---

##  Installation & Usage

### Prerequisites

- Modern browser (Chrome preferred)
- Internet connection for face-api model CDN (or download locally)

### Run Locally


Just open `index.html` in your browser.

> ⚠️ Make sure to allow webcam access when prompted.

---

##  Tech Stack

| Category     | Tools                          |
|--------------|---------------------------------|
| Frontend     | HTML, CSS, JavaScript          |
| Emotion AI   | `face-api.js` (TensorFlow.js)  |
| Animations   | CSS3, optional GSAP            |
| Music Source | Spotify / YouTube embeds       |
| UI Icons     | Font Awesome, Emojis           |

---

##  Emotion Categories

| Emotion   | Description                          | Songs Count |
|-----------|--------------------------------------|-------------|
| 😄 Happy   | Energetic, feel-good tracks          | 15+         |
| 😢 Sad     | Calming, slow-paced music            | 15+         |
| 😠 Angry   | Intense, power-packed beats          | 15+         |
| 😐 Neutral | Balanced mood music (lo-fi, chill)   | 10+         |
| 😲 Surprised | Electronic, unpredictable mixes    | 10+         |

---

## 💖 Credits

- Emotion Detection via [`face-api.js`](https://github.com/justadudewhohacks/face-api.js)
- Icons by [Font Awesome](https://fontawesome.com)
- UI & Emojis designed by [Swati Sharan](https://github.com/yourusername)

---
