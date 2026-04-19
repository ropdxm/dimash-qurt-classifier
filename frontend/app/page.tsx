import Link from 'next/link';
import { BrainCircuit, Camera, ChefHat, Github, Layers3, ShieldCheck } from 'lucide-react';
import ClassifierDemo from '@/components/classifier-demo';

const features = [
  {
    icon: BrainCircuit,
    title: 'fastai-powered inference',
    description:
      'Your trained image classifier sits behind a Python API and returns the predicted class plus full probabilities.',
  },
  {
    icon: Camera,
    title: 'Single-page upload flow',
    description:
      'Visitors can learn about the project first, then scroll down and test the model on the same page.',
  },
  {
    icon: Layers3,
    title: 'Next.js + Tailwind architecture',
    description:
      'A clean App Router frontend handles the landing page, upload form, and proxy route for the backend.',
  },
];

const useCases = [
  {
    icon: ChefHat,
    title: 'Qurt recognition',
    text: 'Useful when you want to showcase how the model distinguishes a traditional food object from celebrity portraits.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidence display',
    text: 'Users do not just see a label — they also see how confident the model is and the full score distribution.',
  },
  {
    icon: Github,
    title: 'Portfolio-ready demo',
    text: 'The page explains the project clearly, which makes it much better for clients, recruiters, and presentations.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-8 md:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/80">Dimash × Qurt Classifier</p>
              <h1 className="mt-2 text-xl font-semibold text-white md:text-2xl">A playful computer vision project built with fastai</h1>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#about" className="transition hover:text-white">
                About
              </a>
              <a href="#how-it-works" className="transition hover:text-white">
                How it works
              </a>
              <a href="#demo" className="transition hover:text-white">
                Demo
              </a>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-indigo-300/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100">
                Next.js frontend • FastAPI backend • fastai model
              </div>
              <h2 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Upload an image and find out whether it is <span className="text-indigo-300">Qurt</span> or{' '}
                <span className="text-emerald-300">Dimash Kudaibergen</span>.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                This website turns your trained classifier into a clean public-facing product: a proper landing page at the top,
                and a live prediction demo lower on the same page.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Try the live demo
                </a>
                <Link
                  href="https://github.com/ropdxm/dimash-qurt-classifier"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  View repository
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/50 p-5 ring-1 ring-white/10">
                  <p className="text-sm text-slate-400">Project type</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Image classification</p>
                </div>
                <div className="rounded-3xl bg-slate-950/50 p-5 ring-1 ring-white/10">
                  <p className="text-sm text-slate-400">Frontend stack</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Next.js + Tailwind</p>
                </div>
                <div className="rounded-3xl bg-slate-950/50 p-5 ring-1 ring-white/10 sm:col-span-2">
                  <p className="text-sm text-slate-400">What the page does</p>
                  <p className="mt-3 text-lg leading-7 text-slate-200">
                    Explains the idea, presents the model clearly, and lets a visitor test an uploaded image without leaving the landing page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-y border-white/10 bg-black/10">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/75">About the project</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">A fun concept, presented like a real product</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Instead of keeping the classifier inside a notebook, this site wraps it in a polished interface that explains the idea,
              shows the stack, and gives people an easy way to try the model themselves.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-indigo-500/15 p-3 text-indigo-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/75">How it works</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">One landing page, one smooth journey</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                The visitor first understands the story, then uploads an image below, and finally receives the model output directly on the same page.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {useCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                    <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/15 p-3 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="scroll-mt-24 pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/75">Demo section</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">Test the classifier with your own image</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Upload a photo and the site will send it to your fastai backend, then render the predicted label and class probabilities on-screen.
            </p>
          </div>

          <ClassifierDemo />
        </div>
      </section>
    </main>
  );
}
