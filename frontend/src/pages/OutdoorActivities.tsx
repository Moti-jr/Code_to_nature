import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  MapPin,
  Plus,
  Clock,
  Camera,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

interface Activity {
  id: number;
  duration: number;
  verification_proof: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  location: string;
  activity_date: string;
  description: string;
  activity: string;
}

const OutdoorActivities = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState<{
    activity: string;
    duration: string;
    location: string;
    description: string;
    activity_date: string;
    verification_proof: File | null;
  }>({
    activity: "",
    duration: "",
    location: "",
    description: "",
    activity_date: new Date().toISOString().split("T")[0],
    verification_proof: null,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/activities/`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log("data: ", data)
        const allActivities = data.data || data;
        setActivities(allActivities);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an activity",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formDataToSend = new FormData();

      // format duration properly for Django DurationField
      const hours = parseInt(formData.duration, 10) || 0;
      const formattedDuration = `${hours}:00:00`;

      formDataToSend.append("activity", formData.activity);
      formDataToSend.append("duration", formattedDuration);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("activity_date", formData.activity_date);

      if (formData.verification_proof) {
        formDataToSend.append(
          "verification_proof",
          formData.verification_proof
        );
        // console.log("FormData: ", formDataToSend)
      }

      {/*for (let pair of formDataToSend.entries()) {
         console.log(pair[0], pair[1]);
      }*/}

      const response = await fetch(
        `${API_BASE_URL}/activities/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );
      // console.log("Response for FormDatatoSend: ", response)

      if (response.ok) {
        const newActivity = await response.json();
        setActivities([newActivity, ...activities]);
        toast({
          title: "Activity submitted!",
          description: `Your ${formData.activity} activity is pending verification`,
        });

        window.location.reload();

        setFormData({
          activity: "",
          duration: "",
          location: "",
          description: "",
          activity_date: new Date().toISOString().split("T")[0],
          verification_proof: null,
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error("Failed to submit activity");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit activity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // console.log("Selected file:", e.target.files[0]);
      setFormData({ ...formData, verification_proof: e.target.files[0] });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "Verified";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "PENDING":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-success/20 text-success";
      case "PENDING":
        return "bg-warning/20 text-warning";
      case "REJECTED":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-success to-accent rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Outdoor Activities</h1>
          <p className="text-muted-foreground">
            Submit nature activities to unlock your eco-credits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit Activity Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> Submit Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="activity">Activity Type</Label>
                <Select
                  value={formData.activity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activity: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hiking">Hiking</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="climbing">Rock Climbing</SelectItem>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  placeholder="2.5"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Central Park, Local Trail"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="activity_date">Date</Label>
                <Input
                  id="activity_date"
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_date: e.target.value })
                  }
                  required
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your outdoor experience..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification_proof">Verification Photo</Label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.verification_proof
                      ? formData.verification_proof.name
                      : "Click to upload a photo of your outdoor activity"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Choose File
                  </Button>
                </div>
                <Input
                  id="verification_proof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" /> Submit Activity
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Activity History</h2>
          {activities.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No activities submitted yet
                </p>
              </CardContent>
            </Card>
          ) : (
            activities.map((activity) => (
              <Card
                key={`activity-${activity.id}`}
                className="border-2 hover:shadow-md transition-all"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  {activity.verification_proof && (
                    <div key={`image-${activity.id}`} className="flex-shrink-0">
                      <img
                        src={activity.verification_proof}
                        alt="Verification proof"
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div key={`content-${activity.id}`} className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground capitalize">
                          {activity.activity
                            ? activity.activity.replace("_", " ")
                            : "Unknown Activity"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.location}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration} hours
                          </span>
                          <span>
                            {new Date(
                              activity.activity_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {activity.description && (
                          <p
                            key={`desc-${activity.id}`}
                            className="text-sm mt-2"
                          >
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {getStatusIcon(activity.status)}{" "}
                          {getStatusDisplay(activity.status)}
                        </div>
                      </div>
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

export default OutdoorActivities;
