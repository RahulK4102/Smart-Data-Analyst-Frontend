'use client'

import React, { FormEvent, useState } from "react"
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import Link from "next/link"
import { SparklesCore } from "@/components/ui/sparkles"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // Implement your login logic here
      router.push('/DashBoard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                <IconBrandGithub className="w-5 h-5 mr-2" />
                GitHub
              </Button>
              <Button
                type="button"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                <IconBrandGoogle className="w-5 h-5 mr-2" />
                Google
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full h-24 absolute bottom-0 left-0">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
    </div>
  )
}