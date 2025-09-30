import React from "react";
import CategoryRow from "../components/CategoryRow";

interface ShelfCategoryProps {
  title: string;
  books: Array<{
    key: string;
    title: string;
    author?: string;
    year?: number;
    coverId?: number;
  }>;
  loading?: boolean;
}

const ShelfCategory: React.FC<ShelfCategoryProps> = ({ title, books, loading }) => {
  const formattedBooks = books.map((book) => ({
    key: book.key,
    title: book.title,
    author_name: book.author ? [book.author] : [],
    cover_i: book.coverId,
    first_publish_year: book.year,
  }));

  return (
    <CategoryRow
      title={title}
      books={formattedBooks}
      loading={loading ?? false}
      itemsPerPage={5}
    />
  );
};

export default ShelfCategory;
