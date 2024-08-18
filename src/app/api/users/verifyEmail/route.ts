import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    // Get the token from the request body
    const reqBody = await request.json();
    const { token } = reqBody;

    // Find the user with the token
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // If the user is found, update the user's isVerified field to true
    // and remove the verifyToken and verifyTokenExpiry fields
    // If the user is not found, return an error
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }
    user.idVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    // Save the user
    await user.save();
    // Return a success message
    return NextResponse.json({ message: "Email verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
