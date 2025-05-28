const video = document.getElementById('video');

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (err) {
    console.error('Error accessing camera:', err);
  }
}

// Load face-api models
async function loadModelsAndStart() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

  console.log("Models loaded");
  startCamera();
}

// Wait for everything to load
window.addEventListener('DOMContentLoaded', () => {
  if (typeof faceapi === 'undefined') {
    console.error('faceapi is not defined. Ensure the face-api.js CDN is loaded correctly.');
  } else {
    loadModelsAndStart();
  }
});

const emotionText = document.getElementById('emotion');
const songListDiv = document.getElementById('song-list');
const languageSelect = document.getElementById('language-select');
const favoritesListDiv = document.getElementById('favorites-list');

let currentEmotion = null;
let allSongsForEmotion = {};

// Songs database (feel free to expand)
const musicMap = {
  happy: {
    english: [
      { name: "Happy - Pharrell", link: "https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB" },
      { name: "Best Day Of My Life - American Authors", link: "https://open.spotify.com/track/4XGdStjKZ5Y01yV9NloB0N" }
    ],
    hindi: [
      { name: "Ude Dil Befikre", link: "https://www.youtube.com/watch?v=O0QeY95QXQE" },
      { name: "Kar Gayi Chull", link: "https://www.youtube.com/watch?v=OIKkUtLz1Jc" }
    ],
    telugu: [
      { name: "Butta Bomma", link: "https://www.youtube.com/watch?v=Rp19QD2XIGM" },
      { name: "Ramulo Ramulaa", link: "https://www.youtube.com/watch?v=s0kqobQRc3I" }
    ]
  },
  sad: {
    english: [
      { name: "Someone Like You - Adele", link: "https://open.spotify.com/track/2RlgNHKcydI9sayD2Df2xp" },
      { name: "Let Her Go - Passenger", link: "https://open.spotify.com/track/5bJ1DrXsxU3EfHfC4ZzNfF" }
    ],
    hindi: [
      { name: "Channa Mereya", link: "https://www.youtube.com/watch?v=284Ov7ysmfA" },
      { name: "Tujhe Bhula Diya", link: "https://www.youtube.com/watch?v=bN3ApGe5FBU" }
    ],
    telugu: [
      { name: "Kalusukovalani", link: "https://www.youtube.com/watch?v=xJPH0F9qLbU" },
      { name: "Priyathama", link: "https://www.youtube.com/watch?v=8U3a_z4LGBU" }
    ]
  },
  angry: {
    english: [
      { name: "Break Stuff - Limp Bizkit", link: "https://open.spotify.com/track/6PAt15hCNU9Q40vDLDQ1K9" }
    ],
    hindi: [
      { name: "Ghungroo", link: "https://www.youtube.com/watch?v=0TRB4e3k0Es" }
    ],
    telugu: [
      { name: "Ramuloo Ramulaa", link: "https://www.youtube.com/watch?v=s0kqobQRc3I" }
    ]
  },
  neutral: {
    english: [
      { name: "Let It Be - The Beatles", link: "https://open.spotify.com/track/0YfSYH9AZpR4MtL6lqz7dE" },
      { name: "Imagine - John Lennon", link: "https://open.spotify.com/track/7pKfPomDEeI4TPT6EOYjn9" }
    ],
    hindi: [
      { name: "Kabira - Yeh Jawaani Hai Deewani", link: "https://www.youtube.com/watch?v=K9F8n45PHpo" },
      { name: "Agar Tum Saath Ho", link: "https://www.youtube.com/watch?v=R_A_0_w7jMI" }
    ],
    telugu: [
      { name: "Samajavaragamana", link: "https://www.youtube.com/watch?v=9dTPhdN3Q8g" },
      { name: "Vachinde", link: "https://www.youtube.com/watch?v=YC2MpIDfVOk" }
    ]
  }
  // Add other emotions as needed...
};

