"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignUp() {
  const [signupMethod, setSignupMethod] = useState<'standard' | 'nsfas' | 'transfer'>('standard');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    yearOfStudy: "",
    studentNumber: "",
    nsfasFunded: false,
    accommodation: "",
    fieldOfStudy: "",
    interests: [] as string[],
    agreeToTerms: false,
    receiveUpdates: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This would normally make a registration request
    // For demo purposes, we're just showing a loading state
    setTimeout(() => {
      setIsLoading(false);
      alert("Sign up functionality would be implemented here with NextAuth");
    }, 1500);
  };

  // South African Universities list
  const universities = [
    { value: "uct", label: "University of Cape Town (UCT)" },
    { value: "wits", label: "University of the Witwatersrand (Wits)" },
    { value: "up", label: "University of Pretoria (UP)" },
    { value: "ukzn", label: "University of KwaZulu-Natal (UKZN)" },
    { value: "su", label: "Stellenbosch University" },
    { value: "uj", label: "University of Johannesburg (UJ)" },
    { value: "uwc", label: "University of the Western Cape (UWC)" },
    { value: "unisa", label: "University of South Africa (UNISA)" },
    { value: "nwu", label: "North-West University (NWU)" },
    { value: "ru", label: "Rhodes University" },
    { value: "ufs", label: "University of the Free State (UFS)" },
    { value: "nmu", label: "Nelson Mandela University (NMU)" },
    { value: "tut", label: "Tshwane University of Technology (TUT)" },
    { value: "cut", label: "Central University of Technology (CUT)" },
    { value: "dut", label: "Durban University of Technology (DUT)" },
    { value: "cput", label: "Cape Peninsula University of Technology (CPUT)" },
    { value: "vut", label: "Vaal University of Technology (VUT)" },
    { value: "mut", label: "Mangosuthu University of Technology (MUT)" },
    { value: "ump", label: "University of Mpumalanga (UMP)" },
    { value: "spu", label: "Sol Plaatje University (SPU)" },
    { value: "univen", label: "University of Venda (UNIVEN)" },
    { value: "ul", label: "University of Limpopo (UL)" },
    { value: "uzulu", label: "University of Zululand (UNIZULU)" },
    { value: "unizulu", label: "University of Zululand (UNIZULU)" },
    { value: "uwj", label: "University of the Western Cape-Johannesburg (UWJ)" },
    { value: "wssu", label: "Walter Sisulu University (WSU)" },
    { value: "other", label: "Other Institution" }
  ];

  // Fields of study
  const fieldsOfStudy = [
    { value: "business", label: "Business & Economics" },
    { value: "engineering", label: "Engineering & Built Environment" },
    { value: "health", label: "Health Sciences" },
    { value: "humanities", label: "Humanities & Social Sciences" },
    { value: "law", label: "Law" },
    { value: "science", label: "Science & Mathematics" },
    { value: "education", label: "Education" },
    { value: "arts", label: "Arts & Design" },
    { value: "it", label: "Information Technology & Computer Science" },
    { value: "agriculture", label: "Agriculture & Environmental Sciences" },
    { value: "other", label: "Other" }
  ];

  // Student interests
  const studentInterests = [
    { value: "nsfas", label: "NSFAS Support" },
    { value: "academics", label: "Academic Help" },
    { value: "career", label: "Career Development" },
    { value: "accommodation", label: "Accommodation Advice" },
    { value: "mental", label: "Mental Wellness" },
    { value: "social", label: "Social Activities" },
    { value: "mentorship", label: "Mentorship" },
    { value: "financial", label: "Financial Literacy" },
    { value: "internships", label: "Internships & Jobs" },
    { value: "tech", label: "Technology" }
  ];

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-zinc-50">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left side - Benefits */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="p-6 bg-violet-900 text-white rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-4">Join South Africa's Largest Student Community</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Get personalized NSFAS application & appeal guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access course-specific study materials from your university</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Connect with students from your field at your institution</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Find affordable accommodation near your campus</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free mental health resources and peer support</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-2 text-zinc-900">What students are saying:</h3>
            <div className="border-l-4 border-violet-500 pl-4 py-2 italic text-zinc-600 text-sm mb-4">
              "After struggling with my NSFAS application for weeks, the guidance on Unifriend helped me fix the errors and get approved within days."
              <div className="mt-2 font-medium text-zinc-800 not-italic">— Sipho M., University of Johannesburg</div>
            </div>
            <div className="border-l-4 border-violet-500 pl-4 py-2 italic text-zinc-600 text-sm">
              "Finding affordable accommodation near campus was a nightmare until I connected with senior students through Unifriend who helped me find safe options."
              <div className="mt-2 font-medium text-zinc-800 not-italic">— Thandi K., University of Cape Town</div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <Card className="md:col-span-3">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create your Unifriend account</CardTitle>
            <CardDescription className="text-center">
              Select how you'd like to register for the most personalized experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" className="mb-6" onValueChange={(value) => setSignupMethod(value as any)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="nsfas">NSFAS Student</TabsTrigger>
                <TabsTrigger value="transfer">Transfer Student</TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <p className="text-sm text-zinc-600 mb-4">
                  Basic registration for all students at South African universities or prospective students.
                </p>
              </TabsContent>

              <TabsContent value="nsfas">
                <p className="text-sm text-zinc-600 mb-4">
                  Enhanced registration for NSFAS recipients or applicants - provides immediate access to NSFAS resources and guidance.
                </p>
              </TabsContent>

              <TabsContent value="transfer">
                <p className="text-sm text-zinc-600 mb-4">
                  Special registration for students transferring between institutions - includes credit transfer guidance and admissions support.
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-700 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="As it appears on your ID/student card"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your university or personal email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-700 mb-4">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University/Institution</Label>
                      <Select onValueChange={(value) => handleSelectChange("university", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your institution" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {universities.map(uni => (
                            <SelectItem key={uni.value} value={uni.value}>{uni.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Select onValueChange={(value) => handleSelectChange("fieldOfStudy", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldsOfStudy.map(field => (
                            <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Select onValueChange={(value) => handleSelectChange("yearOfStudy", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Prospective Student</SelectItem>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                          <SelectItem value="5">Honours</SelectItem>
                          <SelectItem value="6">Masters</SelectItem>
                          <SelectItem value="7">PhD</SelectItem>
                          <SelectItem value="8">Postgraduate Diploma</SelectItem>
                          <SelectItem value="9">Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentNumber">Student Number (Optional)</Label>
                      <Input
                        id="studentNumber"
                        name="studentNumber"
                        placeholder="To verify your university"
                        value={formData.studentNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* NSFAS & Accommodation Section - Shown conditionally */}
                {signupMethod === "nsfas" && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-700 mb-4">NSFAS & Accommodation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="nsfasFunded"
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("nsfasFunded", checked as boolean)
                          }
                        />
                        <label
                          htmlFor="nsfasFunded"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I am currently NSFAS funded or have applied
                        </label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accommodation">Accommodation Status</Label>
                        <Select onValueChange={(value) => handleSelectChange("accommodation", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accommodation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="university">University Residence</SelectItem>
                            <SelectItem value="nsfas-private">NSFAS Private Accommodation</SelectItem>
                            <SelectItem value="private">Private (Self-funded)</SelectItem>
                            <SelectItem value="home">Living at Home</SelectItem>
                            <SelectItem value="looking">Currently Looking</SelectItem>
                            <SelectItem value="none">Not Applicable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interests Section */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-700 mb-4">What are you interested in? (Select all that apply)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {studentInterests.map(interest => (
                      <div key={interest.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest.value}`}
                          onCheckedChange={(checked) =>
                            handleInterestChange(interest.value, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`interest-${interest.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {interest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms and Marketing */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("agreeToTerms", checked as boolean)
                      }
                      required
                    />
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the <Link href="/terms" className="text-violet-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-violet-600 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="receiveUpdates"
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("receiveUpdates", checked as boolean)
                      }
                      checked={formData.receiveUpdates}
                    />
                    <label
                      htmlFor="receiveUpdates"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I would like to receive updates about resources, events, and opportunities relevant to my field and university
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating your account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-zinc-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-violet-600 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center text-xs text-zinc-500 mt-8 max-w-md mx-auto">
        Unifriend is an independent platform not affiliated with any university or NSFAS. We provide guidance and community support but do not guarantee funding outcomes or official university information.
      </div>
    </div>
  );
}
