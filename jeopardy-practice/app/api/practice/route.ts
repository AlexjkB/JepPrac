import { NextRequest } from 'next/server';
import { getCategoryAPIParams } from '@/lib/category-mapping';

const BASE_URL = "https://jeopardy-golang-api.onrender.com";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoriesParam = searchParams.get('categories');
  const lastCategory = searchParams.get('lastCategory');

  if (!categoriesParam) {
    return new Response("No categories provided", { status: 400 });
  }

  const categories = categoriesParam.split(',').map(c => c.trim());

  if (categories.length === 0) {
    return new Response("No categories provided", { status: 400 });
  }

  // Select category (avoid repeating last category if multiple available)
  let selectedCategory: string;
  if (categories.length > 1 && lastCategory) {
    const availableCategories = categories.filter(c => c !== lastCategory);
    selectedCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  } else {
    selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  }

  // Get API endpoint parameters for this category
  const apiParams = getCategoryAPIParams(selectedCategory);

  // Try primary endpoint (classified or custom based on mapping)
  let apiUrl: string;
  if (apiParams.type === 'classified') {
    apiUrl = `${BASE_URL}/classified?class=${encodeURIComponent(apiParams.param)}`;
  } else {
    apiUrl = `${BASE_URL}/custom?keyword=${encodeURIComponent(apiParams.param)}`;
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.warn(`Primary endpoint failed for category ${selectedCategory}`);

      // Try fallback: if classified failed, try custom
      if (apiParams.type === 'classified') {
        const fallbackUrl = `${BASE_URL}/custom?keyword=${encodeURIComponent(apiParams.param)}`;
        const fallbackResponse = await fetch(fallbackUrl);

        if (!fallbackResponse.ok) {
          return await fetchRandomQuestion();
        }

        const data = await fallbackResponse.json();
        return Response.json({
          ...data,
          practiceCategory: selectedCategory,
          usedFallback: 'custom'
        });
      }

      // If custom failed or no fallback available, use random
      return await fetchRandomQuestion();
    }

    const data = await response.json();
    return Response.json({
      ...data,
      practiceCategory: selectedCategory,
      endpoint: apiParams.type
    });

  } catch (error) {
    console.error('Practice API error:', error);
    return await fetchRandomQuestion();
  }
}

async function fetchRandomQuestion() {
  const randomUrl = process.env.RANDOM_API;
  if (!randomUrl) {
    return new Response("API configuration error", { status: 500 });
  }

  try {
    const response = await fetch(randomUrl);
    if (!response.ok) {
      return new Response("Failed to fetch question", { status: 500 });
    }
    const data = await response.json();
    return Response.json({ ...data, usedFallback: 'random' });
  } catch (error) {
    console.error('Random API error:', error);
    return new Response("Failed to fetch question", { status: 500 });
  }
}
