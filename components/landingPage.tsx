'use client'

import React from "react"
import { SparklesCore } from '@/components/ui/sparkles'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { LampContainer } from '@/components/ui/lamp'
import { Button } from "@/components/ui/button"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import Link from "next/link"

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

const teamMembers = [
  {
    id: 1,
    name: "Rahul Kumar",
    designation: "",
    image: "https://avatars.githubusercontent.com/u/119075798"
  },
  {
    id: 2,
    name: "Vansh Kanakia",
    designation: "",
    image: "https://media.licdn.com/dms/image/v2/D4D35AQHLBRSHmSfznA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1711536731194?e=1729544400&v=beta&t=athYniOEQ8uzusP5kCwUWzFADWEmVlVCn7VygCLfuaY"
  },
  {
    id: 3,
    name: "Vinay Gavhane",
    designation: "",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQG_KH_L-orl_A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1700839448643?e=1734566400&v=beta&t=bCbtMSAAoiMSWppqiTA1KvrASoUAPS2DkbZklDOlG4M"
  },
  {
    id: 4,
    name: "Pritesh Jadhav",
    designation: "",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQGY3s0F2HFxUw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721510973136?e=1734566400&v=beta&t=7cACscqiUgri7RmA3QwJ6xsqdWteqUw4kguNTWa4zO0"
  },
];

const features = [
  {
    title: "Advanced Analytics",
    description: "Leverage cutting-edge algorithms to extract meaningful patterns from your data.",
    link: "#"
  },
  {
    title: "Automated Reporting",
    description: "Generate comprehensive reports with a single click, saving time and effort.",
    link: "#"
  },
  {
    title: "Interactive Visualizations",
    description: "Create stunning, interactive charts and graphs to communicate your findings effectively.",
    link: "#"
  },
  {
    title: "Real-time Insights",
    description: "Get instant updates and alerts on your data trends and anomalies.",
    link: "#"
  },
  {
    title: "AI-Powered Predictions",
    description: "Utilize machine learning models to forecast future trends and outcomes.",
    link: "#"
  },
  {
    title: "Customizable Dashboards",
    description: "Build personalized dashboards tailored to your specific business needs.",
    link: "#"
  },
];

export default function LandingPage() {
  const words = [
    {
      text: "Smart",
    },
    {
      text: "Data",
    },
    {
      text: "Analysis",
    },
    {
      text: "and",
    },
    {
      text: "Reporting",
    },
    {
      text: "System",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      <header className="p-6 z-10">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Data Analyst</h1>
          <ul className="flex space-x-4">
            <li><a href="#features" className="hover:text-blue-400">Features</a></li>
            <li><a href="#about" className="hover:text-blue-400">About</a></li>
            <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <LampContainer>
          <TypewriterEffect words={words} />
        </LampContainer>

        <div className="mt-8 max-w-2xl text-center">
          <TextGenerateEffect words="Unlock the power of your data with our advanced analysis and reporting tools. Transform complex datasets into actionable insights effortlessly." />
        </div>

        <Link href={"/signup"} className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold transition-colors duration-300">
          Get Started
        </Link>

        <section id="features" className="mt-20 w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <HoverEffect items={features} />
        </section>

        <section id="about" className="mt-20 w-full max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">About Us</h2>
          <p className="mb-8">
            At Smart Data Analyst, we&apos;re passionate about transforming raw data into actionable insights. 
            Our team of experts is dedicated to providing cutting-edge solutions for businesses of all sizes.
          </p>
          <div className="flex justify-center gap-10">
            <AnimatedTooltip items={teamMembers} />
          </div>
        </section>

        <section id="contact" className="mt-20 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <form className="space-y-3">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm">Name</label>
              <input type="text" id="name" className="w-full p-2 rounded bg-gray-800 text-white text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm">Email</label>
              <input type="email" id="email" className="w-full p-2 rounded bg-gray-800 text-white text-sm" />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 text-sm">Message</label>
              <textarea id="message" rows={3} className="w-full p-2 rounded bg-gray-800 text-white text-sm"></textarea>
            </div>
            <Button className="w-full text-sm">Send Message</Button>
          </form>
        </section>
      </main>

      <footer className="p-6 text-center relative">
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
        <p className="text-xl font-semibold relative z-10">
          Ready to revolutionize your data analysis?
        </p>
        <p className="mt-2 relative z-10">© 2024 Smart Data Analyst. All rights reserved.</p>
      </footer>
    </div>
  )
}