import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Greeting = () => {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  if (!session?.user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {greeting}, {session.user.name}!
        </CardTitle>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};

export default Greeting;