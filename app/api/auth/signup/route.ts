import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { FirstName, LastName, email, password } = await req.json();
  
  if (!FirstName || !LastName || !email || !password) {
    return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prismaClient.user.create({
      data: {
        firstName: FirstName,
        lastName: LastName,
        email:email,
        password: hashedPassword,
      }
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);

    return NextResponse.json({ message: "User created", token: token }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "User not created", error: error }, { status: 500 });
  }
}
