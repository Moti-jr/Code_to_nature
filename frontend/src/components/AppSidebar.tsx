import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
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
  useSidebar
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { 
  Leaf, 
  Code, 
  Trophy, 
  Gift, 
  BarChart3,
  User,
  LogOut,
  Settings,
  Menu,
  X
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
  const { state, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
 
  const isCollapsed = state === "collapsed";

  // Handle responsive breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-collapse on mobile and tablet
  useEffect(() => {
    if (isMobile && state !== "collapsed") {
      // On mobile, sidebar should overlay when open
    }
  }, [isMobile, state]);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (isMobile && state !== "collapsed") {
      toggleSidebar();
    }
  };

  if (!user) return null;

  // Determine sidebar width and behavior based on screen size
  const getSidebarClass = () => {
    if (isMobile) {
      return `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      } w-72 bg-background border-r-2 border-border/50`;
    }
    
    if (isTablet) {
      return `border-r-2 border-border/50 ${isCollapsed ? "w-16" : "w-60"}`;
    }
    
    return `border-r-2 border-border/50 ${isCollapsed ? "w-16" : "w-72"}`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile menu button - only show when sidebar is collapsed on mobile */}
      {isMobile && isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 lg:hidden bg-background border border-border/50 shadow-sm"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      <Sidebar className={getSidebarClass()}>
        {/* Header */}
        <SidebarHeader className="border-b border-border/50 p-4 lg:p-6 mt-2 lg:mt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 lg:w-7 lg:h-7 text-green-600" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h2 className="font-bold text-base lg:text-lg bg-gradient-to-r from-primary to-success bg-clip-text truncate">
                    Code-to-Nature
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Eco-Developer Platform
                  </p>
                </div>
              )}
            </div>
            
            {/* Close button for mobile */}
            {isMobile && !isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 w-8 p-0 lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-1 lg:px-2">
          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10 lg:h-12">
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                        onClick={handleNavClick}
                      >
                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="min-w-0">
                            <div className="font-medium text-sm">
                              {item.title}
                            </div>
                            {!isMobile && (
                              <div className="text-xs opacity-70 truncate hidden lg:block">
                                {item.description}
                              </div>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-border/50 p-2">
          {isCollapsed ? (
            <div className="flex flex-col gap-1">
              <Link to="/profile" onClick={handleNavClick} title="Profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 lg:h-10 p-0 hover:bg-muted/50"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 lg:h-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* User Info Section */}
              {/* {user && (
                <div className="px-3 py-2 mb-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {user.name || user.email || 'Developer'}
                      </div>
                      {!isMobile && (
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email || 'Eco Developer'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Stats for Mobile/Tablet 
                  {(isMobile || isTablet) && (
                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/30">
                      <div className="text-center">
                        <div className="text-xs font-medium text-primary">#{user.rank || '42'}</div>
                        <div className="text-xs text-muted-foreground">Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-success">{user.activitiesCount || '12'}</div>
                        <div className="text-xs text-muted-foreground">Activities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-blue-600">{user.codingHours || '156'}h</div>
                        <div className="text-xs text-muted-foreground">Coding</div>
                      </div>
                    </div>
                  )}
                </div>
              )} */}
              
              {/* Action Buttons */}
              <Link to="/profile" onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8 lg:h-10 text-sm hover:bg-muted/50"
                >
                  <User className="w-4 h-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div>Profile</div>
                    {!isMobile && (
                      <div className="text-xs opacity-60">View & edit profile</div>
                    )}
                  </div>
                </Button>
              </Link>
              
              <Link to="/settings" onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  size="sm" 
                  className="w-full justify-start h-8 lg:h-10 text-sm hover:bg-muted/50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div>Settings</div>
                    {!isMobile && (
                      <div className="text-xs opacity-60">App preferences</div>
                    )}
                  </div>
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 lg:h-10 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <div className="flex-1 text-left">
                  <div>Logout</div>
                  {!isMobile && (
                    <div className="text-xs opacity-60">Sign out securely</div>
                  )}
                </div>
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}