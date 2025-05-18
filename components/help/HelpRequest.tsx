import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpRequest as HelpRequestType, User } from "@prisma/client";

interface HelpRequestProps {
  helpRequest: HelpRequestType & { author: User };
}

const HelpRequest: React.FC<HelpRequestProps> = ({ helpRequest }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-center space-x-4 p-6 pb-2">
        <Avatar>
          <AvatarImage src={helpRequest.author.image || ""} alt={helpRequest.author.name || "User"} />
          <AvatarFallback>{helpRequest.author.name?.slice(0,2) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{helpRequest.author.name || "Unknown"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-2">
            <h3 className="font-bold">{helpRequest.title}</h3>
            <p>{helpRequest.description}</p>
            <p className="text-sm text-muted-foreground">Category: {helpRequest.category}</p>
            <p className="text-sm text-muted-foreground">University: {helpRequest.university || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">Course: {helpRequest.course || "Unknown"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpRequest;