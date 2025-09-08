import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { 
  Code, 
  Plus, 
  Clock, 
  Calendar,
  Leaf
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const CodingSessions = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    hours: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Coding session logged!",
      description: `${formData.hours} hours added to ${formData.projectName}`,
    });
    setFormData({
      projectName: "",
      hours: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const sessions = [
    { id: 1, project: "E-commerce Dashboard", hours: 3.5, date: "2024-01-15", credits: 18, status: "Locked" },
    { id: 2, project: "Mobile App API", hours: 2.0, date: "2024-01-14", credits: 10, status: "Locked" },
    { id: 3, project: "React Components", hours: 4.2, date: "2024-01-13", credits: 21, status: "Unlocked" },
    { id: 4, project: "Database Migration", hours: 1.5, date: "2024-01-12", credits: 8, status: "Unlocked" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Coding Sessions</h1>
          <p className="text-muted-foreground">Log your development work to earn eco-credits</p>
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
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., React Dashboard, API Integration"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="hours">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  placeholder="2.5"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What did you work on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Code className="w-4 h-4 mr-2" />
                Log Session
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Session History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          {sessions.map((session) => (
            <Card key={session.id} className="border-2 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{session.project}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Leaf className="w-4 h-4" />
                      {session.credits}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      session.status === 'Unlocked' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {session.status}
                    </span>
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

export default CodingSessions;