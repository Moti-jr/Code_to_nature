"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Trophy, Medal, Award, Crown, Coins } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LeaderboardUser {
  rank: number;
  user_id: number;
  username: string;
  eco_credits: number;
  current_streak: number;
  longest_streak: number;
  github_username?: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  // --- Fetch leaderboard ---
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${API_BASE_URL}/leaderboard/friends/`
        ); // ⚡ adjust for prod
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.data.leaderboard);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />;
      default:
        return (
          <span className="text-sm sm:text-lg font-bold text-gray-600">
            #{rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
      default:
        return "bg-white border-green-200";
    }
  };

  // Find the current user in the leaderboard
const currentUserEntry = leaderboard.find(
  (u) => u.user_id === user?.user
) || null;

const currentUserRank = currentUserEntry?.rank ?? null

const showUserSeparately = !!(user && currentUserRank && currentUserRank > 10)

const displayLeaderboard = () => {
  if (!leaderboard.length) return []
  const top10 = leaderboard.slice(0, 10)

  if (showUserSeparately && currentUserEntry) {
    return [...top10, currentUserEntry]
  }
  return top10
}

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 flex items-center">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
          Leaderboard
        </h1>
        <p className="text-sm sm:text-base text-green-600">
          See how you rank among fellow eco-coders in the community!
        </p>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-green-600">Loading leaderboard...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Current User Highlight */}
      {user && currentUserEntry && (
        <Card className="mb-6 sm:mb-8 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full">
                  {getRankIcon(currentUserEntry.rank)}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-green-800">
                    {user.github_username}
                  </h2>
                  <p className="text-xs sm:text-sm text-green-600">
                    Rank #{currentUserEntry.rank}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xl sm:text-2xl font-bold text-green-800">
                    {currentUserEntry.eco_credits}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-green-600">eco-credits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {!loading && leaderboard.length > 0 && (
        <Card className="border-green-200">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl text-green-800">
              Top Eco-Coders
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Rankings based on total eco-credits earned through coding and
              outdoor activities
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              {displayLeaderboard().map((leaderUser, index, arr) => {
                const isCurrentUser = leaderUser.user_id === user?.id;
                const isUserShownSeparately =
                  showUserSeparately &&
                  index === arr.length - 1 &&
                  isCurrentUser;

                return (
                  <div key={leaderUser.rank}>
                    {isUserShownSeparately && (
                      <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-xs text-gray-500 bg-white">
                          Your Rank
                        </span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all ${getRankColor(
                        leaderUser.rank
                      )} ${isCurrentUser ? "ring-2 ring-green-300" : ""}`}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12">
                          {getRankIcon(leaderUser.rank)}
                        </div>

                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarFallback className="bg-green-100 text-green-800 text-xs sm:text-sm">
                            {leaderUser.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="max-w-[120px] sm:max-w-none">
                          <h3
                            className={`text-sm sm:text-base font-semibold ${
                              isCurrentUser ? "text-green-800" : "text-gray-800"
                            } truncate`}
                          >
                            {leaderUser.username}
                            {isCurrentUser && (
                              <Badge className="ml-1 sm:ml-2 bg-green-100 text-green-800 text-xs">
                                You
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-gray-600">
                            Rank #{leaderUser.rank}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          <span className="text-lg sm:text-2xl font-bold text-green-800">
                            {leaderUser.eco_credits}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-green-600">
                          eco-credits
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Badges (unchanged) */}
      <Card className="mt-6 sm:mt-8 border-green-200">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl text-green-800">
            Achievement System
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Earn badges for reaching milestones in your eco-coding journey
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm sm:text-base text-green-800">
                First Steps
              </h4>
              <p className="text-xs sm:text-sm text-green-600">
                Complete your first outdoor activity
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm sm:text-base text-blue-800">
                Code Warrior
              </h4>
              <p className="text-xs sm:text-sm text-blue-600">
                Log 100+ coding hours
              </p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg">
              <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm sm:text-base text-emerald-800">
                Nature Lover
              </h4>
              <p className="text-xs sm:text-sm text-emerald-600">
                Complete 10 outdoor activities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
