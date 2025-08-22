import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
interface BookCardProps{
  title:string;
  author:string;
  year? :number;
  coverId? :number;
  bookKey:string
}

export default function BookCard({title,author,year,coverId,bookKey}: BookCardProps){

    const coverUrl=coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/150x200?text=No+Cover";

    return(
      <Link to={`/book/${bookKey.replace("/works/", "")}`}> 
      <div className="book-card">
        <img src={coverUrl} alt={title}></img>
        <h3>{title}</h3>
        <p>{author}</p>
        {year} && <small>{year}</small>
       </div></Link>
      
    );
}
