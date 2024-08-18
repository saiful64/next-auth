import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(request);

    const user = await User.findOne({ email });

    // If the user is not found, return an error
    if (!user) {
      return NextResponse.json(
        { message: "User doesnot exist" },
        { status: 400 }
      );
    }

    // If the user is found, compare the password
    const isMatch = await bcryptjs.compare(password, user.password);

    // If the password does not match, return an error
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }
    console.log(user);

    // If the password matches, generate a token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    console.log(tokenData);

    // Sign the token
    const jwtSecret = process.env.JWT_SECRET || "defaultSecret"; // Provide a default value for JWT_SECRET
    const signToken = await jwt.sign(
      tokenData,
      jwtSecret!, // Add a '!' to tell TypeScript that jwtSecret is not null
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        return NextResponse.json({ token });
      }
    );

    console.log(jwtSecret, signToken);

    // Return a success message
    const res = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token in a cookie
    res.cookies.set("token", signToken!, {
      httpOnly: true, // Set the cookie as httpOnly to prevent XSS attacks from accessing the cookie
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
