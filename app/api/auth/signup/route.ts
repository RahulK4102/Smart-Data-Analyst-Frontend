import { NextRequest, NextResponse } from "next/server";
import {prismaClient} from "@/lib/db"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req:NextRequest){
    const{FirstName,LastName,email,password} = await req.json();
    console.log(FirstName,LastName,email,password);
    if(!FirstName || !LastName || !email || !password){
        return NextResponse.json({message:"missing required parameters"},{status: 404});
    }
    try {
        const existingUser = prismaClient.user.findFirst({
            where:{
                email: email
            }
        }) 
        if(!existingUser){
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }
            const hashedPassword = await bcrypt.hash(password,10)
            const users = await prismaClient.user.create({
                data:{
                    firstName:FirstName,
                    lastName:LastName,
                    email,
                    password:hashedPassword,
                }
            })
            console.log("user",users);
            const token = jwt.sign({userId:users.id},process.env.JWT_SECRET!)
            return NextResponse.json({message:"User created",token:token},{status:201});
    } catch (error) {
        return NextResponse.json({message:"User Not Created"+error},{status:500});
    }
}