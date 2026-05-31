"use client"; // Necesario para usar estados y eventos de clic

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Bienvenido!");
        router.push("/home");
      } else {
        alert(data.message || "Error al iniciar sesión");
        console.log("Login error:", data.message);
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
          <CardTitle className="text-2xl font-bold text-center text-gray-50">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-50">Sing in to your Finance-Tracker account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-gray-50">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@correo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="border-gray-50 bg-[#0F1729] text-gray-50 focus:ring-[#16A249] focus:border-[#16A249]"
              />
            </div>
            <div className="space-y-2 text-gray-50">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="border-gray-50 bg-[#0F1729] text-gray-50 focus:ring-[#16A249] focus:border-[#16A249]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-[#16A249] mt-4 hover:bg-[#16A249]/90" disabled={loading}>
              {loading ? "Cargando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
        <a href="/register" className="text-sm text-[#16A249] hover:text-[#16A249]/90">Already have an account? Sign in</a>
      </Card>
    </div>
  );
}