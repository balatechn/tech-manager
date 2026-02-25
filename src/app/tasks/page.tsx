"use client";

import { useStore, TaskStatus } from "@/store/useStore";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { MoreVertical, Camera, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
    const { tasks, currentUser, updateTask } = useStore();
    const [activeTab, setActiveTab] = useState("all");
    const [remarkText, setRemarkText] = useState("");
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    if (!currentUser) return null;

    const userTasks = currentUser.role === "Engineer"
        ? tasks.filter(t => t.assignedTo === currentUser.id)
        : tasks;

    const filteredTasks = userTasks.filter(t => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return t.status === "Pending";
        if (activeTab === "in-progress") return t.status === "In Progress";
        if (activeTab === "completed") return t.status === "Completed";
        return true;
    });

    const handleStatusChange = (id: string, newStatus: TaskStatus) => {
        updateTask(id, {
            status: newStatus,
            completionDate: newStatus === "Completed" ? new Date().toISOString() : undefined
        });
        toast.success(`Task status updated to ${newStatus}`);
    };

    const handleAddRemark = () => {
        if (!selectedTask || !remarkText.trim()) return;
        const task = userTasks.find(t => t.id === selectedTask);
        const existingRemarks = task?.remarks ? `${task.remarks}\n` : '';
        const timestamp = format(new Date(), "PPpp");
        updateTask(selectedTask, { remarks: `${existingRemarks}[${timestamp}] ${remarkText}` });
        toast.success("Remark added");
        setRemarkText("");
        setSelectedTask(null);
    };

    const TaskCard = ({ task }: { task: any }) => (
        <Card className="mb-4 shadow-sm relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
            <CardContent className="p-4 pl-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <Badge variant="outline">{task.category}</Badge>
                            {task.isPreventive && <Badge variant="secondary">Preventive</Badge>}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Pending")}>
                                <Clock className="mr-2 h-4 w-4" /> Set Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "In Progress")}>
                                <AlertCircle className="mr-2 h-4 w-4" /> Set In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Completed")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Set Completed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

                <div className="flex justify-between items-center text-xs">
                    <span>Due: {format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
                    <span className={`font-medium
            ${task.status === 'Completed' ? 'text-green-600 dark:text-green-400' :
                            task.status === 'In Progress' ? 'text-blue-600 dark:text-blue-400' :
                                'text-orange-600 dark:text-orange-400'}`}>
                        {task.status}
                    </span>
                </div>

                {task.remarks && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-md text-xs">
                        <p className="font-semibold mb-1">Remarks:</p>
                        <p className="whitespace-pre-wraps break-words text-muted-foreground">{task.remarks}</p>
                    </div>
                )}

                {/* Quick Actions for Engineer */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                    {task.status !== "Completed" && (
                        <Button variant="default" size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusChange(task.id, "Completed")}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Done
                        </Button>
                    )}

                    <Dialog open={selectedTask === task.id} onOpenChange={(open) => !open && setSelectedTask(null)}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedTask(task.id)}>
                                Add Remark
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md w-[90%] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Update Task</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Textarea
                                    placeholder="Enter your remarks, updates or issues faced..."
                                    value={remarkText}
                                    onChange={(e) => setRemarkText(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <Button variant="outline" className="w-full justify-center">
                                    <Camera className="mr-2 h-4 w-4" /> Upload Proof (Image)
                                </Button>
                            </div>
                            <Button onClick={handleAddRemark}>Save Remark</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">Doing</TabsTrigger>
                    <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mt-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No tasks found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
