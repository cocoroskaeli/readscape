import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooks } from "../api";
import './Home.css'

export default function Home ()
{
   const [books,setBooks]=useState<any[]>([]);
   const [loading,setLoading]=useState(false);

   async function handleSearch(query:string) {
    
    if (!query)
    {
        setBooks([]);
        return;
    }

    setLoading(true);

   try{
    const data=await searchBooks(query);
    setBooks(data.docs);
    
   }
   catch(e)
   {
    console.log(e);
   }
   finally{
      setLoading(false);
   }
    
   }
   
   return(
    <div>
      <header className="search-header">
        <SearchBar onSearch={handleSearch} />
      </header>
        
        <main>  {loading && (
    <div className="grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-cover"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
        </div>
      ))}
    </div>
  )}

  {!loading && books.length === 0 && <p>No results found</p>}

  {!loading && (
    <div className="grid">
      {books.map((book) => (
        <BookCard
          key={book.key}
          title={book.title}
          author={book.author_name?.[0] || "Unknown"}
          year={book.first_publish_year}
          coverId={book.cover_i}
        />
      ))}
    </div>
  )}
      </main>
        
    </div>
   );

}