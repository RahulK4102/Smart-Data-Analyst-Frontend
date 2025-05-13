import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function POST(req:NextRequest){
    const{email, password} = await req.json();
    if(!email||!password){
        return NextResponse.json({message:"Missing email or password"},{status:400})
    }
    try {
        const user = await prismaClient.user.findUnique({
            where:{
                email: email
            }
        })
        console.log("user",user)
        if(!user){
            return NextResponse.json({message:"Invalid user"},{status:400})
        }
        const IsValidPass = await bcrypt.compare(password,user.password)
        if(!IsValidPass){
            return NextResponse.json({message:"Invalid password"},{status:400})
        }
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET!)
        const UserId = user.id;
        return NextResponse.json({message:"Login Successfully",token,UserId},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Internal Server Error"+error},{status:500})
    }
}