import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const classParam = searchParams.get('class');

    const baseUrl = process.env.RANDOM_API?.replace('/random', '');
    const randomUrl = process.env.RANDOM_API || '';

    if (classParam) {
        // Use classified endpoint when a class filter is specified
        const classifiedUrl = `${baseUrl}/classified?class=${encodeURIComponent(classParam)}`;
        console.log('Fetching from classified:', classifiedUrl);

        try {
            const response = await fetch(classifiedUrl);

            if (!response.ok) {
                console.warn('Classified endpoint failed, falling back to random:', response.status);
                return await fetchFromUrl(randomUrl);
            }

            const data = await response.json();
            console.log('Classified API returned data with fields:', Object.keys(data));

            // Check if data is valid (has required fields)
            if (!data.clue_question || !data.clue_answer) {
                console.warn('Classified returned invalid data, falling back to random');
                return await fetchFromUrl(randomUrl);
            }

            return Response.json(data);
        } catch (error) {
            console.error('Classified endpoint error, falling back to random:', error);
            return await fetchFromUrl(randomUrl);
        }
    } else {
        // Use random endpoint for unfiltered questions
        return await fetchFromUrl(randomUrl);
    }
}

async function fetchFromUrl(url: string) {
    console.log('Fetching from:', url);
    const response = await fetch(url);

    if (!response.ok) {
        console.error('API request failed:', response.status, response.statusText);
        return new Response("Failed to fetch from question API", { status: 500 });
    }

    const data = await response.json();
    console.log('API returned data with fields:', Object.keys(data));

    return Response.json(data);
}