
export async function searchBooks(query: string) {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  return res.json();
}

export async function getBookDetails(workId: string) {
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }
  return res.json();
}

export async function fetchAuthorName(authors: any[]): Promise<string[]> {
  const names = await Promise.all(
    authors.map(async (a) => {
      const res = await fetch(`https://openlibrary.org${a.author.key}.json`);
      if (!res.ok) throw new Error("Failed to fetch author details");
      const data = await res.json();
      return data.name;
    })
  );
  return names;
}

// ✅ Trending books
export async function fetchTrending(period: "daily" | "weekly" | "monthly" = "daily") {
  const res = await fetch(`https://openlibrary.org/trending/${period}.json`);
  if (!res.ok) throw new Error("Failed to fetch trending books");
  return res.json();
}

// ✅ Subject books
export async function fetchSubjectBooks(subject: string, limit = 12) {
  const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch subject books");
  return res.json();
}