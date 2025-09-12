"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Code, Plus, Clock, Calendar, Leaf, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

// Types for API responses
interface CodingSession {
  id: string;
  session_name: string;
  duration: string;
  source: string;
  created_at: string;
  credits_awarded: number;
  status: string;
  userid: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const CodingSessions = () => {
  const { user, loading } = useAuth();
  const [sessions, setSessions] = useState<CodingSession[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const token = localStorage.getItem("authToken");

  const userId = user ? user.user : ""

  // console.log("UserId: ", userId)

  const [formData, setFormData] = useState({
    user: userId,
    type: "",
    hours: "",
  });

  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch sessions from backend
  const fetchSessions = async () => {
    if (!user) return;

    try {
      setIsLoadingSessions(true);
      const response = await fetch(`${API_BASE_URL}/codingsessions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CodingSession[]> = await response.json();
      setSessions(result.data || []);
    } catch (error) {
      // console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load coding sessions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Submit new session to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const hours = Number.parseFloat(formData.hours);
      const durationHours = Math.floor(hours);
      const durationMinutes = Math.floor((hours - durationHours) * 60);
      const duration = `${durationHours
        .toString()
        .padStart(2, "0")}:${durationMinutes.toString().padStart(2, "0")}:00`;

      const sessionData = {
        duration: duration,
        user: userId,
        source: formData.type,
      };
      //console.log("sessionData: ", sessionData)

      const response = await fetch(`${API_BASE_URL}/codingsessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success!",
        description: `logged for ${formData.type} session `,
      });

      // Reset form
      setFormData({
        user: String(userId),
        type: "",
        hours: "",
      });

      // Refresh sessions list
      await fetchSessions();
    } catch (error) {
      // console.error("Error submitting session:", error);
      toast({
        title: "Error",
        description: "Failed to log coding session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch sessions when component mounts or user changes
  useEffect(() => {
    if (user && !loading) {
      fetchSessions();
    }
  }, [user, loading]);
  // console.log("User data in Dashboard:", user);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Coding Sessions</h1>
          <p className="text-muted-foreground">
            Log your development work to earn eco-credits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Log New Session Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Log New Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Session Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    {/* <SelectItem value="github">GitHub</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="hours">Duration (Hours)</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  placeholder="2.5"
                  value={formData.hours}
                  onChange={(e) =>
                    setFormData({ ...formData, hours: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  isSubmitting || !formData.type || !formData.hours || !formData.user
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging Session...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Log Session
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Session History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Sessions</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessions}
              disabled={isLoadingSessions}
            >
              {isLoadingSessions ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {isLoadingSessions ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading sessions...
                </p>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="p-8 text-center">
                <Code className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No coding sessions yet. Log your first session!
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className="border-2 hover:shadow-md transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {session.session_name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {session.source}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <Leaf className="w-4 h-4" />
                        {session.credits_awarded}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          session.status === "Unlocked"
                            ? "bg-success/20 text-warning"
                            : "bg-warning/20 text-green-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingSessions;
