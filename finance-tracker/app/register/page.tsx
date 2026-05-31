"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage(){
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="flex items-center justify-center min-h-screen bg-[#0F1729] p-4">
      <Card className="w-full max-w-md bg-[#0F1729] border-[#0F1729]">
        <CardHeader>
          <img src="/register.svg" alt="" className="w-5"/>
          <CardTitle className="text-2xl font-bold text-center text-gray-50">Sign Up</CardTitle>
          <CardDescription className="text-center text-gray-50">Create your Finance-Tracker account</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-50">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className="space-y-2 text-gray-50">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2 text-gray-50">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="space-y-2 text-gray-50">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" className="w-full bg-[#16A249] mt-4 hover:bg-[#16A249]/90" disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </CardFooter>
          <a href="/login" className="text-sm text-[#16A249] hover:text-[#16A249]/90">Already have an account? Sign in</a>
        </form>
      </Card>
  </div>)
}