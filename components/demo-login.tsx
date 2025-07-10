"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

export function DemoLogin() {
  const handleDemoLogin = () => {
    // For demo purposes, we'll use a mock sign-in
    toast.success("Demo login successful! Redirecting to dashboard...")
    
    // Simulate a successful login by redirecting to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Demo Mode</CardTitle>
        <CardDescription>
          OAuth providers are not configured. Use demo login to test the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleDemoLogin}
          className="w-full"
          size="lg"
        >
          Demo Login
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This bypasses authentication for demo purposes
        </p>
      </CardContent>
    </Card>
  )
} 