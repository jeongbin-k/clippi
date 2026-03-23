import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RSS_SOURCES = [
  // 개발
  { url: 'https://techblog.woowahan.com/feed', source: '우아한형제들', category: '개발' },
  { url: 'https://kakao.github.io/feed.xml', source: '카카오', category: '개발' },
  { url: 'https://toss.tech/rss.xml', source: '토스', category: '개발' },
  { url: 'https://medium.com/feed/daangn', source: '당근', category: '개발' },
  { url: 'https://d2.naver.com/d2.atom', source: '네이버 D2', category: '개발' },
  { url: 'https://engineering.linecorp.com/ko/feed', source: '라인', category: '개발' },
  // IT뉴스
  { url: 'https://techneedle.com/feed', source: '테크니들', category: 'IT뉴스' },
  { url: 'https://news.hada.io/rss', source: '긱뉴스', category: 'IT뉴스' },
  { url: 'https://yozm.wishket.com/magazine/feed/', source: '요즘IT', category: 'IT뉴스' },
  // 비즈니스
  { url: 'https://www.venturesquare.net/feed', source: '벤처스퀘어', category: '비즈니스' },
  { url: 'https://platum.kr/feed', source: 'Platum', category: '비즈니스' },
]

// og:image 파싱 함수
async function fetchOgImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000), // 5초 타임아웃
    })
    const html = await res.text()
    const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"|<meta[^>]+content="([^"]+)"[^>]+property="og:image"/)
    return match?.[1] ?? match?.[2] ?? ''
  } catch {
    return ''
  }
}

async function parseRSS(url: string) {
  try {
    const res = await fetch(url)
    const xml = await res.text()

    const items: { title: string; url: string; description: string; thumbnail: string; published_at: string }[] = []

    // RSS <item> 파싱
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)
    for (const match of itemMatches) {
      const item = match[1]
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s)?.[1] ?? item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s)?.[2] ?? ''
      const link = item.match(/<link>(.*?)<\/link>/s)?.[1] ?? ''
      const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s)?.[1]?.replace(/<[^>]+>/g, '').slice(0, 200) ?? ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1] ?? ''
      const thumbnail = item.match(/<media:thumbnail[^>]+url="([^"]+)"|<enclosure[^>]+url="([^"]+)"/)?.[1] ?? ''

      if (title && link) {
        items.push({
          title: title.trim(),
          url: link.trim(),
          description: desc.trim(),
          thumbnail: thumbnail.trim(),
          published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        })
      }
    }

    // Atom <entry> 파싱
    const entryMatches = xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)
    for (const match of entryMatches) {
      const entry = match[1]
      const title = entry.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/s)?.[1] ?? entry.match(/<title[^>]*>(.*?)<\/title>/s)?.[1] ?? ''
      const link = entry.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? entry.match(/<link>(.*?)<\/link>/s)?.[1] ?? ''
      const desc = entry.match(/<summary[^>]*>(.*?)<\/summary>|<content[^>]*>(.*?)<\/content>/s)?.[1]?.replace(/<[^>]+>/g, '').slice(0, 200) ?? ''
      const pubDate = entry.match(/<published>(.*?)<\/published>|<updated>(.*?)<\/updated>/s)?.[1] ?? ''
      const thumbnail = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ?? ''

      if (title && link) {
        items.push({
          title: title.trim(),
          url: link.trim(),
          description: desc.trim(),
          thumbnail: thumbnail.trim(),
          published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        })
      }
    }

    return items.slice(0, 10)
  } catch (e) {
    console.error(`RSS 파싱 실패: ${url}`, e)
    return []
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let totalInserted = 0

  for (const source of RSS_SOURCES) {
    const items = await parseRSS(source.url)

    // og:image 병렬 처리
    const itemsWithThumbnails = await Promise.all(
      items.map(async (item) => {
        let thumbnail = item.thumbnail
        if (!thumbnail && item.url) {
          thumbnail = await fetchOgImage(item.url)
        }
        return { ...item, thumbnail }
      })
    )

    // DB 저장도 병렬 처리
    await Promise.all(
      itemsWithThumbnails.map(async (item) => {
        const { error } = await supabase
          .from('articles')
          .upsert(
            { ...item, source: source.source, category: source.category },
            { onConflict: 'url' }
          )
        if (!error) totalInserted++
      })
    )
  }

  return new Response(
    JSON.stringify({ success: true, inserted: totalInserted }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})