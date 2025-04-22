import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationRequest as VerificationRequestType } from "@prisma/client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface VerificationRequestProps {
  verificationRequest: VerificationRequestType;
}

const VerificationRequest: React.FC<VerificationRequestProps> = ({
  verificationRequest,
}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Verification Request</CardTitle>
        <CardDescription>
          Request ID: {verificationRequest.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative w-full h-48">
          <Image
            src={verificationRequest.image}
            alt="Student Card"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">User Id:</p>
          <p className="text-sm">{verificationRequest.userId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Status:</p>
          <Badge variant={verificationRequest.status === "pending" ? "secondary" : verificationRequest.status === "approved" ? "success" : "destructive"} >{verificationRequest.status}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
       
      </CardFooter>
    </Card>
  );
};

export default VerificationRequest;