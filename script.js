const video = document.getElementById('camera');
const objectName = document.getElementById('object-name');

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    video.play();
}

async function loadModel() {
    const model = await cocoSsd.load();
    detectFrame(model);
}

async function detectFrame(model) {
    const predictions = await model.detect(video);
    if (predictions.length > 0) {
        objectName.textContent = predictions[0].class;
        const utterance = new SpeechSynthesisUtterance(predictions[0].class);
        speechSynthesis.speak(utterance);
    } else {
        objectName.textContent = 'No object detected';
    }
    requestAnimationFrame(() => detectFrame(model));
}

setupCamera().then(loadModel);
