export async function searchBooks(query: string) {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}