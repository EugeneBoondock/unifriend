import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingProps {
  value: number;
  comment?: string;
  userName: string;
  userImage?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  comment,
  userName,
  userImage,
}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle>{userName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          {[...Array(value)].map((_, index) => (
            <svg
              key={index}
              className="h-5 w-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0l2.9 6.8 7.1 1.1-5.2 5.1 1.5 7-6.3-3.5L3.7 20l1.5-7-5.2-5.1 7.1-1.1z"
                clipRule="evenodd"
              />
            </svg>
          ))}
          {[...Array(5 - value)].map((_, index) => (
            <svg
              key={index}
              className="h-5 w-5 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0l2.9 6.8 7.1 1.1-5.2 5.1 1.5 7-6.3-3.5L3.7 20l1.5-7-5.2-5.1 7.1-1.1z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        {comment && <p className="text-sm">{comment}</p>}
      </CardContent>
    </Card>
  );
};

export default Rating;