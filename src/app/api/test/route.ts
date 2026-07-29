import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    headers: Object.fromEntries(request.headers.entries())
  });
}

export async function POST() {
  const response = await fetch("http://localhost:3001/api/test", {
    method: "GET",
    headers: {
      "Cookie": "test_cookie=123",
      "User-Agent": "test-agent"
    }
  });

  const data = await response.json();
  return NextResponse.json({ sent_headers: data.headers });
}
