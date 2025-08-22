import { useState,useEffect } from "react";
import './SearchBar.css'
interface SearchBarProps{
   onSearch: (query: string) =>void;
}

export default function SearchBar ({ onSearch }: SearchBarProps)
{
   const [input,setInput]=useState("");
   
   useEffect(()=>{
      
    const handler=setTimeout(()=>{
        
        onSearch(input);
    }, 700);

    return ()=> clearTimeout(handler);
   },[input]);


   return(
    <input type="text"
    className="search-bar"
    placeholder="Search books..."
    value={input}
    onChange={(e)=>setInput(e.target.value)}
    />
   );
}
