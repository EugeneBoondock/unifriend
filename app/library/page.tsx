import BookList from '@/components/library/BookList';
import CreateBookForm from '@/components/library/CreateBookForm';
import ReadingListList from '@/components/library/ReadingListList';
import CreateReadingListForm from '@/components/library/CreateReadingListForm';
import BookReturnReminder from '@/components/library/BookReturnReminder';

export default async function LibraryPage() {
  const booksResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/books`);
  const books = await booksResponse.json();

  const readingListsResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/reading-lists`);
  const readingLists = await readingListsResponse.json();

  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniFriend Library</h1>
          <CreateBookForm />
          <CreateReadingListForm />
          <BookReturnReminder />
        </div>
        <div className='mt-10'>
            <h2 className="text-2xl font-bold tracking-tight">Books</h2>
            <BookList books={books} />
        </div>
        <div className='mt-10'>
            <h2 className="text-2xl font-bold tracking-tight">Reading Lists</h2>
            <ReadingListList readingLists={readingLists} />
        </div>
      </div>
    </div>
  );
}