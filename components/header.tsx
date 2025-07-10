import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users, Milestone } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">LifeConnect</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/timeline" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Timeline
            </Link>
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Users className="h-6 w-6" />
                <span className="font-bold">LifeConnect</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                <Link href="/timeline" className="flex items-center space-x-2">
                  <Milestone className="h-5 w-5" />
                  <span>Timeline</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Future search bar can go here */}</div>
          <nav className="flex items-center">
            <Button variant="ghost">Log In</Button>
            <Button>Sign Up</Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
