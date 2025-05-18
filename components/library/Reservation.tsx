import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReservationProps {
  reservation: {
    id: string;
    user: {
      name: string;
      image: string | null;
    };
    book: {
      title: string;
    };
  };
}

export const Reservation: React.FC<ReservationProps> = ({ reservation }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/reservations/${reservation.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete reservation");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={reservation.user.image || ""} alt={reservation.user.name} />
              <AvatarFallback>{reservation.user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle>{reservation.user.name} reserved {reservation.book.title}</CardTitle>
          </div>
          <Button onClick={handleDelete}>Delete</Button>
        </CardHeader>
        <CardContent></CardContent>
    </Card>
  );
};