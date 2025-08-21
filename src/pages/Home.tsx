import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import { searchBooks } from "../api";

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
        <SearchBar OnSearch={handleSearch} />
        {loading && <p>Loading...</p> }
        
         {!loading && books.length === 0 && <p>No results found</p>}

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
    </div>
   );

}