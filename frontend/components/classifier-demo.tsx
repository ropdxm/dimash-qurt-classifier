'use client';

import { useMemo, useState } from 'react';
import { ImagePlus, LoaderCircle, Sparkles, Trash2, Upload } from 'lucide-react';

type PredictionResponse = {
  label: string;
  raw_label?: string;
  confidence: number;
  probabilities: Record<string, number>;
};

const prettyLabel = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized === 'qurt') return 'Qurt';
  if (normalized === 'dimash') return 'Dimash Kudaibergen';
  if (normalized === 'neither') return 'Neither';
  return label;
};

export default function ClassifierDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const resetAll = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as PredictionResponse | { error?: string };

      if (!response.ok || 'error' in data) {
        throw new Error((data as { error?: string }).error ?? 'Classification failed.');
      }

      setResult(data as PredictionResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-200/75">Live demo</p>
            <h3 className="text-2xl font-semibold text-white">Upload a photo for prediction</h3>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-slate-950/40 p-8 text-center transition hover:border-indigo-300/60 hover:bg-slate-900/60">
            <div className="mb-4 rounded-full bg-indigo-500/15 p-4 text-indigo-200">
              <ImagePlus className="h-7 w-7" />
            </div>
            <p className="text-lg font-medium text-white">Choose an image</p>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              JPG, PNG, or WEBP. The backend will send your image to the fastai model and return the most likely class.
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const nextFile = e.target.files?.[0] ?? null;
                setFile(nextFile);
                setResult(null);
                setError(null);
              }}
            />
          </label>

          {file ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </button>
              </div>

              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-72 w-full rounded-2xl object-cover ring-1 ring-white/10"
                />
              ) : null}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || !file}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-500 px-5 py-4 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/40"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Classifying image...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Run classifier
              </>
            )}
          </button>
        </form>

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-200/75">Prediction</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Model output</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The app displays the top predicted class, its confidence score, and the full class distribution returned by the model.
          </p>
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/20 via-slate-900/70 to-emerald-500/10 p-5 ring-1 ring-white/10">
              <p className="text-sm text-slate-300">Predicted class</p>
              <h4 className="mt-2 text-3xl font-bold text-white">{prettyLabel(result.label)}</h4>
              <p className="mt-2 text-sm text-slate-300">
                Confidence: <span className="font-semibold text-white">{(result.confidence * 100).toFixed(2)}%</span>
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(result.probabilities)
                .sort((a, b) => b[1] - a[1])
                .map(([label, probability]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-100">{prettyLabel(label)}</span>
                      <span className="text-slate-300">{(probability * 100).toFixed(2)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-300"
                        style={{ width: `${Math.max(4, probability * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-8 text-center">
            <div className="mb-4 rounded-full bg-white/5 p-4 text-slate-200">
              <Sparkles className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-semibold text-white">Ready for inference</h4>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              Upload a photo on the left and the result will appear here instantly after the backend finishes inference.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