// Start webcam video
async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (error) {
    emotionText.textContent = "❌ Webcam permission denied or not available.";
    console.error(error);
  }
}

// Load face-api models and start video
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

// Render songs grouped by language, filtered by selected language
function renderSongList(emotion, langFilter = "all") {
  songListDiv.innerHTML = ""; // Clear previous

  if (!musicMap[emotion]) {
    songListDiv.textContent = "No songs available for detected emotion.";
    return;
  }

  const languagesToShow = langFilter === "all" ? Object.keys(musicMap[emotion]) : [langFilter];

  languagesToShow.forEach(lang => {
    const songs = musicMap[emotion][lang];
    if (!songs || songs.length === 0) return;

    const langHeading = document.createElement("h3");
    langHeading.textContent = lang;
    songListDiv.appendChild(langHeading);

    const ul = document.createElement("ul");

    songs.forEach(song => {
      const li = document.createElement("li");

      // Song link
      const a = document.createElement("a");
      a.href = song.link;
      a.target = "_blank";
      a.textContent = song.name;

      // Favorite button
      const favBtn = document.createElement("button");
      favBtn.textContent = isFavorite(song) ? "★" : "☆";
      favBtn.title = "Toggle Favorite";
      favBtn.addEventListener("click", () => {
        toggleFavorite(song);
        favBtn.textContent = isFavorite(song) ? "★" : "☆";
        renderFavorites();
      });

      li.appendChild(a);
      li.appendChild(favBtn);
      ul.appendChild(li);
    });

    songListDiv.appendChild(ul);
  });
}

// Favorites stored in localStorage
function getFavorites() {
  const favs = localStorage.getItem("favorites");
  return favs ? JSON.parse(favs) : [];
}
function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}
function isFavorite(song) {
  return getFavorites().some(fav => fav.name === song.name && fav.link === song.link);
}
function toggleFavorite(song) {
  let favs = getFavorites();
  if (isFavorite(song)) {
    favs = favs.filter(fav => !(fav.name === song.name && fav.link === song.link));
  } else {
    favs.push(song);
  }
  saveFavorites(favs);
}
function renderFavorites() {
  const favs = getFavorites();
  favoritesListDiv.innerHTML = "";
  if (favs.length === 0) {
    favoritesListDiv.textContent = "No favorites yet.";
    return;
  }

  const ul = document.createElement("ul");
  favs.forEach(song => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = song.link;
    a.target = "_blank";
    a.textContent = song.name;

    // Remove button for favorites
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.title = "Remove from favorites";
    removeBtn.addEventListener("click", () => {
      toggleFavorite(song);
      renderFavorites();
      renderSongList(currentEmotion, languageSelect.value);
    });

    li.appendChild(a);
    li.appendChild(removeBtn);
    ul.appendChild(li);
  });
  favoritesListDiv.appendChild(ul);
}

// Handle language filter change
languageSelect.addEventListener("change", () => {
  if (currentEmotion) {
    renderSongList(currentEmotion, languageSelect.value);
  }
});

// Main detection loop
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.appendChild(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
    if (detections) {
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      // Get highest confidence emotion
      const expressions = detections.expressions;
      const sorted = Object.entries(expressions).sort((a,b) => b[1]-a[1]);
      const [emotion, confidence] = sorted[0];

      // Only pick emotions we have songs for
      if (musicMap.hasOwnProperty(emotion)) {
        if (currentEmotion !== emotion) {
          currentEmotion = emotion;
          emotionText.textContent = `Detected Emotion: ${emotion}`;
          renderSongList(emotion, languageSelect.value);
        }
      } else {
        emotionText.textContent = `Detected Emotion: ${emotion} (No songs available)`;
        songListDiv.innerHTML = "";
      }
    } else {
      emotionText.textContent = "No face detected";
      songListDiv.innerHTML = "";
    }
  }, 1500);
});

// On page load, render favorites
renderFavorites();
