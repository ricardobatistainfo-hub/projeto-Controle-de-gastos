// Recebe o áudio gravado no app, manda transcrever no Groq (Whisper) e devolve
// só o texto — a chave da API fica aqui, nunca chega ao navegador.
export const config = {
  regions: ['fra1'],
  maxDuration: 15
};

const TAMANHO_MAXIMO = 8 * 1024 * 1024; // 8MB é bem mais que suficiente para uma frase falada

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json({ erro: 'GROQ_API_KEY não configurada no servidor' }, 500);
  }

  const contentType = request.headers.get('content-type') || 'audio/mp4';
  let buffer;
  try {
    buffer = await request.arrayBuffer();
  } catch (err) {
    return json({ erro: 'não foi possível ler o áudio enviado' }, 400);
  }

  if (!buffer || buffer.byteLength === 0) {
    return json({ erro: 'áudio vazio' }, 400);
  }
  if (buffer.byteLength > TAMANHO_MAXIMO) {
    return json({ erro: 'áudio grande demais' }, 413);
  }

  const ext = contentType.includes('webm') ? 'webm'
    : contentType.includes('aac') ? 'aac'
    : contentType.includes('wav') ? 'wav'
    : 'm4a';

  const idioma = new URL(request.url).searchParams.get('lang') || 'pt';

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: contentType }), `gravacao.${ext}`);
  form.append('model', 'whisper-large-v3-turbo');
  form.append('language', idioma);
  form.append('response_format', 'json');

  let resposta;
  try {
    resposta = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });
  } catch (err) {
    return json({ erro: 'falha ao contactar o serviço de transcrição' }, 502);
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    return json({ erro: dados?.error?.message || 'falha na transcrição' }, resposta.status);
  }

  return json({ texto: dados.text || '' }, 200);
}

function json(corpo, status) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
