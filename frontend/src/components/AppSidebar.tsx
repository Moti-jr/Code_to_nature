import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar }
  from "./ui/sidebar"
//import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { 
  Leaf, 
  Code, 
  Trophy, 
  Gift, 
  BarChart3,
  User,
  LogOut,
  Settings
} from "lucide-react";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Leaf,
    description: "Overview & quick actions"
  },
  { 
    title: "Code Sessions", 
    url: "/coding", 
    icon: Code,
    description: "Log your development work"
  },
  { 
    title: "Outdoor Activities", 
    url: "/activities", 
    icon: Trophy,
    description: "Submit nature activities"
  },
  { 
    title: "Rewards Store", 
    url: "/rewards", 
    icon: Gift,
    description: "Redeem eco-credits"
  },
  { 
    title: "Leaderboard", 
    url: "/leaderboard", 
    icon: BarChart3,
    description: "Developer rankings"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  if (!user) return null;

  return (
    <Sidebar 
      className={`border-r-2 border-border/50 ${isCollapsed ? "w-16" : "w-72"}`}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-border/50 p-9">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-success bg-clip-text text-transparent truncate">
                Code-to-Nature
              </h2>
              <p className="text-xs text-muted-foreground">
                Eco-Developer Platform
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* User Info */}
        {/* {!isCollapsed && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg m-2 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.badge}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Leaf className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {user.ecoCredits} credits
                  </span>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="min-w-0">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs opacity-70 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {/* {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Rank</span>
                  <span className="font-medium">#{user.rank}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-medium">{user.activitiesCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Coding Hours</span>
                  <span className="font-medium">{user.codingHours}h</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )} */}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/50 p-2">
        {isCollapsed ? (
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-10 p-0"
              title="Profile"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-10 p-0 text-destructive hover:text-destructive"
              onClick={logout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm" 
              className="w-full justify-start h-10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}