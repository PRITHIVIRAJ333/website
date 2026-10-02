from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import librosa
import tensorflow as tf

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
MODEL_PATH = "model/emotion_model.h5"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

EMOTIONS = [
    "angry",
    "calm",
    "disgust",
    "fearful",
    "happy",
    "neutral",
    "sad",
    "surprised"
]

model = None

if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)


def extract_features(file_path):

    audio, sample_rate = librosa.load(
        file_path,
        duration=3,
        offset=0.5
    )

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sample_rate,
        n_mfcc=40
    )

    target_length = 130

    if mfcc.shape[1] < target_length:

        pad_width = target_length - mfcc.shape[1]

        mfcc = np.pad(
            mfcc,
            ((0, 0), (0, pad_width)),
            mode="constant"
        )

    else:

        mfcc = mfcc[:, :target_length]

    return mfcc.astype(np.float32)


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    global model

    if model is None:

        return jsonify({
            "success": False,
            "message": "Model not found. Please train the model first."
        }), 400

    if "audio" not in request.files:

        return jsonify({
            "success": False,
            "message": "Please select an audio file."
        }), 400

    file = request.files["audio"]

    if file.filename == "":

        return jsonify({
            "success": False,
            "message": "Please select an audio file."
        }), 400

    allowed = {
        ".wav",
        ".mp3",
        ".ogg",
        ".m4a",
        ".flac"
    }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in allowed:

        return jsonify({
            "success": False,
            "message": "Please upload a WAV, MP3, OGG, M4A, or FLAC audio file."
        }), 400

    file_path = os.path.join(
        UPLOAD_FOLDER,
        "uploaded_audio" + extension
    )

    file.save(file_path)

    try:

        features = extract_features(file_path)

        features = np.expand_dims(
            features,
            axis=0
        )

        features = np.expand_dims(
            features,
            axis=-1
        )

        prediction = model.predict(
            features,
            verbose=0
        )[0]

        index = int(
            np.argmax(prediction)
        )

        emotion = EMOTIONS[index]

        confidence = float(
            prediction[index] * 100
        )

        return jsonify({
            "success": True,
            "emotion": emotion,
            "confidence": round(
                confidence,
                2
            )
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to process the audio file: " + str(e)
        }), 500


if __name__ == "__main__":

    app.run(debug=True)