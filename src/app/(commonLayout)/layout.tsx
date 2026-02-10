import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/ui/Footer";

 
export default function CommonLayout({children} : {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
      {children}
      <Footer />
    </div>
  )
}
