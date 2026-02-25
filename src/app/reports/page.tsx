"use client";

import { useStore } from "@/store/useStore";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle } from "lucide-react";

export default function ReportsPage() {
    const { reports, currentUser, approveReport } = useStore();

    if (!currentUser) return null;

    const displayReports = currentUser.role === "Engineer"
        ? reports.filter(r => r.submittedBy === currentUser.id)
        : reports;

    const handleApprove = (id: string) => {
        approveReport(id);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            </div>

            {displayReports.length === 0 ? (
                <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-48 py-6">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">No reports generated yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {displayReports.map((report) => (
                        <Card key={report.id} className="relative overflow-hidden">
                            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${report.status === "Approved" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                                }`}>
                                {report.status}
                            </div>
                            <CardHeader>
                                <div className="flex gap-2">
                                    <div className="p-3 bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Week: {report.weekStarting}</CardTitle>
                                        <CardDescription>Submitted: {format(parseISO(report.submissionDate), "MMM d, h:mm a")}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table className="mb-4">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Assigned</TableHead>
                                            <TableHead>Completed</TableHead>
                                            <TableHead>Pending</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-bold">{report.totalAssigned}</TableCell>
                                            <TableCell className="text-green-600 dark:text-green-500 font-bold">{report.totalCompleted}</TableCell>
                                            <TableCell className="text-orange-600 dark:text-orange-500 font-bold">{report.pendingItems}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {report.criticalIssues && report.criticalIssues.length > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg mt-4">
                                        <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Critical Issues Reported</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-red-800 dark:text-red-200">
                                            {report.criticalIssues.map((issue, idx) => (
                                                <li key={idx}>{issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mt-6">
                                    {currentUser.role === "Admin" && report.status === "Pending Approval" && (
                                        <Button onClick={() => handleApprove(report.id)} className="flex-1 bg-green-600 hover:bg-green-700 h-10">
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                    )}
                                    <Button variant="outline" className="flex-1 h-10 border-green-600 text-green-700 hover:bg-green-50 dark:hover:bg-green-900">
                                        <Download className="mr-2 h-4 w-4" /> Export
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
