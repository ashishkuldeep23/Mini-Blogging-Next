import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/providers";
import { Toaster } from "react-hot-toast";
import LogInProvider from "./components/LogInProvider";
import Modal from "./components/ModalComponent";
import PusherTestDiv from "./components/PusherJs";
import MainLoader from "./components/MainLoader";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini blogging site",
  description: "Read, create and share blogs",
  icons: {
    icon: 'https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png', // /public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <Providers>

          <LogInProvider>


            {/* Modal component */}
            <Modal />

            {/* Now i'm going to user pusher ------> */}
            {/* Pusher working code -----------> */}
            <PusherTestDiv
              channelName='ashish'
            />



            {/* Hot toster ---> */}
            <div><Toaster /></div>

            {children}

          </LogInProvider>

        </Providers>
      </body>
    </html>
  );
}
