import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const redirectUrl = params.get("redirectUrl") || "/";

  (await draftMode()).disable();
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
