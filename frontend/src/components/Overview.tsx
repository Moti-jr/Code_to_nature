"use client"

import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Leaf, Code, TreePine, Award } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Leaf className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-green-800 mb-4 text-balance">Code-to-Nature</h1>
          <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto text-pretty">
            Turn your coding hours into eco-credits by verifying outdoor activities. Code more, explore nature, make a
            difference.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <Code className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-800">Log Coding Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Track your coding sessions and earn locked eco-credits for every hour you code.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-800">Outdoor Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Verify outdoor activities like hiking, park cleanups, or tree planting to unlock your credits.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-800">Redeem Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Use your eco-credits to plant trees, offset carbon, or get eco-friendly products.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
