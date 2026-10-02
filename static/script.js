const audioFile =
    document.getElementById("audioFile");

const chooseBtn =
    document.getElementById("chooseBtn");

const fileName =
    document.getElementById("fileName");

const audioPlayer =
    document.getElementById("audioPlayer");

const predictBtn =
    document.getElementById("predictBtn");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const result =
    document.getElementById("result");

const emotionEmoji =
    document.getElementById("emotionEmoji");

const emotionText =
    document.getElementById("emotionText");

const confidenceText =
    document.getElementById("confidenceText");

const progressBar =
    document.getElementById("progressBar");


const emotionIcons = {

    angry: "😠",

    calm: "😌",

    disgust: "🤢",

    fearful: "😨",

    happy: "😊",

    neutral: "😐",

    sad: "😢",

    surprised: "😲"

};


chooseBtn.addEventListener(
    "click",
    () => {

        audioFile.click();

    }
);


audioFile.addEventListener(
    "change",
    () => {

        message.textContent = "";

        result.hidden = true;

        const file =
            audioFile.files[0];

        if (!file) {

            fileName.textContent =
                "No file selected";

            audioPlayer.hidden = true;

            return;
        }

        fileName.textContent =
            "Selected: " + file.name;

        const audioURL =
            URL.createObjectURL(file);

        audioPlayer.src =
            audioURL;

        audioPlayer.hidden = false;

    }
);


predictBtn.addEventListener(
    "click",
    async () => {

        message.textContent = "";

        result.hidden = true;


        if (!audioFile.files.length) {

            message.textContent =
                "⚠️ Please select an audio file first.";

            return;

        }


        const formData =
            new FormData();

        formData.append(
            "audio",
            audioFile.files[0]
        );


        predictBtn.disabled = true;

        loading.hidden = false;


        try {

            const response =
                await fetch(
                    "/predict",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                message.textContent =
                    "❌ " + data.message;

                return;

            }


            const emotion =
                data.emotion.toLowerCase();


            const confidence =
                Number(data.confidence);


            emotionEmoji.textContent =
                emotionIcons[emotion] ||
                "🎙️";


            emotionText.textContent =
                emotion.toUpperCase();


            confidenceText.textContent =
                confidence.toFixed(2) + "%";


            progressBar.style.width =
                Math.min(
                    confidence,
                    100
                ) + "%";


            result.hidden = false;

        }


        catch (error) {

            message.textContent =
                "❌ Server error. Please make sure the Flask application is running.";

        }


        finally {

            predictBtn.disabled = false;

            loading.hidden = true;

        }

    }
);