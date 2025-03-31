"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUpPage() {
  const [userType, setUserType] = useState("student");
  const [institutionType, setInstitutionType] = useState("");
  const [studyStatus, setStudyStatus] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please complete the CAPTCHA");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    // Continue with form submission
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-center">Join UniFriend</CardTitle>
          <CardDescription className="text-center text-lg">
            Connect with South Africa&apos;s diverse student community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-4">
            <Label>I am a...</Label>
            <RadioGroup
              defaultValue="student"
              onValueChange={setUserType}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="cursor-pointer">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alumni" id="alumni" />
                <Label htmlFor="alumni" className="cursor-pointer">Alumni</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="human" id="human" />
                <Label htmlFor="human" className="cursor-pointer">Human</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email address" />
          </div>

          {userType === "student" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution Type</Label>
                <Select onValueChange={setInstitutionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="tvet">TVET College</SelectItem>
                    <SelectItem value="private">Private College</SelectItem>
                    <SelectItem value="high-school">High School (Grade 11-12)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {institutionType === "university" && (
                <div className="space-y-2">
                  <Label htmlFor="university">Select University</Label>
                  <Select>
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
                      <SelectItem value="nelson-mandela-university">Nelson Mandela University</SelectItem>
                      <SelectItem value="university-of-free-state">University of Free State</SelectItem>
                      <SelectItem value="tshwane-university-of-technology">Tshwane University of Technology</SelectItem>
                      <SelectItem value="cape-peninsula-university-of-technology">Cape Peninsula University of Technology</SelectItem>
                      <SelectItem value="durban-university-of-technology">Durban University of Technology</SelectItem>
                      <SelectItem value="vaal-university-of-technology">Vaal University of Technology</SelectItem>
                      <SelectItem value="central-university-of-technology">Central University of Technology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {institutionType === "tvet" && (
                <div className="space-y-2">
                  <Label htmlFor="tvet">Select TVET College</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your TVET college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false-bay">False Bay TVET College</SelectItem>
                      <SelectItem value="northlink">Northlink TVET College</SelectItem>
                      <SelectItem value="college-of-cape-town">College of Cape Town</SelectItem>
                      <SelectItem value="boland">Boland TVET College</SelectItem>
                      <SelectItem value="south-cape">South Cape TVET College</SelectItem>
                      <SelectItem value="west-coast">West Coast TVET College</SelectItem>
                      <SelectItem value="central-johannesburg">Central Johannesburg TVET College</SelectItem>
                      <SelectItem value="ekurhuleni-east">Ekurhuleni East TVET College</SelectItem>
                      <SelectItem value="ekurhuleni-west">Ekurhuleni West TVET College</SelectItem>
                      <SelectItem value="sedibeng">Sedibeng TVET College</SelectItem>
                      <SelectItem value="south-west-gauteng">South West Gauteng TVET College</SelectItem>
                      <SelectItem value="tshwane-north">Tshwane North TVET College</SelectItem>
                      <SelectItem value="tshwane-south">Tshwane South TVET College</SelectItem>
                      <SelectItem value="western-gauteng">Western TVET College</SelectItem>
                      <SelectItem value="coastal">Coastal TVET College</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="study-status">Study Status</Label>
                <Select onValueChange={setStudyStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your study status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospective">Prospective Student</SelectItem>
                    <SelectItem value="current">Current Student</SelectItem>
                    <SelectItem value="gap-year">Taking a Gap Year</SelectItem>
                    <SelectItem value="distance">Distance Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {studyStatus === "current" && (
                <div className="space-y-2">
                  <Label htmlFor="study-year">Study Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year of study" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first">First Year</SelectItem>
                      <SelectItem value="second">Second Year</SelectItem>
                      <SelectItem value="third">Third Year</SelectItem>
                      <SelectItem value="fourth">Fourth Year</SelectItem>
                      <SelectItem value="ancestor">Ancestor (4+ years)</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: "Ancestor" refers to students who have been in their program for more than 4 years due to module repeats
                  </p>
                </div>
              )}
            </>
          )}

          {userType === "alumni" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="graduation-year">Graduation Year</Label>
                <Input id="graduation-year" type="number" placeholder="Enter your graduation year" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study/Work</Label>
                <Input id="field" placeholder="e.g., Engineering, Business, Education" />
              </div>
            </>
          )}

          {userType === "human" && (
            <div className="space-y-2">
              <Label htmlFor="interest">Interest in Education</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent/Guardian</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="professional">Industry Professional</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a secure password"
                value={password}
                onChange={handlePasswordChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 8 characters long and include a number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {passwordError && (
                <p className="text-xs text-red-500 mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(value) => setCaptchaValue(value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!captchaValue || Boolean(passwordError) || !password || !confirmPassword}
          >
            Create Account
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
