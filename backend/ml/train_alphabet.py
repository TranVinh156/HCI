"""
Train an ASL alphabet (A-Z) classifier using MobileNetV2 transfer learning.

Dataset:
  ASL Alphabet (Akash) — https://www.kaggle.com/datasets/grassknoted/asl-alphabet
  Expected layout under DATA_DIR:
    asl_alphabet_train/
      A/  *.jpg
      B/  *.jpg
      ...
      Z/  *.jpg
      del/  space/  nothing/   (these three are skipped by default)

Usage:
  python -m ml.train_alphabet --data-dir D:/datasets/asl_alphabet_train --epochs 5

Outputs:
  ml/models/alphabet_model.h5
  ml/models/alphabet_labels.json
"""
from __future__ import annotations

import argparse
import json
import string
from pathlib import Path

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = 224
BATCH_SIZE = 32
MODELS_DIR = Path(__file__).resolve().parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

ALPHABET_CLASSES = list(string.ascii_uppercase)  # A..Z


def build_dataset(data_dir: Path, val_split: float = 0.2):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="training",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_names=ALPHABET_CLASSES,
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="validation",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_names=ALPHABET_CLASSES,
    )

    augment = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
    ])

    train_ds = train_ds.map(lambda x, y: (augment(preprocess_input(x)), y)).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y)).prefetch(tf.data.AUTOTUNE)
    return train_ds, val_ds


def build_model(num_classes: int) -> tf.keras.Model:
    base = MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights="imagenet")
    base.trainable = False

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True, help="Path to asl_alphabet_train folder")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--fine-tune-epochs", type=int, default=3, help="Epochs to fine-tune base model after head training")
    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    assert data_dir.exists(), f"Data dir not found: {data_dir}"

    print(f"[1/4] Loading dataset from {data_dir}")
    train_ds, val_ds = build_dataset(data_dir)

    print(f"[2/4] Building MobileNetV2 model ({len(ALPHABET_CLASSES)} classes)")
    model = build_model(len(ALPHABET_CLASSES))

    print(f"[3/4] Training head for {args.epochs} epochs")
    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs)

    if args.fine_tune_epochs > 0:
        print(f"[3b] Fine-tuning base model for {args.fine_tune_epochs} epochs")
        model.layers[1].trainable = True  # unfreeze MobileNetV2
        model.compile(
            optimizer=tf.keras.optimizers.Adam(1e-5),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )
        model.fit(train_ds, validation_data=val_ds, epochs=args.fine_tune_epochs)

    print("[4/4] Saving model")
    model.save(MODELS_DIR / "alphabet_model.h5")
    (MODELS_DIR / "alphabet_labels.json").write_text(json.dumps(ALPHABET_CLASSES), encoding="utf-8")
    print(f"Saved to {MODELS_DIR}")


if __name__ == "__main__":
    main()
