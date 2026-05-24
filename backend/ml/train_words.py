"""
Train a static-keyframe ASL word classifier using MobileNetV2 transfer learning.

Dataset format:
  DATA_DIR/
    hello/        *.jpg   (keyframes of the sign)
    thank-you/    *.jpg
    mother/       *.jpg
    ...

Sources to consider:
  - WLASL keyframes (https://dxli94.github.io/WLASL/)
  - Recording your own keyframes per word (recommended for HCI demo)

Usage:
  python -m ml.train_words --data-dir D:/datasets/asl_words --epochs 10

Outputs:
  ml/models/word_model.h5
  ml/models/word_labels.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = 224
BATCH_SIZE = 16
MODELS_DIR = Path(__file__).resolve().parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def discover_classes(data_dir: Path) -> list[str]:
    return sorted([p.name for p in data_dir.iterdir() if p.is_dir()])


def build_dataset(data_dir: Path, classes: list[str], val_split: float = 0.2):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="training",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_names=classes,
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="validation",
        seed=42,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_names=classes,
    )

    augment = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
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
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
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
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--fine-tune-epochs", type=int, default=5)
    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    assert data_dir.exists(), f"Data dir not found: {data_dir}"

    classes = discover_classes(data_dir)
    assert len(classes) >= 2, f"Need at least 2 word classes, found: {classes}"
    print(f"[1/4] Discovered {len(classes)} classes: {classes}")

    train_ds, val_ds = build_dataset(data_dir, classes)

    print(f"[2/4] Building model")
    model = build_model(len(classes))

    print(f"[3/4] Training head for {args.epochs} epochs")
    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs)

    if args.fine_tune_epochs > 0:
        print(f"[3b] Fine-tuning base for {args.fine_tune_epochs} epochs")
        model.layers[1].trainable = True
        model.compile(
            optimizer=tf.keras.optimizers.Adam(1e-5),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"],
        )
        model.fit(train_ds, validation_data=val_ds, epochs=args.fine_tune_epochs)

    print("[4/4] Saving")
    model.save(MODELS_DIR / "word_model.h5")
    (MODELS_DIR / "word_labels.json").write_text(json.dumps(classes), encoding="utf-8")
    print(f"Saved to {MODELS_DIR}")


if __name__ == "__main__":
    main()
