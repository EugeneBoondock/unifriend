import { ProtestEvent as ProtestEventType } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { UserAvatar } from "../profile/user-avatar";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ProtestEventProps {
  protestEvent: ProtestEventType & {
    organizer: {
      name: string | null;
      image: string | null;
    };
  };
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
}

export function ProtestEvent({ protestEvent, onJoin, onLeave }: ProtestEventProps) {
  const { data: session } = useSession();
  const [isJoined, setIsJoined] = useState(false);
  const handleJoin = () => {
    if (onJoin) {
      onJoin(protestEvent.id);
      setIsJoined(true);
    }
  };
  const handleLeave = () => {
    if (onLeave) {
      onLeave(protestEvent.id);
      setIsJoined(false);
    }
  }
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserAvatar
            name={protestEvent.organizer.name}
            imageUrl={protestEvent.organizer.image}
            size="sm"
          />
          <CardTitle>{protestEvent.title}</CardTitle>
        </div>
        <CardDescription>
          {protestEvent.location} -{" "}
          {format(new Date(protestEvent.startDate), "dd/MM/yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{protestEvent.description}</p>
        {protestEvent.safetyGuidelines && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Safety Guidelines</h3>
            <p>{protestEvent.safetyGuidelines}</p>
          </div>
        )}
          {session && protestEvent.phoneNumber && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Phone Number</h3>
              <p>{protestEvent.phoneNumber}</p>
            </div>
          )}
          {session && protestEvent.bankAccountDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Bank Account Details</h3>
              <p>{protestEvent.bankAccountDetails}</p>
            </div>
          )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {onJoin && onLeave &&(
            <>
             {isJoined ? (
              <Button onClick={handleLeave} variant="destructive">
                Leave
              </Button>
            ) : (
              <Button onClick={handleJoin} variant="outline">
                Join
              </Button>
            )}
            </>
        )}
      </CardFooter>
    </Card>
  );
}