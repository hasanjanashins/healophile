
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import MedicalFileGallery from "@/components/MedicalFileGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Files = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6 text-center">Medical Files</h1>
        
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="view">View Files</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="mt-0">
            <MedicalFileGallery />
          </TabsContent>
          <TabsContent value="upload" className="mt-0">
            <FileUpload />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Files;
