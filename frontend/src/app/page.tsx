"use client"
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
const [user, setUser] = useState<null | string>(null);

useEffect(() => {
  const verifyUser = async () => {
    try {
      const res = await fetch("http://localhost:3333/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const ress = await res.json()
      console.log(ress);
      if (ress.user) {
        setUser(ress.user.username);
      }
    } catch (error) {
      console.log(error);
    }
  }

  verifyUser();
}, []);

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3333/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const ress = await res.json()
    console.log(ress);
    setUser(null);
  } catch (error) {
    console.log(error);
  }
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? 
      <div>
        <p>{user}</p>
        <button className="text-white" onClick={logout}>Logout</button>
      </div> :
      <LoginForm />}
    </main>
  );
}
