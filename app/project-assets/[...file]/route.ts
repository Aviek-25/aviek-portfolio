
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const allowedFolders = [
  "fin-map",
  "devvault",
  "cyberpulse",
  "kratos",
];

const allowedRootFiles = [
  "project-pages.css",
  "project-pages.js",
];

const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ file: string[] }> }
) {
  const { file } = await context.params;

  if (!file?.length || file.some((part) =>
    !part || part === "." || part === ".."
  )) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const isSharedFile =
    file.length === 1 && allowedRootFiles.includes(file[0]);

  const isProjectFile =
    file.length >= 2 && allowedFolders.includes(file[0]);

  if (!isSharedFile && !isProjectFile) {
    return new NextResponse("Not found", { status: 404 });
  }

  const baseDirectory = process.cwd();
  const filePath = path.resolve(baseDirectory, ...file);

  if (!filePath.startsWith(baseDirectory + path.sep)) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  try {
    const content = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    return new NextResponse(content, {
      headers: {
        "Content-Type":
          mimeTypes[extension] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Asset not found", { status: 404 });
  }
}
