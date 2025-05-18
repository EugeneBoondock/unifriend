import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ProtestParticipantProps {
  participant: {
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    eventId: string;
    id: string;
  };
}

const ProtestParticipant: React.FC<ProtestParticipantProps> = ({
  participant,
}) => {
  const { data: session } = useSession();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    if (session?.user?.id && participant.eventId && participant.id) {
      setIsLeaving(true);
      try {
        const response = await fetch(
          `/api/protest-events/${participant.eventId}/participants/${participant.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error leaving protest:", error);
      } finally {
        setIsLeaving(false);
      }
    }
  };
  return (
    <Card className="w-full flex flex-row items-center justify-between">
      <div className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={participant.user.image || ""}
            alt={participant.user.name || "Participant"}
          />
          <AvatarFallback>
            {participant.user.name?.slice(0, 2) || "PA"}
          </AvatarFallback>
        </Avatar>
        <div className="pl-4">
          <CardTitle>{participant.user.name}</CardTitle>
        </div>
      </div>
      <CardContent className="py-2">
        {session?.user?.id === participant.user.id && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeave}
            disabled={isLeaving}
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </Button>
        )}
        {session?.user?.id !== participant.user.id && (
          <CardDescription>Participant</CardDescription>
        )}
      </CardContent>
        </div>
    </Card>
  );
};

export default ProtestParticipant;