import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalTrigger,
} from "@/components/ui";

interface VolunteerProps {
  volunteer: {
    id: string;
    category: string;
    university?: string | null;
    course?: string | null;
    user: {
        id: string;
        name?: string | null;
        image?: string | null;
    }
  };
}

export const Volunteer: React.FC<VolunteerProps> = ({ volunteer }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = formData.get("value") as string;
        const comment = formData.get("comment") as string;

        try {
            await fetch("/api/ratings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    value: parseInt(value),
                    comment,
                    volunteerId: volunteer.id,
                }),
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

  return (
    <Card>
        <CardHeader className="flex-row items-center space-y-0 pb-2">
            <Avatar className="mr-2">
                <img
                  src={volunteer.user.image || "/placeholder.svg"}
                  alt="user image"
                />
            </Avatar>
            <CardTitle className="text-sm font-medium">
                {volunteer.user.name || "Unknown User"}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Category: {volunteer.category}
            </p>
            {volunteer.university && (
              <p className="text-sm text-muted-foreground">
                University: {volunteer.university}
              </p>
            )}
            {volunteer.course && (
              <p className="text-sm text-muted-foreground">
                Course: {volunteer.course}
              </p>
            )}
            <Modal>
                <ModalTrigger asChild>
                    <Button className="mt-4">Rate</Button>
                </ModalTrigger>
                <ModalContent>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <label htmlFor="value">Value</label>
                        <select name="value" id="value" className="border rounded-md px-2 py-1">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <label htmlFor="comment">Comment</label>
                        <textarea name="comment" id="comment" className="border rounded-md px-2 py-1" />
                        <Button type="submit">Submit</Button>
                    </form>
                </ModalContent>
            </Modal>
        </CardContent>
    </Card>
  );
};