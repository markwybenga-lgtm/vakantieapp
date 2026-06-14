// Vercel serverless functie: roept veilig de Claude API aan.
// De sleutel staat in een omgevingsvariabele (ANTHROPIC_API_KEY) op Vercel,
// dus nooit in de app of in GitHub. Zie README, "AI-planner".

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Alleen POST' });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY ontbreekt op de server' });
    return;
  }

  try {
    const { place, dateLabel, weather, activities } = req.body || {};
    const list = (activities || []).map(a =>
      `- ${a.title} (${a.cat}${a.votes ? `, ${a.votes} stemmen` : ''})`).join('\n');
    const wx = weather
      ? `Het weer voor ${dateLabel}: maximaal ${weather.max}°, minimaal ${weather.min}°, ${weather.desc}.`
      : 'Het weer is nog onbekend.';

    const prompt =
`Je bent een behulpzame reisplanner voor een Nederlands gezin (met kinderen en opa en oma) op vakantie in Italië. Ze verblijven nu bij: ${place}.
${wx}
Activiteiten op hun lijstje (met aantal stemmen):
${list || '- (nog geen activiteiten gekozen)'}

Geef een kort, warm advies in het Nederlands (2 à 4 zinnen) voor wat ze ${dateLabel} het beste kunnen doen, rekening houdend met het weer. Noem één concrete activiteit uit de lijst die bij het weer past en leg in een korte bijzin uit waarom. Schrijf losjes en persoonlijk, zonder aanhef en zonder opsomming.`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 350,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await r.json();
    const text = (data && data.content && data.content[0] && data.content[0].text) || '';
    if (!text) {
      res.status(502).json({ error: 'Geen antwoord van Claude', detail: data && data.error ? data.error : null });
      return;
    }
    res.status(200).json({ advice: text });
  } catch (e) {
    res.status(500).json({ error: 'Aanroep mislukt' });
  }
}
