"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HardDrive } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const { login } = useStore();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin") {
            login({ id: "admin-1", name: "Bala (Manager)", role: "Admin" });
            router.push("/");
        } else if (password === "engineer") {
            login({ id: "eng-1", name: "System Engineer", role: "Engineer" });
            router.push("/");
        } else {
            alert("Invalid password. Use 'admin' or 'engineer'.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <HardDrive className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Tech Manager</CardTitle>
                    <CardDescription>
                        Login to manage your assignments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Passcode</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter passcode"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Demo: use &lsquo;admin&rsquo; or &lsquo;engineer&rsquo;
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
