import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("test");

    console.log(reqBody); // To check if the request body is being received

    // Basic response for testing
    return NextResponse.json({ message: "Login route is working" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
