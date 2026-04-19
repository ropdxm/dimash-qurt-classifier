from __future__ import annotations

import os
import shutil
import tempfile
from functools import lru_cache
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import PILImage, load_learner

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(os.getenv('MODEL_PATH', BASE_DIR / 'models' / 'dimash_qurt_classifier2.pkl')).resolve()
CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', '0'))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
    if origin.strip()
]

app = FastAPI(
    title='Qurt vs Dimash Classifier API',
    description='Loads a fastai exported model and returns predictions for uploaded images.',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@lru_cache(maxsize=1)
def get_learner() -> Any:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f'Model file not found at {MODEL_PATH}. Export your fastai model and place it in backend/models/.'
        )

    # Only load model files you trust.
    return load_learner(MODEL_PATH, cpu=True)


@app.get('/ping')
def ping() -> dict[str, str]:
    return {'status': 'ok'}


@app.get('/health')
def health() -> dict[str, Any]:
    try:
        learner = get_learner()
        return {
            'status': 'ok',
            'model_loaded': True,
            'model_path': str(MODEL_PATH),
            'labels': [str(label) for label in learner.dls.vocab],
        }
    except Exception as exc:  # pragma: no cover - useful for local debugging
        return {
            'status': 'error',
            'model_loaded': False,
            'model_path': str(MODEL_PATH),
            'detail': str(exc),
        }


@app.post('/predict')
async def predict(file: UploadFile = File(...)) -> dict[str, Any]:
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='Please upload a valid image file.')

    suffix = Path(file.filename or 'upload.jpg').suffix or '.jpg'
    temp_path: Path | None = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            file.file.seek(0)
            shutil.copyfileobj(file.file, temp_file)
            temp_path = Path(temp_file.name)

        learner = get_learner()
        image = PILImage.create(temp_path)
        pred, pred_idx, probs = learner.predict(image)

        labels = [str(label) for label in learner.dls.vocab]
        probabilities = [float(prob) for prob in probs]
        pred_idx_int = int(pred_idx)
        raw_label = str(pred)
        top_confidence = probabilities[pred_idx_int]
        final_label = raw_label

        if CONFIDENCE_THRESHOLD > 0 and top_confidence < CONFIDENCE_THRESHOLD and 'neither' in labels:
            final_label = 'neither'

        return {
            'label': final_label,
            'raw_label': raw_label,
            'confidence': top_confidence,
            'probabilities': {labels[i]: probabilities[i] for i in range(len(labels))},
        }
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Prediction failed: {exc}') from exc
    finally:
        await file.close()
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)
