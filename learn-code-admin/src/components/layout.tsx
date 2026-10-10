import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Settings,
  Menu,
  X,
  GraduationCap,
  CloudUpload,
  CloudDownload,
  CloudSync,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/use-auth";
import { deleteToken } from "../helpers/user-session";
import { useGoogleAuth } from "../hooks/use-google-auth";
import { useBackup } from "@/hooks/use-backup";

interface LayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { revokeAccess } = useGoogleAuth();
  const { writeToCloud, readFromCloud } = useBackup();
  const [isBackupMenuOpen, setIsBackupMenuOpen] = useState(false);

  const adminNavItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    {
      href: "/dashboard/registered-users",
      label: "Registered Users",
      icon: Settings,
    },
    { href: "/dashboard/profile", label: "Settings", icon: Settings },
  ];

  const userNavItems = [
    { href: "/dashboard", label: "Courses", icon: LayoutDashboard },
    { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },

    { href: "/dashboard/profile", label: "Settings", icon: Settings },
  ];

  const onLogoutUser = async () => {
    await deleteToken();
    await revokeAccess();
    window.location.href = "/login";
  };

  return (
    <div className="h-dvh bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="font-display font-bold text-lg text-foreground">
            Learn Code
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 min-h-0 glass-panel border-r border-border/50 flex flex-col transition-transform duration-300 ease-in-out md:h-full
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0
      `}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-primary-foreground shadow-glow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide text-foreground">
            Learn Code
          </span>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {user &&
            user?.role === "admin" &&
            adminNavItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/dashboard" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }
                `}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-primary" : "group-hover:text-primary/70 transition-colors"}`}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}

          {user &&
            user?.role === "user" &&
            userNavItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/dashboard" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_rgba(0,188,212,0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }
                `}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-primary" : "group-hover:text-primary/70 transition-colors"}`}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
        </nav>

        <div className="mt-auto flex-none border-t border-border/50 p-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium border border-white/10">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-foreground truncate">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.role}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onLogoutUser}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-0 w-full flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {user && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
          <AnimatePresence>
            {isBackupMenuOpen && (
              <motion.div
                className="flex flex-col items-end gap-3"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                <button
                  type="button"
                  onClick={async () => {
                    setIsBackupMenuOpen(false);
                    await writeToCloud();
                  }}
                  className="flex items-center gap-3 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-xl shadow-primary/10 transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10"
                >
                  Back up to cloud
                  <CloudUpload className="h-5 w-5 text-primary" />
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsBackupMenuOpen(false);
                    await readFromCloud();
                  }}
                  className="flex items-center gap-3 rounded-full border border-primary/30 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-xl shadow-primary/10 transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10"
                >
                  Restore from cloud
                  <CloudDownload className="h-5 w-5 text-primary" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label={
              isBackupMenuOpen
                ? "Close cloud backup menu"
                : "Cloud backup options"
            }
            aria-expanded={isBackupMenuOpen}
            onClick={() => setIsBackupMenuOpen((open) => !open)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-500 text-primary-foreground shadow-xl shadow-primary/30 transition hover:scale-105 hover:shadow-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {isBackupMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <CloudSync className="h-6 w-6" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
