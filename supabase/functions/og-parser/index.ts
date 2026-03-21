const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url).searchParams.get('url')

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL이 필요해요' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000),
    })

    const html = await res.text()

    const getMetaContent = (property: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"`)) ||
        html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+property="${property}"`)) ||
        html.match(new RegExp(`<meta[^>]+name="${property}"[^>]+content="([^"]+)"`))
      return match?.[1] ?? ''
    }

    const title =
      getMetaContent('og:title') ||
      html.match(/<title>(.*?)<\/title>/)?.[1] ||
      ''

    const description =
      getMetaContent('og:description') ||
      getMetaContent('description') ||
      ''

    const thumbnail = getMetaContent('og:image') || ''

    return new Response(
      JSON.stringify({ title, description, thumbnail }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: '파싱 실패', title: '', description: '', thumbnail: '' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})