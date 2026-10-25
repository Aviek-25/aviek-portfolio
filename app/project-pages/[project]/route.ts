
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const projects: Record<string, string> = {
  "fin-map": "fin-map.html",
  devvault: "devvault.html",
  cyberpulse: "cyberpulse.html",
  kratos: "kratos.html",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ project: string }> }
) {
  const { project } = await context.params;
  const filename = projects[project];

  if (!filename) {
    return new NextResponse("Project not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), project, filename);
    const html = await readFile(filePath, "utf-8");

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Project page not found", { status: 404 });
  }
}
