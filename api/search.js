export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q, lat, lng } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'q is required' });
  }

  try {
    const params = new URLSearchParams({
      q,
      format: 'json',
      limit: '10',
      countrycodes: 'sy',
      'accept-language': 'ar',
      addressdetails: '1',
    });

    if (lat && lng) {
      const latF = parseFloat(lat);
      const lngF = parseFloat(lng);
      params.set('viewbox', `${lngF - 1.5},${latF - 1.5},${lngF + 1.5},${latF + 1.5}`);
      params.set('bounded', '0');
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'User-Agent': 'SyriaDeliveryApp/1.0' } }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
