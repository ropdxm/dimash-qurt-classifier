# Qurt vs Dimash Classifier Website

A full-stack project for your classifier:

- **Frontend:** Next.js + React + Tailwind CSS
- **Backend:** FastAPI + fastai
- **Inference:** upload an image and get the predicted class with probabilities

## Project structure

```text
qurt-dimash-site/
├── frontend/   # Next.js marketing page + upload UI
└── backend/    # FastAPI inference server that loads your exported .pkl model
```

## 1) Put your model in the backend

Export your fastai model and copy it here:

```text
backend/models/dimash_qurt_classifier2.pkl
```

The backend is already configured to look for that file by default.

If you want to use your 3-class model later, you can either:

- replace the file with that model, or
- change `MODEL_PATH` in `backend/.env.example`

## 2) Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## 3) Run the frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The website will be available at `http://localhost:3000`.

## Notes

- The Next.js app proxies uploads through `app/api/classify/route.ts`, then forwards them to the Python backend.
- The FastAPI server uses `load_learner(...)` to load your exported fastai model.
- Only load `.pkl` files that you trust.
- If you used any custom Python code when training/exporting the learner, import that same code in the backend before calling `load_learner(...)`.
- If inference fails after export, make sure the backend uses a fastai version compatible with the environment you trained and exported the model in.
