export async function searchBooks(query: string) {
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  if (!res.ok)
    {
      throw new Error("Failed to fetch");
    } 
  return res.json();
}

export async function getBookDetails(workId:string) {
  const res = await fetch(`https://openlibrary.org/works/${workId}.json`)

  if (!res.ok)
  {
    throw new Error("Failed to fetch book details")
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