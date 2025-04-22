import { Reservation as ReservationType } from "@prisma/client";
import Reservation from "./Reservation";
import { Card, CardContent } from "@/components/ui/card";

interface ReservationListProps {
  reservations: ReservationType[];
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="flex flex-col gap-2">
          {reservations.map((reservation) => (
            <Reservation key={reservation.id} reservation={reservation} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationList;