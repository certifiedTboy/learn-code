import { useState } from "react";
import { DashboardLayout } from "../components/layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MoreVertical,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useToast } from "../hooks/use-toast";
import { useUsers } from "../hooks/use-users";

type FilterType = "all" | "subscribed" | "unsubscribed";

export default function RegisteredUsers() {
  const { toast } = useToast();

  const { users } = useUsers();

  // Local state for demonstration purposes
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleStatusId, setToggleStatusId] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "subscribed"
          ? user.isSubscribed
          : !user.isSubscribed;

    return matchesSearch && matchesFilter;
  });

  const userToToggle = users.find((u) => u.id === toggleStatusId);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              Registered Users
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your platform's user base and subscriptions.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl w-fit border border-white/5 shadow-inner">
            {(["all", "subscribed", "unsubscribed"] as FilterType[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300 ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {f}
                </button>
              ),
            )}
          </div>

          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 w-full md:w-80">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-sm h-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid grid-cols-12 gap-4 items-center p-4 md:px-6 bg-black/40 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:grid">
            <div className="col-span-3 lg:col-span-3">User</div>
            <div className="col-span-3 lg:col-span-3">Email</div>
            <div className="col-span-2">Registered Courses</div>
            <div className="col-span-2">Subscription</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 pr-1">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    key={user.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 md:px-6 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* User Info (Avatar & Name) */}
                    <div className="col-span-3 lg:col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-blue-600 flex items-center justify-center text-white font-bold shadow-inner flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Email (Hidden on small screens) */}
                    <div className="col-span-3 lg:col-span-3 hidden md:flex items-center text-sm text-muted-foreground truncate">
                      <Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0 opacity-70" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {/* Registered Courses */}
                    <div className="col-span-2 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md bg-white/5 text-muted-foreground border-white/10">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        <span>
                          {user.registeredCourses}{" "}
                          {user.registeredCourses === 1 ? "Course" : "Courses"}
                        </span>
                      </span>
                    </div>

                    {/* Subscription Status */}
                    <div className="col-span-2 flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${
                          user.isSubscribed
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-secondary text-muted-foreground border-border"
                        }`}
                      >
                        {user.isSubscribed ? "Subscribed" : "Unsubscribed"}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium border backdrop-blur-md ${
                          user.isActive
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-white"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setToggleStatusId(user.id)}
                          >
                            {user?.isActive ? (
                              <>
                                <UserX className="w-4 h-4 mr-2 text-orange-400" />{" "}
                                Deactivate Account
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2 text-green-400" />{" "}
                                Activate Account
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-16 text-center flex flex-col items-center justify-center text-muted-foreground">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">
                No users found
              </p>
              <p className="text-sm mt-1 max-w-sm">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete User Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you absolutely sure you want to delete this user? This action
              cannot be undone and will remove their access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary/50 border-0 hover:bg-secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              // onClick={handleDelete}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Dialog */}
      <AlertDialog
        open={!!toggleStatusId}
        onOpenChange={(open) => !open && setToggleStatusId(null)}
      >
        <AlertDialogContent className="glass-panel border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.isActive ? "Deactivate" : "Activate"} User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to {true ? "deactivate" : "activate"}{" "}
              <strong>{userToToggle?.name}</strong>'s account?
              {userToToggle?.isActive &&
                " They will not be able to log in until reactivated."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary/50 border-0 hover:bg-secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="shadow-glow"
              // onClick={handleToggleStatus}
            >
              Confirm Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
