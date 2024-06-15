"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginForm() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const json = await res.json()
      console.log('RESPONSE LOGIN', json);
      
      const res2 = await fetch("http://localhost:3333/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const ress = await res2.json()
      console.log('RESPONSE ME',ress)
      router.replace('/')
    } catch (error: any) {
      console.log("LoginError", error);
    }
  };

  return (
    <div>
      <form className="flex gap-1 text-black" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          required
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, username: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="password"
          required
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button type="submit" className="text-white">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
