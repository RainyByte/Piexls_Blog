"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { PixelButton, PixelInput, PixelCard } from "@/components/pixel";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      router.push("/admin/posts");
    } catch {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <PixelCard padding="lg" className="w-full max-w-sm">
        <h1 className="font-pixel text-sm text-center mb-6">🔐 Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PixelInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PixelInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red text-xs font-pixel">{error}</p>}
          <PixelButton type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </PixelButton>
        </form>
      </PixelCard>
    </div>
  );
}
