
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { EdgeStoreProvider } from "@/app/lib/edgestore";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha384-C3jD4Y5uG1DJHf1LPn2s5shW3RGl6eZf/b8up0AdWk5ATeXtFk6KDnOby0aRFOhG"
          crossOrigin="anonymous"
        />
        
      </head>
      <body
        className="bg-gray-900 font-sans"
      >

         <Navbar />
         <EdgeStoreProvider>
        {children}
        </EdgeStoreProvider>
        <Footer/>
      </body>
    </html>
  );
}
