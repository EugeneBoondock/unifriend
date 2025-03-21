"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [nsfasFunded, setNsfasFunded] = useState(false);
  const [accommodation, setAccommodation] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Student-specific fields
  const [grade, setGrade] = useState("");
  const [lastSchool, setLastSchool] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (!termsAccepted) newErrors.terms = "You must accept the terms and conditions";

    if (userType === "student") {
      if (!university.trim()) newErrors.university = "University is required";
      if (!studentNumber.trim()) newErrors.studentNumber = "Student number is required";
    } else if (userType === "matric") {
      if (!grade.trim()) newErrors.grade = "Grade is required";
      if (!lastSchool.trim()) newErrors.lastSchool = "School name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user in the database
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType,
          university: userType === "student" ? university : null,
          yearOfStudy: userType === "student" ? yearOfStudy : null,
          fieldOfStudy: userType === "student" ? fieldOfStudy : null,
          studentNumber: userType === "student" ? studentNumber : null,
          nsfasFunded: userType === "student" ? nsfasFunded : false,
          accommodation: userType === "student" ? accommodation : null,
          grade: userType === "matric" ? grade : null,
          lastSchool: userType === "matric" ? lastSchool : null,
          employmentStatus: userType === "unemployed" ? employmentStatus : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      toast.success("Account created successfully!");

      // Automatically sign in the user
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create Your Unifriend Account</h1>
        <p className="text-muted-foreground">
          Join the South African university student community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Fill out the form below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="userType">I am a</Label>
                <Select
                  value={userType}
                  onValueChange={setUserType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">University Student</SelectItem>
                    <SelectItem value="matric">High School / Matric Student</SelectItem>
                    <SelectItem value="unemployed">Unemployed Graduate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              {userType === "student" && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="university">University</Label>
                      <Select value={university} onValueChange={setUniversity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university-of-cape-town">University of Cape Town</SelectItem>
                          <SelectItem value="university-of-witwatersrand">University of Witwatersrand</SelectItem>
                          <SelectItem value="stellenbosch-university">Stellenbosch University</SelectItem>
                          <SelectItem value="university-of-pretoria">University of Pretoria</SelectItem>
                          <SelectItem value="university-of-johannesburg">University of Johannesburg</SelectItem>
                          <SelectItem value="university-of-kwazulu-natal">University of KwaZulu-Natal</SelectItem>
                          <SelectItem value="rhodes-university">Rhodes University</SelectItem>
                          <SelectItem value="university-of-the-western-cape">University of the Western Cape</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.university && <p className="text-sm text-red-500">{errors.university}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="studentNumber">Student Number</Label>
                      <Input
                        id="studentNumber"
                        placeholder="ABCXYZ123"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                      />
                      {errors.studentNumber && <p className="text-sm text-red-500">{errors.studentNumber}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                          <SelectItem value="5+">Fifth Year or Higher</SelectItem>
                          <SelectItem value="honours">Honours</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fieldOfStudy">Field of Study</Label>
                      <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business & Economics</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="health">Health Sciences</SelectItem>
                          <SelectItem value="humanities">Humanities & Social Sciences</SelectItem>
                          <SelectItem value="law">Law</SelectItem>
                          <SelectItem value="science">Natural Sciences</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="arts">Arts & Design</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="accommodation">Accommodation</Label>
                      <Select value={accommodation} onValueChange={setAccommodation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Where do you stay?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university-residence">University Residence</SelectItem>
                          <SelectItem value="private-residence">Private Residence</SelectItem>
                          <SelectItem value="private-accommodation">Private Accommodation</SelectItem>
                          <SelectItem value="family-home">Family Home</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id="nsfasFunded"
                        checked={nsfasFunded}
                        onCheckedChange={(checked) => setNsfasFunded(checked as boolean)}
                      />
                      <label
                        htmlFor="nsfasFunded"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I am NSFAS funded
                      </label>
                    </div>
                  </div>
                </>
              )}

              {userType === "matric" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="grade">Current Grade</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Grade 10</SelectItem>
                        <SelectItem value="11">Grade 11</SelectItem>
                        <SelectItem value="12">Grade 12 (Matric)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastSchool">School Name</Label>
                    <Input
                      id="lastSchool"
                      placeholder="Your high school"
                      value={lastSchool}
                      onChange={(e) => setLastSchool(e.target.value)}
                    />
                    {errors.lastSchool && <p className="text-sm text-red-500">{errors.lastSchool}</p>}
                  </div>
                </div>
              )}

              {userType === "unemployed" && (
                <div className="grid gap-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeking">Actively Seeking Work</SelectItem>
                      <SelectItem value="freelance">Freelancing</SelectItem>
                      <SelectItem value="internship">Looking for Internships</SelectItem>
                      <SelectItem value="further-study">Planning Further Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary underline underline-offset-4">
                    terms and conditions
                  </Link>
                </label>
              </div>
              {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
