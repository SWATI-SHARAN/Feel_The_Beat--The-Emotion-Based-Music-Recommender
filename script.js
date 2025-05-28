const video = document.getElementById('video');
const emotionText = document.getElementById('emotion');
const songLink = document.getElementById('song-link');

// Start webcam
async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    console.log("✅ Webcam started");
  } catch (err) {
    console.error("❌ Webcam error: ", err);
    emotionText.textContent = "❌ Webcam access denied.";
  }
}

// Load face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo);

// Detect emotions and recommend music
video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.appendChild(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const topEmotion = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0][0];
      emotionText.textContent = `Detected Emotion: ${topEmotion}`;

      const musicMap = {
        happy: "https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB",     // Happy
        sad: "https://open.spotify.com/track/2RlgNHKcydI9sayD2Df2xp",       // Someone Like You
        angry: "https://open.spotify.com/track/4VqPOruhp5EdPBeR92t6lQ",     // Lose Yourself
        surprised: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5", // Feel It Still
        disgusted: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",           // Rickroll
        fearful: "https://open.spotify.com/track/6naxalmIoLFWR0siv8dnQQ",  // Creep
        neutral: "https://open.spotify.com/track/5HCyWlXZPP0y6Gqq8TgA20"    // Let It Be
      };

      const url = musicMap[topEmotion] || "#";
      songLink.innerHTML = `<a href="${url}" target="_blank">🎶 Play Song</a>`;
    } else {
      emotionText.textContent = "No face detected.";
      songLink.textContent = "";
    }
  }, 2000);
});
