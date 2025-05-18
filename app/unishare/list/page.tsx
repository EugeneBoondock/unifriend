"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ListResource() {
  const router = useRouter();
  const [resourceType, setResourceType] = useState("textbook");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Common fields
    title: "",
    description: "",
    location: "",

    // Textbook fields
    author: "",
    course: "",
    condition: "",
    price: "",
    exchangeType: "sell",

    // MealShare fields
    mealType: "vouchers",
    expiryDate: "",
    anonymousDonation: false,

    // RideLink fields
    departure: "",
    destination: "",
    departureTime: "",
    returnTime: "",
    availableSeats: "1",
    costSharing: "",
    recurring: false,

    // Common requirements
    contactPreference: "platform",
    termsAgreed: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is where you would normally send the data to your API
    // For demo purposes we're just showing a loading state and redirecting

    setTimeout(() => {
      setIsLoading(false);
      alert("Your listing has been created successfully!");
      router.push("/unishare");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/unishare"
            className="text-violet-600 hover:underline flex items-center mb-4"
            legacyBehavior>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to UniShare
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create a New Listing</h1>
          <p className="text-zinc-600">Share resources with your fellow students by creating a listing on UniShare.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What would you like to share?</CardTitle>
            <CardDescription>Select the type of resource you want to list.</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="textbook" className="mb-6" onValueChange={setResourceType}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="textbook">Textbook</TabsTrigger>
                <TabsTrigger value="meal">MealShare</TabsTrigger>
                <TabsTrigger value="ride">RideLink</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common details section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-zinc-800 mb-4">Basic Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder={
                        resourceType === "textbook" ? "e.g., Introduction to Economics Textbook" :
                        resourceType === "meal" ? "e.g., 5 Meal Vouchers Available" :
                        "e.g., Daily Commute to UCT"
                      }
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide a detailed description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Where can people find you or this resource?"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Textbook-specific fields */}
                {resourceType === "textbook" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-800 mb-4">Textbook Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          name="author"
                          placeholder="Author name"
                          value={formData.author}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Input
                          id="course"
                          name="course"
                          placeholder="e.g., Economics 101"
                          value={formData.course}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="very-good">Very Good</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Exchange Type</Label>
                      <RadioGroup
                        value={formData.exchangeType}
                        onValueChange={(value) => handleSelectChange("exchangeType", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sell" id="sell" />
                          <Label htmlFor="sell" className="font-normal">Sell</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lend" id="lend" />
                          <Label htmlFor="lend" className="font-normal">Lend</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="co-own" id="co-own" />
                          <Label htmlFor="co-own" className="font-normal">Co-ownership (share purchase)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price or Terms</Label>
                      <Input
                        id="price"
                        name="price"
                        placeholder={
                          formData.exchangeType === "sell" ? "e.g., R350" :
                          formData.exchangeType === "lend" ? "e.g., Return within 2 weeks" :
                          "e.g., R800 split 4 ways (R200 each)"
                        }
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* MealShare-specific fields */}
                {resourceType === "meal" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-800 mb-4">Meal Share Details</h3>

                    <div className="space-y-2">
                      <Label>What are you sharing?</Label>
                      <RadioGroup
                        value={formData.mealType}
                        onValueChange={(value) => handleSelectChange("mealType", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vouchers" id="vouchers" />
                          <Label htmlFor="vouchers" className="font-normal">Meal Vouchers/Credits</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="potluck" id="potluck" />
                          <Label htmlFor="potluck" className="font-normal">Organizing a Potluck</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excess" id="excess" />
                          <Label htmlFor="excess" className="font-normal">Excess Food</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.mealType === "vouchers" && (
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                    {formData.mealType === "potluck" && (
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Event Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymousDonation"
                        checked={formData.anonymousDonation}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("anonymousDonation", checked as boolean)
                        }
                      />
                      <Label htmlFor="anonymousDonation" className="font-normal text-sm">
                        I want to remain anonymous
                      </Label>
                    </div>
                  </div>
                )}

                {/* RideLink-specific fields */}
                {resourceType === "ride" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-800 mb-4">Ride Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departure">Departure Point</Label>
                        <Input
                          id="departure"
                          name="departure"
                          placeholder="e.g., Rondebosch"
                          value={formData.departure}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Input
                          id="destination"
                          name="destination"
                          placeholder="e.g., UCT Upper Campus"
                          value={formData.destination}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departureTime">Departure Time</Label>
                        <Input
                          id="departureTime"
                          name="departureTime"
                          type="datetime-local"
                          value={formData.departureTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="returnTime">Return Time (if applicable)</Label>
                        <Input
                          id="returnTime"
                          name="returnTime"
                          type="datetime-local"
                          value={formData.returnTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availableSeats">Available Seats</Label>
                        <Select
                          value={formData.availableSeats}
                          onValueChange={(value) => handleSelectChange("availableSeats", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of seats" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 seat</SelectItem>
                            <SelectItem value="2">2 seats</SelectItem>
                            <SelectItem value="3">3 seats</SelectItem>
                            <SelectItem value="4">4 seats</SelectItem>
                            <SelectItem value="5+">5+ seats</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="costSharing">Cost Sharing (if any)</Label>
                        <Input
                          id="costSharing"
                          name="costSharing"
                          placeholder="e.g., R30 per trip"
                          value={formData.costSharing}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recurring"
                        checked={formData.recurring}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("recurring", checked as boolean)
                        }
                      />
                      <Label htmlFor="recurring" className="font-normal text-sm">
                        This is a recurring ride (e.g., daily commute)
                      </Label>
                    </div>
                  </div>
                )}

                {/* Contact preferences */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-zinc-800 mb-4">Contact Preferences</h3>

                  <div className="space-y-2">
                    <Label>How would you like to be contacted?</Label>
                    <RadioGroup
                      value={formData.contactPreference}
                      onValueChange={(value) => handleSelectChange("contactPreference", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="platform" id="platform" />
                        <Label htmlFor="platform" className="font-normal">Through UniShare messaging only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="whatsapp" id="whatsapp" />
                        <Label htmlFor="whatsapp" className="font-normal">WhatsApp</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="font-normal">Email</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsAgreed"
                      checked={formData.termsAgreed}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("termsAgreed", checked as boolean)
                      }
                      required
                    />
                    <Label htmlFor="termsAgreed" className="font-normal text-sm">
                      I agree to the UniShare <Link href="#" className="text-violet-600 hover:underline">Community Guidelines</Link> and <Link href="#" className="text-violet-600 hover:underline">Terms of Service</Link>. I confirm that all information provided is accurate.
                    </Label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-violet-800 hover:bg-violet-900"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating your listing..." : "Create Listing"}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
