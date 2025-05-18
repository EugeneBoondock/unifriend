import { BookList } from './BookList';
import { Book } from './Book';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReadingListProps {
  readingList: {
    id: string;
    description?: string;
    books: {
      book: {
        id: string;
        title: string;
        author: string;
        description?: string;
        coverUrl?: string;
        category?: string;
      }
    }[];
    name: string;
    userId: string;
  };
  user: {
    id: string;
    image?: string | null;
  };
}

export function ReadingList({ readingList }: ReadingListProps) {
  const handleAddBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/reading-lists/${readingList.id}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        // Handle errors here, e.g., show an error message to the user
        console.error('Failed to add book to reading list');
      }
    } catch (error) {
      console.error('Error adding book to reading list:', error);
      // Handle network errors or other exceptions
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/reading-lists/${readingList.id}/books`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        // Handle errors here, e.g., show an error message to the user
        console.error('Failed to remove book from reading list');
      }
    } catch (error) {
      console.error('Error removing book from reading list:', error);
      // Handle network errors or other exceptions
    }
  };

  const handleDeleteReadingList = async () => {
    try {
      const response = await fetch(`/api/reading-lists/${readingList.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Handle errors here, e.g., show an error message to the user
        console.error('Failed to delete reading list');
      } else {
        // Optionally, redirect the user or update the UI after successful deletion
        console.log('Reading list deleted successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting reading list:', error);
      // Handle network errors or other exceptions
    }
  };

  const isOwner = user?.id === readingList.userId;
  return (
    <div className="flex flex-col space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{readingList.name}</CardTitle>
          <CardDescription>{readingList.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readingList.books.map((item) => (
              <div key={item.book.id} className="relative">
                <Book book={item.book} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveBook(item.book.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Add Book
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          {isOwner && <Button variant="destructive" onClick={handleDeleteReadingList}>Delete</Button>}

        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a book to your reading list</DialogTitle>
            <DialogDescription>
              Search for a book and add it to your reading list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Replace this with your book search component */}
            <Input id="search" placeholder="Search for a book..." />
            {/* Display search results here using Book component */}
            {/* Example Book component within the Dialog */}
            {/* <Book book={{ id: '1', title: 'Example Book', author: 'John Doe' }} /> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}