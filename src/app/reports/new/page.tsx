"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function NewReportPage() {
    const { tasks, currentUser, submitReport } = useStore();
    const router = useRouter();
    const [criticalIssues, setCriticalIssues] = useState("");

    if (!currentUser) return null;

    const userTasks = currentUser.role === "Engineer"
        ? tasks.filter(t => t.assignedTo === currentUser.id)
        : tasks;

    const totalAssigned = userTasks.length;
    const totalCompleted = userTasks.filter(t => t.status === "Completed").length;
    const pendingItems = totalAssigned - totalCompleted;

    const handleSubmit = () => {
        const reportId = Math.random().toString(36).substring(7);
        submitReport({
            id: reportId,
            weekStarting: format(new Date(), "yyyy-MM-dd"), // Simplified week start
            submittedBy: currentUser.id,
            totalAssigned,
            totalCompleted,
            pendingItems,
            criticalIssues: criticalIssues.split('\n').filter(Boolean),
            status: "Pending Approval",
            submissionDate: new Date().toISOString()
        });

        toast.success("Weekly Report Submitted Successfully!");
        router.push("/reports");
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => router.back()}>&larr; Back</Button>
                <h1 className="text-2xl font-bold tracking-tight">Generate Report</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Weekly Report Summary</CardTitle>
                            <CardDescription>Week of {format(new Date(), "MMM d, yyyy")}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Assigned</p>
                            <p className="text-2xl font-bold">{totalAssigned}</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-lg">
                            <p className="text-xs text-green-700 dark:text-green-400 uppercase font-bold tracking-wider">Completed</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">{totalCompleted}</p>
                        </div>
                        <div className="bg-orange-500/10 p-4 rounded-lg">
                            <p className="text-xs text-orange-700 dark:text-orange-400 uppercase font-bold tracking-wider">Pending</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">{pendingItems}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="issues">Critical Issues / Blockers</Label>
                        <Textarea
                            id="issues"
                            placeholder="List any critical issues, hardware failures, pending approvals... (One per line)"
                            value={criticalIssues}
                            onChange={(e) => setCriticalIssues(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button onClick={handleSubmit} className="w-full" size="lg">
                        <Send className="mr-2 h-5 w-5" /> Submit to Management
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex gap-4">
                <Button variant="outline" className="w-full" onClick={() => toast.info('PDF export triggered (feature simulated)')}>
                    <Download className="mr-2 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900" onClick={() => toast.info('Excel export triggered (feature simulated)')}>
                    <Download className="mr-2 h-4 w-4" /> Export Excel
                </Button>
            </div>
        </div>
    );
}
