import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";

interface EcoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

const EcoCard = ({ title, value, subtitle, icon, className, trend }: EcoCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        {subtitle && (
          <p className={cn(
            "text-xs mt-1",
            trend === "up" && "text-success",
            trend === "down" && "text-destructive", 
            trend === "neutral" && "text-muted-foreground"
          )}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EcoCard;