import os
import pandas as pd

AUDIO_FOLDER = "dataset/audio"

emotion_map = {
    "01": "neutral",
    "02": "calm",
    "03": "happy",
    "04": "sad",
    "05": "angry",
    "06": "fearful",
    "07": "disgust",
    "08": "surprised"
}

data = []

for root, dirs, files in os.walk(AUDIO_FOLDER):

    for file in files:

        if file.lower().endswith(".wav"):

            parts = file.split("-")

            if len(parts) >= 3:

                emotion_code = parts[2]

                if emotion_code in emotion_map:

                    filepath = os.path.join(
                        root,
                        file
                    ).replace("\\", "/")

                    emotion = emotion_map[emotion_code]

                    data.append([
                        filepath,
                        emotion
                    ])

df = pd.DataFrame(
    data,
    columns=["filepath", "emotion"]
)

df.to_csv(
    "dataset/emotion_dataset.csv",
    index=False
)

print("CSV created successfully!")
print("Total audio files:", len(df))
print()
print(df.head())