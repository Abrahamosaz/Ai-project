import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Automatisch-clone",
  description: "Automate your workflow process",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {" "}
        <ReactQueryProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                border: "1px solid #E4E7EC",
                borderRadius: 15,
                padding: "16px",
                color: "#000",
                fontSize: 15,
                fontWeight: 400,
              },
              duration: 2000,
            }}
          />
          <div className=""> {children}</div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
