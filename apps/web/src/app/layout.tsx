import { Geist, Geist_Mono } from "next/font/google";
import { SanityLive } from "@/lib/sanity/live";
import { VisualEditing } from "next-sanity";
import { revalidatePath, revalidateTag } from "next/cache";
import { draftMode } from "next/headers";
import { Navbar } from "@/components/navbar";

import "@workspace/ui/globals.css";



const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Navbar />
        {(await draftMode()).isEnabled ? (
          <>
            {children}
            {/* <PreviewBar /> */}
            <VisualEditing
              refresh={async (payload) => {
                "use server";
                if (payload.source === "manual") {
                  revalidatePath("/", "layout");
                  return;
                }
                const tags = [
                  payload?.document?.slug?.current,
                  payload?.document?._id?.startsWith("drafts.")
                    ? payload?.document?._id.slice(7)
                    : payload?.document?._id,
                  payload?.document?._type,
                ];
                for (const tag of tags) {
                  if (tag) revalidateTag(tag);
                }
              }}
            />
          </>
        ) : (
          children
        )}
        <SanityLive />
      </body>
    </html>
  );
}
