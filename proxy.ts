import { NextRequest, NextResponse } from "next/server";
import { isValidBasicAuth } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (isValidBasicAuth(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("Not authorized\n", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted Area"' },
  });
}

export const config = {
  matcher: ["/reservations/:path*", "/api/reservations/:id/status"],
};
