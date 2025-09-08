import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { 
  MapPin, 
  Plus, 
  Clock, 
  Camera,
  Leaf,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const OutdoorActivities = () => {
  const [formData, setFormData] = useState({
    activityType: "",
    duration: "",
    location: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Activity submitted!",
      description: `Your ${formData.activityType} activity is being verified`,
    });
    setFormData({
      activityType: "",
      duration: "",
      location: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const activities = [
    { 
      id: 1, 
      type: "Forest Hike", 
      duration: 120, 
      location: "Redwood National Park", 
      date: "2024-01-15", 
      credits: 15, 
      status: "Verified" 
    },
    { 
      id: 2, 
      type: "Beach Walk", 
      duration: 45, 
      location: "Santa Monica Beach", 
      date: "2024-01-14", 
      credits: 8, 
      status: "Pending" 
    },
    { 
      id: 3, 
      type: "Mountain Biking", 
      duration: 90, 
      location: "Trail Ridge", 
      date: "2024-01-13", 
      credits: 12, 
      status: "Verified" 
    },
    { 
      id: 4, 
      type: "Rock Climbing", 
      duration: 180, 
      location: "Joshua Tree", 
      date: "2024-01-12", 
      credits: 18, 
      status: "Rejected" 
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-success/20 text-success";
      case "Pending":
        return "bg-warning/20 text-warning";
      case "Rejected":
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
          <p className="text-muted-foreground">Submit nature activities to unlock your eco-credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit New Activity Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Submit Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="activityType">Activity Type</Label>
                <Select value={formData.activityType} onValueChange={(value) => setFormData({ ...formData, activityType: value })}>
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
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  placeholder="60"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Central Park, Local Trail"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your outdoor experience..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Verification Photo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a photo of your outdoor activity
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <MapPin className="w-4 h-4 mr-2" />
                Submit Activity
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Activity History</h2>
          {activities.map((activity) => (
            <Card key={activity.id} className="border-2 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{activity.type}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{activity.location}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration} min
                      </span>
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary font-semibold mb-2">
                      <Leaf className="w-4 h-4" />
                      {activity.credits}
                    </div>
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {getStatusIcon(activity.status)}
                      {activity.status}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutdoorActivities;