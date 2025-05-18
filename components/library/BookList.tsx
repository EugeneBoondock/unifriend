import React from 'react';
import { Book as BookType } from '@prisma/client';
import Book from './Book';

interface BookListProps {
  books: BookType[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;