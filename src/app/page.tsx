import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react"
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Secure PDF Storage",
    description: "Store your important PDF documents securely in the cloud, ensuring safe and reliable access anytime.",
    icon: GlobeIcon
  },
  {
    name: "AI-Powered Insights",
    description: "Leverage advanced AI to organize, search, and retrieve your PDFs with ease.",
    icon: BrainCogIcon
  },
  {
    name: "Cloud Backup & Sync",
    description: "Automatically back up your PDFs and sync them across all your devices effortlessly.",
    icon: EyeIcon
  },
  {
    name: "Cross-Device Compatibility",
    description: "Access your PDFs seamlessly on desktop, tablet, and mobile with a fully responsive design.",
    icon: ZapIcon
  },
  {
    name: "Advanced File Management",
    description: "Organize your PDFs with intelligent categorization and a user-friendly interface.",
    icon: ServerCogIcon
  },
  {
    name: "Lightning-Fast Performance",
    description: "Experience rapid uploads, instant previews, and smooth navigation for an efficient workflow.",
    icon: MonitorSmartphoneIcon
  }
]

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl  from-white to-blue-800">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Your Interactive Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Let Your Documents Speak with AI Magic
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-blue-600">PDF Speak Pro</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Qs. Ideal for
              everyone, <span className="text-blue-600">
                PDF Speak Pro
              </span>{" "}
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          <Button asChild className="mt-1">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.ibb.co/sp8x9qBW/Screen-Shot-2025-02-27-at-22-08-14.png"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-3xl ring-1 ring-gray-900/10"
            />
            {/* this div is to give a blur effect at the bottom */}
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        {/* map section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6
          gap=y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16
          ">
            {features.map(feature => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  />
                </dt>
                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </main>
  );
}
