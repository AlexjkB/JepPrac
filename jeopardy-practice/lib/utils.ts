import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWikiData(title: string) {
  const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&titles=${encodeURIComponent(
    title
  )}&origin=*`;

  const summaryUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(
    title
  )}&origin=*`;

  const [imgRes, sumRes] = await Promise.all([
    fetch(imageUrl),
    fetch(summaryUrl),
  ]);

  const [imgData, sumData] = await Promise.all([imgRes.json(), sumRes.json()]);

  const imgPages = imgData.query.pages;
  const sumPages = sumData.query.pages;
  const imgPage = imgPages[Object.keys(imgPages)[0]];
  const sumPage = sumPages[Object.keys(sumPages)[0]];

  return {
    image: imgPage?.thumbnail?.source ?? null,
    summary: sumPage?.extract ?? null,
  };
}