export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getBackendUrl = () => process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return Response.json({ error: 'No image file was provided.' }, { status: 400 });
    }

    const backendForm = new FormData();
    backendForm.append('file', image, image.name);

    const response = await fetch(`${getBackendUrl()}/predict`, {
      method: 'POST',
      body: backendForm,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data?.detail ?? data?.error ?? 'Backend classification failed.' },
        { status: response.status },
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected server error.',
      },
      { status: 500 },
    );
  }
}
