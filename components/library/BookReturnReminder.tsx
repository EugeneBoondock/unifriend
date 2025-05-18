import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Book } from '@/components/library/Book';

interface Reservation {
  id: string;
  bookId: string;
  book: {
    title: string;
    author: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BookReturnReminder: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/reservations');
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (reservations.length === 0) {
    return <div>No books to return.</div>;
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Book Return Reminder</CardTitle>
          <CardDescription>
            Here are the books you need to return.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ul>
            {reservations.map((reservation) => (
                <li key={reservation.id} className="border rounded-md p-4">
                  <div>
                    <strong>{reservation.book.title}</strong> by {reservation.book.author}
                  </div>
                  <div>
                    Due date: {new Date(reservation.updatedAt).toLocaleDateString()}
                  </div>
                </li>
            ))}
          </ul>
        </CardContent>
      </Card>
  );
};

export default BookReturnReminder;