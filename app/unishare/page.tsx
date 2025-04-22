import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function UniSharePage() {
  // Sample shared resources
  const sharedResources = [
    {
      title: "Intro to Physics - Complete Lecture Notes",
      university: "University of Cape Town",
      subject: "Physics 101",
      uploader: "Thabo M.",
      uploadDate: "Mar 15, 2025",
      downloads: 345,
      format: "PDF",
      fileSize: "4.2 MB",
      tags: ["Physics", "First Year", "Comprehensive"]
    },
    {
      title: "Economics Exam Preparation Guide",
      university: "Stellenbosch University",
      subject: "Economics 202",
      uploader: "Lerato K.",
      uploadDate: "Mar 10, 2025",
      downloads: 213,
      format: "PDF",
      fileSize: "3.1 MB",
      tags: ["Economics", "Second Year", "Exam Prep"]
    },
    {
      title: "Computer Science: Data Structures & Algorithms",
      university: "University of the Witwatersrand",
      subject: "COMS2013",
      uploader: "Sipho N.",
      uploadDate: "Mar 5, 2025",
      downloads: 567,
      format: "PDF & Code Samples",
      fileSize: "10.3 MB",
      tags: ["Computer Science", "Second Year", "Programming"]
    },
    {
      title: "Introduction to Literary Theory - Study Guide",
      university: "University of Pretoria",
      subject: "English Literature 101",
      uploader: "Nomsa Z.",
      uploadDate: "Mar 2, 2025",
      downloads: 119,
      format: "PDF",
      fileSize: "2.8 MB",
      tags: ["Literature", "First Year", "Theory"]
    },
    {
      title: "Organic Chemistry Reaction Mechanisms",
      university: "Rhodes University",
      subject: "Chemistry 202",
      uploader: "Michael D.",
      uploadDate: "Feb 25, 2025",
      downloads: 298,
      format: "PDF",
      fileSize: "7.5 MB",
      tags: ["Chemistry", "Second Year", "Organic"]
    },
    {
      title: "Introduction to South African Law - Course Summary",
      university: "University of Cape Town",
      subject: "Law 101",
      uploader: "Andile M.",
      uploadDate: "Feb 20, 2025",
      downloads: 156,
      format: "PDF",
      fileSize: "5.2 MB",
      tags: ["Law", "First Year", "Summary"]
    }
  ];

  // Sample textbooks
  const textbooks = [
    {
      title: "Principles of Economics (7th Edition)",
      author: "Gregory Mankiw",
      condition: "Good",
      price: "R350",
      location: "Cape Town",
      seller: "Thandi P.",
      listedDate: "Mar 18, 2025",
      tags: ["Economics", "Textbook"]
    },
    {
      title: "Campbell Biology (11th Edition)",
      author: "Lisa Urry, Michael Cain",
      condition: "Like New",
      price: "R500",
      location: "Johannesburg",
      seller: "James M.",
      listedDate: "Mar 14, 2025",
      tags: ["Biology", "Textbook", "Science"]
    },
    {
      title: "Introduction to Algorithms (3rd Edition)",
      author: "Thomas Cormen, Charles Leiserson",
      condition: "Acceptable",
      price: "R280",
      location: "Pretoria",
      seller: "Nomvula K.",
      listedDate: "Mar 10, 2025",
      tags: ["Computer Science", "Algorithms", "Textbook"]
    },
    {
      title: "Advanced Financial Accounting (8th Edition)",
      author: "Richard Baker",
      condition: "Good",
      price: "R320",
      location: "Durban",
      seller: "Samuel N.",
      listedDate: "Mar 5, 2025",
      tags: ["Accounting", "Finance", "Textbook"]
    }
  ];

  return (
    <div className="container py-8 md:py-12 pattern-container">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">UniShare</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Share and access study materials, textbooks, and resources with students across South Africa
          </p>
        </div>

        <Tabs defaultValue="resources" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="w-full max-w-md grid grid-cols-2">
              <TabsTrigger value="resources">Study Resources</TabsTrigger>
              <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recently Shared Resources</h2>
              <Button>Upload Resource</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedResources.map((resource, index) => (
                <Card key={index} className="pattern-card h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline" className="dark:bg-brand-purple/10">{resource.format}</Badge>
                    </div>
                    <CardDescription>{resource.university} • {resource.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>Uploaded by {resource.uploader} on {resource.uploadDate}</p>
                      <p className="mt-1">{resource.downloads} downloads • {resource.fileSize}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">Download</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Resources</Button>
            </div>
          </TabsContent>

          <TabsContent value="textbooks" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Textbooks for Sale</h2>
              <Button>List Textbook</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {textbooks.map((book, index) => (
                <Card key={index} className="pattern-card h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <Badge className="bg-primary/80 hover:bg-primary">{book.price}</Badge>
                    </div>
                    <CardDescription>By {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {book.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="ml-2 font-medium">{book.condition}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="ml-2 font-medium">{book.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Seller:</span>
                        <span className="ml-2 font-medium">{book.seller}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Listed:</span>
                        <span className="ml-2 font-medium">{book.listedDate}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full">Contact Seller</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline">View All Textbooks</Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-14 text-center">
          <Card className="pattern-card p-6 max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>UniShare Community Guidelines</CardTitle>
              <CardDescription>
                Our sharing platform is built on respect, integrity, and supporting fellow students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <h3 className="font-medium">✅ Do Share</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Your personal notes, summaries, and study guides</li>
                  <li>Past exams and assignment examples (that are publicly released)</li>
                  <li>Helpful resources and reference materials</li>
                  <li>Second-hand textbooks at fair prices</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">❌ Don't Share</h3>
                <ul className="list-disc pl-5 text-muted-foreground text-sm mt-1">
                  <li>Confidential or copyright-protected materials</li>
                  <li>Current assignment solutions or test answers</li>
                  <li>Resources that violate your university's academic integrity policies</li>
                  <li>Materials with personal information of other students</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
