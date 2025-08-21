import { useState,useEffect } from "react";

interface SearchBarProps{
   OnSearch: (query: string) =>void;
}

export default function SearchBar ({ OnSearch }: SearchBarProps)
{
   const [input,setInput]=useState("");
   
   useEffect(()=>{
      
    const handler=setTimeout(()=>{
        
        OnSearch(input);
    }, 1000);

    return ()=> clearTimeout(handler);
   },[input]);


   return(
    <input type="text"
    placeholder="Search books..."
    value={input}
    onChange={(e)=>setInput(e.target.value)}
    />
   );
}
