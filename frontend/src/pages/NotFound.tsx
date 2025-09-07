// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";

// const NotFound = () => {
//   const location = useLocation();

//   useEffect(() => {
//     console.error(
//       "404 Error: User attempted to access non-existent route:",
//       location.pathname
//     );
//   }, [location.pathname]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold mb-4">404</h1>
//         <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
//         <a to="/" className="text-blue-500 hover:text-blue-700 underline">
//           Return to Home
//         </a>
//       </div>
//     </div>
//   );
// };

// export default NotFound;


"use client"

import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Home, TreePine, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 404 Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-green-600">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 text-balance">Oops! You've wandered off the trail</h2>
            <p className="text-gray-600 text-lg text-pretty max-w-md mx-auto">
              The page you're looking for doesn't exist. Let's get you back to nature and your coding journey.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
            >
              <Link to="/dashboard" className="flex items-center gap-2">
                <TreePine className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>

            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-green-600 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Additional helpful links */}
          <div className="pt-8 border-t border-green-100">
            <p className="text-sm text-gray-500 mb-4">Popular destinations:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/coding" className="text-sm text-green-600 hover:text-green-700 underline">
                Log Coding Hours
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/activities" className="text-sm text-green-600 hover:text-green-700 underline">
                Track Activities
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/rewards" className="text-sm text-green-600 hover:text-green-700 underline">
                Rewards Store
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/leaderboard" className="text-sm text-green-600 hover:text-green-700 underline">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

