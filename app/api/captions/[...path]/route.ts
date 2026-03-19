import { NextRequest, NextResponse } from "next/server"

const VTT_ORIGIN = "https://videos.terramore.io"
const ALLOWED_PREFIX = "Foundations_Portrait_Mar1426_"
const ALLOWED_EXT = ".vtt"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await context.params
  const filename = pathSegments?.join("/") ?? ""

  if (
    !filename ||
    pathSegments.length !== 1 ||
    !filename.startsWith(ALLOWED_PREFIX) ||
    !filename.toLowerCase().endsWith(ALLOWED_EXT)
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const res = await fetch(`${VTT_ORIGIN}/${filename}`, {
      headers: { Accept: "text/vtt" },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "Caption not found" },
        { status: res.status }
      )
    }

    const body = await res.text()
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to load captions" },
      { status: 502 }
    )
  }
}
