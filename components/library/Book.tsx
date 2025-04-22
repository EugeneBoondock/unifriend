import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface BookProps {
  book: BookType;
}

const Book: React.FC<BookProps> = ({ book }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>By {book.author}</CardDescription>
        {book.category && <CardDescription>Category: {book.category}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {book.coverUrl && (
          <div className="relative w-48 h-64">
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-contain"
            />
          </div>
        )}
        <p className="text-sm">{book.description}</p>
        {book.category && (
            <p className="text-sm">Category: {book.category}</p>
          )}
      </CardContent>
      <CardFooter>
        <Button>Reserve</Button>
      </CardFooter>
    </Card>
  );
};

export default Book;