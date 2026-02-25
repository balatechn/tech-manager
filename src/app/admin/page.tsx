"use client";

import { useStore, TaskCategory, TaskPriority, TaskFrequency } from "@/store/useStore";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BarChart3, Settings, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminDashboard() {
    const { tasks, currentUser, addTask, deleteTask } = useStore();
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

    if (!currentUser || currentUser.role !== "Admin") {
        return <div className="p-8 text-center text-muted-foreground">Access Denied</div>;
    }

    // Analytics Metrics
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter(t => t.status === "Completed").length;
    const monthlyCompletionRate = totalTasksCount ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const categoryCount = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b, "N/A");

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: "Network" as TaskCategory,
        priority: "Medium" as TaskPriority,
        frequency: "Weekly" as TaskFrequency,
        dueDate: format(new Date(), "yyyy-MM-dd"),
        assignedTo: "eng-1",
        isPreventive: false
    });

    const handleCreateTask = () => {
        if (!newTask.title) return;
        addTask({
            ...newTask,
            id: Math.random().toString(36).substring(7),
            status: "Pending",
            remarks: "",
            dueDate: new Date(newTask.dueDate).toISOString()
        });
        setIsNewTaskOpen(false);
        toast.success("Task created and assigned!");
        setNewTask({ ...newTask, title: "", description: "" });
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin Hub</h1>
            </div>

            <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analytics"><BarChart3 className="mr-2 h-4 w-4" /> Analytics</TabsTrigger>
                    <TabsTrigger value="tasks"><Settings className="mr-2 h-4 w-4" /> Task Management</TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{monthlyCompletionRate}%</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Top Issue Area</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{topCategory}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">SLA Compliance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">98%</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">Downtime (Mo)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-500">2h 14m</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Recent Downtime Logs</CardTitle>
                            <CardDescription>Simulated logs for infrastructure</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>System</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Root Cause</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Main Firewall</TableCell>
                                        <TableCell className="text-red-500">14 mins</TableCell>
                                        <TableCell>ISP Link Flap</TableCell>
                                        <TableCell>Yesterday</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>NAS Storage Vol 2</TableCell>
                                        <TableCell className="text-red-500">45 mins</TableCell>
                                        <TableCell>Disk sync delay</TableCell>
                                        <TableCell>3 days ago</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6 space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Active Tasks</h2>
                        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" /> Create Task</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md w-[90%] rounded-xl">
                                <DialogHeader>
                                    <DialogTitle>Create New Task</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Task title" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={newTask.category} onValueChange={(v: TaskCategory) => setNewTask({ ...newTask, category: v })}>
                                            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                            <SelectContent>
                                                {['Network', 'Server', 'Backup', 'Security', 'CCTV', 'Email', 'Hardware'].map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Priority</Label>
                                            <Select value={newTask.priority} onValueChange={(v: TaskPriority) => setNewTask({ ...newTask, priority: v })}>
                                                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High">High</SelectItem>
                                                    <SelectItem value="Medium">Medium</SelectItem>
                                                    <SelectItem value="Low">Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Frequency</Label>
                                            <Select value={newTask.frequency} onValueChange={(v: TaskFrequency) => setNewTask({ ...newTask, frequency: v })}>
                                                <SelectTrigger><SelectValue placeholder="Frequency" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Daily">Daily</SelectItem>
                                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                                    <SelectItem value="One-time">One-time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Assignee</Label>
                                        <Select value={newTask.assignedTo} onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}>
                                            <SelectTrigger><SelectValue placeholder="Assignee" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eng-1">System Engineer (eng-1)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Due Date</Label>
                                        <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
                                    </div>
                                </div>
                                <Button onClick={handleCreateTask}>Save and Assign Task</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <Card key={task.id}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <p className="text-xs text-muted-foreground">{task.category} • {task.priority} Priority • {task.status}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteTask(task.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
