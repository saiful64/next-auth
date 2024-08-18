import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function POST(request: NextRequest) {
  try {
    //extract data from token
    const userId = await getDataFromToken(request);

    //find user by id and return it without password
    const user = User.findOne({ _id: userId }).select("-password ");

    //return user
    return NextResponse.json({
      message: "User Found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
