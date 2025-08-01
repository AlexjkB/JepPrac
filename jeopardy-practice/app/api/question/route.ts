export async function GET(req: Request) {

    const apiUrl = process.env.RANDOM_API;
    const response = await fetch(`${apiUrl}`);

    if (!response.ok) {
        return new Response("Failed to fetch from question API", { status: 500 });
    }

    const data = await response.json();

    return Response.json(data);
}