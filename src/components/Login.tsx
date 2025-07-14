"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

const images = [
  "/images/slide1.jpg",
  "/images/slide2.jpg",
];

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return;

    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid email or password. Please check your credentials and try again.")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // CHANGE 1: Use flex-col by default and switch to flex-row on medium screens (md) and up.
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* CHANGE 2: Hide the slideshow on small screens (hidden) and show it as a block on medium screens. */}
      <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* CHANGE 3: Make the form take up the full width (w-full) on small screens. */}
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center bg-gradient-to-br from-[#71b60f] to-[#00a99d]">
        {/* The Card component is already responsive due to `w-full` and `max-w-md` */}
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Payment Service</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full text-white bg-[#7dc400] hover:bg-[#5a9a00] transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-gray-600">
                <p>User:<b> user@chapa.co</b></p>
                <p>Admin: <b>admin@chapa.co</b></p>
                <p>Super Admin: <b>superadmin@chapa.co</b></p>
                <p className="mt-2">Password: <b>password123</b></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
