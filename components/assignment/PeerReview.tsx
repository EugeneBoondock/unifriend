import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PeerReviewProps {
  comment: string;
  rating: number;
  userName: string;
  userImage?: string;
}

const PeerReview: React.FC<PeerReviewProps> = ({
  comment,
  rating,
  userName,
  userImage,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-medium leading-none">
            {userName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Comment: {comment}</p>
        <p className="text-sm">Rating: {rating}</p>
      </CardContent>
    </Card>
  );
};

export default PeerReview;