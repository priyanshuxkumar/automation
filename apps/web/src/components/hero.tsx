import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="py-24 container mx-auto">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
          <span className="font-medium">New</span>
          <span className="ml-2">Zapier Enterprise is here →</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tight">
          Automate
          <br />
          without limits
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Turn chaos into smooth operations by automating workflows yourself—no developers, no IT tickets, no delays. The only limit is your imagination.
        </p>
        <div className="flex gap-4">
          <Button size="lg">
            Start free with email
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Image src={'https://workflows-dev-p.s3.ap-south-1.amazonaws.com/google.svg'} width={20} height={20} alt="google-icon"/>
            Start free with Google
          </Button>
        </div>
      </div>
    </section>
  )
}

