import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { reservationStatuses } from "@/lib/constants";
import { ensureDatabase, prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest())) {
    return new NextResponse("Not authorized\n", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted Area"' },
    });
  }

  await ensureDatabase();

  const { id } = await context.params;
  const form = await _request.formData();
  const status = Number(form.get("status"));

  if (!(status in reservationStatuses)) {
    return NextResponse.redirect(new URL("/reservations", _request.url));
  }

  await prisma.reservation.update({
    where: { id: Number(id) },
    data: { status },
  });

  return NextResponse.redirect(new URL("/reservations", _request.url));
}
