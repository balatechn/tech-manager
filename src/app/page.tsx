"use client";

import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, ListTodo, FileText } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { tasks, currentUser } = useStore();
  const router = useRouter();

  if (!currentUser) return null;

  // Filter tasks for engineer if not admin, else show all
  const userTasks = currentUser.role === "Engineer"
    ? tasks.filter(t => t.assignedTo === currentUser.id)
    : tasks;

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.status === "Completed").length;
  const pendingTasks = userTasks.filter(t => t.status !== "Completed").length;
  const overdueTasks = userTasks.filter(t => t.status !== "Completed" && isPast(parseISO(t.dueDate))).length;

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <Card>
      <CardContent className="p-6 flex items-center space-x-4">
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {currentUser.name}</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{progress}% Completed</span>
            <span className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} Tasks</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={totalTasks} icon={ListTodo} color="bg-blue-500" />
        <StatCard title="Completed" value={completedTasks} icon={CheckCircle2} color="bg-green-500" />
        <StatCard title="Pending" value={pendingTasks} icon={Clock} color="bg-orange-500" />
        <StatCard title="Overdue" value={overdueTasks} icon={AlertCircle} color="bg-red-500" />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
        <div className="space-y-3">
          {userTasks.slice(0, 3).map((task) => (
            <Card key={task.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push('/tasks')}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-xs text-muted-foreground">{task.category} • Due {format(parseISO(task.dueDate), 'MMM d')}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium
                  ${task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {task.status}
                </div>
              </CardContent>
            </Card>
          ))}
          {userTasks.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No tasks found. Relax!</p>
          )}
        </div>
      </div>

      {/* Floating Submit Action */}
      {currentUser.role === 'Engineer' && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button size="lg" className="rounded-full shadow-xl bg-primary hover:bg-primary/90" onClick={() => router.push('/reports/new')}>
            <FileText className="mr-2 h-5 w-5" />
            Submit Weekly Report
          </Button>
        </div>
      )}
    </div>
  );
}
