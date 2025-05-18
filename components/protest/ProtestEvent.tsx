import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProtestEvent as ProtestEventType } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import ProtestParticipantList from "./ProtestParticipantList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { Button } from "../ui/button";

interface ProtestEventProps {
  event: ProtestEventType & {
    organizer: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    participants: any[];
  };
}

const ProtestEvent: React.FC<ProtestEventProps> = ({ event }) => {
  const handleJoinOrLeave = async () => {
    // TODO: implement the logic to join or leave the event
    // if the user is not in the participants list, call the api to add the user in the participants list
    // if the user is in the participants list, call the api to remove the user from the participants list
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center space-y-0 pb-2">
        <Avatar>
          <AvatarImage
            src={event.organizer.image || ""}
            alt={event.organizer.name || "Organizer"}
          />
          <AvatarFallback>
            {event.organizer.name?.slice(0, 2) || "OR"}
          </AvatarFallback>
        </Avatar>
        <div className="pl-4">
          <CardTitle>{event.organizer.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>
        <div className="space-y-2 mt-4">
          <Badge variant="outline">Location: {event.location}</Badge>
          <Badge variant="outline">
            Start Date: {format(new Date(event.startDate), "MMM dd, yyyy")}
          </Badge>
          <Badge variant="outline">
            End Date:{" "}
            {event.endDate
              ? format(new Date(event.endDate), "MMM dd, yyyy")
              : "Not defined"}
          </Badge>
          <Badge variant="outline">
            Participants: {event.participants.length}
          </Badge>
        </div>
        {event.safetyGuidelines && (
          <div className="space-y-2 mt-4">
            <h4 className="font-semibold">Safety Guidelines:</h4>
            <p className="text-sm text-muted-foreground">
              {event.safetyGuidelines}
            </p>
          </div>
        )}
        <h4 className="font-semibold mt-4">Participants:</h4>
        <ProtestParticipantList participants={event.participants} />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {format(new Date(event.createdAt), "MMM dd, yyyy")}
        </p>
        {/* TODO: check if the user is the organizer to display the edit/delete buttons */}
        {/* TODO: check if the user is a participant to display the join/leave button */}
        <div className="flex gap-2">
          {/* TODO: handle the onClick */}
          <Button variant="outline" size="sm">
            Edit
          </Button>
          {/* TODO: handle the onClick */}
          <Button variant="destructive" size="sm">
            Delete
          </Button>
          {/* TODO: Implement the logic to check if the user is a participant */}
          {true ? (
            // Display leave button if the user is a participant
            <Button
              variant="destructive"
              size="sm"
              onClick={handleJoinOrLeave}
            >
              Leave
            </Button>
          ) : (
            // Display join button if the user is not a participant
            <Button
              variant="default"
              size="sm"
              onClick={handleJoinOrLeave}
            >
              Join
            </Button>
          )}
        </div>
        {/* TODO: if the user is the organizer add a button to edit the event */}
      </CardFooter>
    </Card>
  );
};

export default ProtestEvent;