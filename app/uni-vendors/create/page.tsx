"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreateVendorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    university: "",
    location: "",
    categories: [] as string[],
    contactPhone: "",
    contactWhatsapp: "",
    meetingPreference: "campus",
    bankingDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      accountType: ""
    },
    sellingTypes: [] as string[],
    sellingReason: "",
    termsAccepted: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleSellingTypeToggle = (type: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sellingTypes: checked
        ? [...prev.sellingTypes, type]
        : prev.sellingTypes.filter(t => t !== type)
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This would normally make an API request to create a vendor
    // For demo purposes, we're just showing a loading state
    setTimeout(() => {
      setIsLoading(false);
      alert("Your vendor profile has been created successfully!");
      // Redirect to vendor dashboard or success page
    }, 1500);
  };

  // South African Universities list
  const universities = [
    { value: "uct", label: "University of Cape Town (UCT)" },
    { value: "wits", label: "University of the Witwatersrand (Wits)" },
    { value: "up", label: "University of Pretoria (UP)" },
    { value: "ukzn", label: "University of KwaZulu-Natal (UKZN)" },
    { value: "uj", label: "University of Johannesburg (UJ)" },
    { value: "su", label: "Stellenbosch University" },
    { value: "uwc", label: "University of the Western Cape (UWC)" },
    { value: "unisa", label: "University of South Africa (UNISA)" },
    { value: "nwu", label: "North-West University (NWU)" },
    { value: "ru", label: "Rhodes University" },
    { value: "other", label: "Other Institution" }
  ];

  // Product categories
  const productCategories = [
    { id: "textbooks", name: "Textbooks", icon: "📚", description: "New and used textbooks, course readers, etc." },
    { id: "stationery", name: "Stationery & Supplies", icon: "✏️", description: "Notebooks, pens, calculators, etc." },
    { id: "food", name: "Food & Snacks", icon: "🍎", description: "Homemade meals, snacks, beverages, etc." },
    { id: "electronics", name: "Electronics", icon: "💻", description: "Laptops, phones, chargers, accessories, etc." },
    { id: "clothing", name: "Clothing & Accessories", icon: "👕", description: "University apparel, bags, etc." },
    { id: "services", name: "Academic Services", icon: "📝", description: "Tutoring, editing, printing, etc." },
  ];

  // South African banks
  const banks = [
    { value: "absa", label: "ABSA" },
    { value: "capitec", label: "Capitec Bank" },
    { value: "fnb", label: "First National Bank (FNB)" },
    { value: "nedbank", label: "Nedbank" },
    { value: "standardbank", label: "Standard Bank" },
    { value: "africanbank", label: "African Bank" },
    { value: "tymebank", label: "TymeBank" },
    { value: "discovery", label: "Discovery Bank" },
    { value: "other", label: "Other Bank" }
  ];

  // Account Types
  const accountTypes = [
    { value: "savings", label: "Savings Account" },
    { value: "cheque", label: "Cheque Account" },
    { value: "current", label: "Current Account" },
    { value: "ewallet", label: "eWallet / Mobile Money" },
    { value: "other", label: "Other" }
  ];

  // Selling reasons
  const sellingReasons = [
    { id: "extra-income", label: "Extra Income" },
    { id: "tuition", label: "Pay for Tuition" },
    { id: "accommodation", label: "Pay for Accommodation" },
    { id: "books", label: "Pay for Books & Materials" },
    { id: "food", label: "Pay for Food & Living Expenses" },
    { id: "transport", label: "Pay for Transport" },
    { id: "business", label: "Build a Small Business" },
    { id: "help-others", label: "Help Other Students" },
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/uni-vendors"
        className="flex items-center text-sm text-zinc-500 mb-8 hover:text-zinc-800"
        legacyBehavior>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to UniVendors
      </Link>
      <Card>
        <CardHeader className="text-center border-b pb-8">
          <div className="flex justify-center mb-4">
            <Badge className="bg-emerald-600">New</Badge>
          </div>
          <CardTitle className="text-3xl font-bold">Become a UniVendor</CardTitle>
          <CardDescription className="text-lg mt-2">
            Turn your skills and resources into income while helping fellow students
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>1</div>
              <div className={`h-1 flex-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-zinc-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-emerald-600 text-white' : step > 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>2</div>
              <div className={`h-1 flex-1 ${step >= 3 ? 'bg-emerald-600' : 'bg-zinc-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-emerald-600 text-white' : step > 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-200 text-zinc-500'}`}>3</div>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Business Information</span>
              <span>Products & Services</span>
              <span>Payment & Review</span>
            </div>
          </div>

          {/* Step 1: Business Information */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Tell Us About Your Business</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="e.g., Thandi's Textbooks, Campus Snacks, etc."
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what you sell and what makes it unique for students..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">Your University/Institution</Label>
                    <Select onValueChange={(value) => handleSelectChange("university", value)}>
                      <SelectTrigger id="university">
                        <SelectValue placeholder="Select your institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map(uni => (
                          <SelectItem key={uni.value} value={uni.value}>{uni.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location on Campus</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Student Center, Library Entrance, etc."
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>What do you sell or offer? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productCategories.map(category => (
                      <div key={category.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          onCheckedChange={(checked) =>
                            handleCategoryToggle(category.id, checked as boolean)
                          }
                          checked={formData.categories.includes(category.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            <span className="mr-1">{category.icon}</span> {category.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Why are you selling on campus? (Select all that apply)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sellingReasons.map(reason => (
                      <div key={reason.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`reason-${reason.id}`}
                          onCheckedChange={(checked) =>
                            handleSellingTypeToggle(reason.id, checked as boolean)
                          }
                          checked={formData.sellingTypes.includes(reason.id)}
                        />
                        <label
                          htmlFor={`reason-${reason.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {reason.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellingReason">Tell us your story (Optional)</Label>
                  <Textarea
                    id="sellingReason"
                    name="sellingReason"
                    placeholder="Share why you started selling and how it helps you as a student..."
                    value={formData.sellingReason}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={nextStep}>Continue to Products & Services</Button>
              </div>
            </div>
          )}

          {/* Step 2: Products & Services */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact & Meeting Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone Number</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      placeholder="e.g., 071 234 5678"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactWhatsapp">WhatsApp Number (Optional)</Label>
                    <Input
                      id="contactWhatsapp"
                      name="contactWhatsapp"
                      placeholder="Leave blank if same as phone number"
                      value={formData.contactWhatsapp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Meeting Method</Label>
                  <RadioGroup defaultValue="campus" className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="campus"
                        id="meeting-campus"
                        checked={formData.meetingPreference === "campus"}
                        onClick={() => handleSelectChange("meetingPreference", "campus")}
                      />
                      <Label htmlFor="meeting-campus" className="font-normal">On campus (specific location)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="residence"
                        id="meeting-residence"
                        checked={formData.meetingPreference === "residence"}
                        onClick={() => handleSelectChange("meetingPreference", "residence")}
                      />
                      <Label htmlFor="meeting-residence" className="font-normal">Residence/Accommodation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="delivery"
                        id="meeting-delivery"
                        checked={formData.meetingPreference === "delivery"}
                        onClick={() => handleSelectChange("meetingPreference", "delivery")}
                      />
                      <Label htmlFor="meeting-delivery" className="font-normal">I offer delivery around campus</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Safety Tips for Student Vendors
                  </h4>
                  <ul className="text-sm text-zinc-700 space-y-1">
                    <li>• Always meet buyers in public, well-lit areas on campus</li>
                    <li>• Let someone know when and where you're meeting a buyer</li>
                    <li>• Consider bringing a friend for larger transactions</li>
                    <li>• Be cautious with payments - cash is recommended for small sales</li>
                    <li>• Trust your instincts - if something feels off, cancel the meeting</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue to Payment & Review</Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment & Review */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Payment Information & Terms</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Banking Details (Optional)</h4>
                  <p className="text-sm text-zinc-600 mb-4">
                    Adding banking details allows buyers to make EFT payments. This information is encrypted and not shown to other users.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        name="accountHolderName"
                        placeholder="Your full name as on bank account"
                        value={formData.bankingDetails.accountHolderName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          bankingDetails: {
                            ...prev.bankingDetails,
                            accountHolderName: e.target.value
                          }
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        bankingDetails: {
                          ...prev.bankingDetails,
                          bankName: value
                        }
                      }))}>
                        <SelectTrigger id="bankName">
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map(bank => (
                            <SelectItem key={bank.value} value={bank.value}>{bank.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="Your account number"
                        value={formData.bankingDetails.accountNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          bankingDetails: {
                            ...prev.bankingDetails,
                            accountNumber: e.target.value
                          }
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        bankingDetails: {
                          ...prev.bankingDetails,
                          accountType: value
                        }
                      }))}>
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Payment Guidelines
                  </h4>
                  <ul className="text-sm text-zinc-700 space-y-1">
                    <li>• For items under R500, cash payments are recommended</li>
                    <li>• For larger amounts, SnapScan, Zapper, or bank transfers are safer</li>
                    <li>• Always verify that payment has cleared before handing over items</li>
                    <li>• Consider offering a digital receipt option (e.g., email confirmation)</li>
                    <li>• Be transparent about your prices and payment methods upfront</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("termsAccepted", checked as boolean)
                      }
                      required
                    />
                    <div>
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the UniVendors Terms and Conditions
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        This includes following your university's rules regarding on-campus selling activities,
                        maintaining respectful communication with buyers, and ensuring the quality of your products/services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.termsAccepted}
                >
                  {isLoading ? "Creating your vendor profile..." : "Create Vendor Profile"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-10 border-t pt-6">
        <h3 className="font-semibold mb-4">About UniVendors</h3>
        <p className="text-sm text-zinc-600 mb-4">
          UniVendors is a marketplace created by and for South African university students. We understand the financial challenges many students face and created this platform to help students earn money while providing affordable goods and services to their peers.
        </p>
        <p className="text-sm text-zinc-600">
          Our mission is to support student entrepreneurship, promote campus community, and help alleviate financial burdens through student-to-student commerce.
        </p>
      </div>
    </div>
  );
}
