import os
import numpy as np
import pandas as pd
import librosa
import tensorflow as tf

from sklearn.model_selection import train_test_split

from tensorflow.keras import Sequential

from tensorflow.keras.layers import (
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout
)

from tensorflow.keras.callbacks import EarlyStopping


CSV_PATH = "dataset/emotion_dataset.csv"

MODEL_PATH = "model/emotion_model.h5"


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


TARGET_LENGTH = 130

N_MFCC = 40


def extract_features(file_path):

    audio, sample_rate = librosa.load(
        file_path,
        duration=3,
        offset=0.5
    )

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sample_rate,
        n_mfcc=N_MFCC
    )

    if mfcc.shape[1] < TARGET_LENGTH:

        pad_width = TARGET_LENGTH - mfcc.shape[1]

        mfcc = np.pad(
            mfcc,
            ((0, 0), (0, pad_width)),
            mode="constant"
        )

    else:

        mfcc = mfcc[:, :TARGET_LENGTH]

    return mfcc


print()
print("==============================")
print(" SPEECH EMOTION MODEL TRAINING")
print("==============================")
print()


if not os.path.exists(CSV_PATH):

    print("CSV file not found!")

    raise SystemExit


df = pd.read_csv(CSV_PATH)


if not {"filepath", "emotion"}.issubset(df.columns):

    print("CSV must contain:")
    print("filepath, emotion")

    raise SystemExit


X = []

y = []


print("Audio features extract pannitu iruken...")
print()


for _, row in df.iterrows():

    file_path = str(
        row["filepath"]
    )

    emotion = str(
        row["emotion"]
    ).lower().strip()


    if not os.path.exists(file_path):

        print(
            "SKIPPED - file not found:",
            file_path
        )

        continue


    if emotion not in EMOTIONS:

        print(
            "SKIPPED - invalid emotion:",
            emotion
        )

        continue


    try:

        feature = extract_features(
            file_path
        )

        X.append(feature)

        y.append(
            EMOTIONS.index(emotion)
        )

        print(
            "OK:",
            file_path,
            "->",
            emotion
        )

    except Exception as e:

        print(
            "SKIPPED:",
            file_path,
            e
        )


if len(X) < 16:

    print()
    print("Not enough audio files!")
    print()
    print("Minimum 16 audio files venum.")
    print("Better accuracy-ku more audio samples use pannunga.")

    raise SystemExit


X = np.array(
    X,
    dtype=np.float32
)

y = np.array(y)


X = X[..., np.newaxis]


X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.20,

    random_state=42,

    stratify=y
)


model = Sequential([

    Conv2D(
        32,
        (3, 3),
        activation="relu",
        input_shape=(40, 130, 1)
    ),

    MaxPooling2D(
        (2, 2)
    ),


    Conv2D(
        64,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        (2, 2)
    ),


    Conv2D(
        128,
        (3, 3),
        activation="relu"
    ),

    MaxPooling2D(
        (2, 2)
    ),


    Flatten(),


    Dense(
        128,
        activation="relu"
    ),

    Dropout(
        0.4
    ),


    Dense(
        len(EMOTIONS),
        activation="softmax"
    )

])


model.compile(

    optimizer="adam",

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]

)


model.summary()


early_stop = EarlyStopping(

    monitor="val_loss",

    patience=5,

    restore_best_weights=True

)


print()
print("Training start aaguthu...")
print()


model.fit(

    X_train,

    y_train,

    validation_data=(
        X_test,
        y_test
    ),

    epochs=30,

    batch_size=16,

    callbacks=[
        early_stop
    ]

)


loss, accuracy = model.evaluate(

    X_test,

    y_test,

    verbose=0

)


print()
print("==============================")
print(" MODEL TRAINING COMPLETED")
print("==============================")

print(
    f"Test Accuracy: {accuracy * 100:.2f}%"
)


os.makedirs(
    "model",
    exist_ok=True
)


model.save(
    MODEL_PATH
)


print()
print("Model saved:")
print(
    MODEL_PATH
)

print()
print("Website start panna:")
print(
    "python app.py"
)