interface WikiPage {
  pageid: number;
  ns: number;
  title: string;
  extract?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  [key: string]: unknown;
}

async function resolveCanonicalTitle(title: string, email: string): Promise<string> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": `TriviaPracticeTool/1.0 (${email})`,
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();
  const pages = data?.query?.pages || {};
  const firstPage = Object.values(pages)[0] as WikiPage;
  return firstPage?.title || title;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") || "";

  const email = process.env.EMAIL ?? "default@example.com";

  const canonicalTitle = await resolveCanonicalTitle(rawTitle, email);

  const apiUrl = `https://en.wikipedia.org/w/api.php` +
    `?action=query` +
    `&format=json` +
    `&prop=pageimages|extracts` + 
    `&pithumbsize=400` +
    `&exintro&explaintext` +
    `&titles=${encodeURIComponent(canonicalTitle)}`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": `TriviaPracticeTool/1.0 (${email})`,
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return new Response("Failed to fetch from Wikipedia", { status: 500 });
  }

  const data = await res.json();
  const pages = data?.query?.pages || {};
  const firstPage = Object.values(pages)[0] as WikiPage;

  return Response.json({
    normalizedTitle: canonicalTitle,
    thumbnailUrl: firstPage?.thumbnail?.source || null,
    extract: firstPage?.extract || "",
  });
}

