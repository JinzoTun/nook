import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from "../api/Auth";
import background from '../assets/bg-register.jpg';
import { fetchUser } from '../api/User';


  const Register: React.FC = () => {

    const [username, setUsername ] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  
    const navigate = useNavigate();
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await register({ username, email, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', (await fetchUser(response.token))._id);

        navigate('/');
      } catch (error) {
        setError("An error occurred. Please try again later.");
        console.error("Error :", error);
      } finally {
        setLoading(false);
      }
    }

  
   
  return (

    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           {/* go back arrow */}
                      <div className="flex items-center mb-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={() => window.history.back()}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          <span className="text-lg font-bold">Home</span>
                          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
            Enter your information to create an account
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="John doe"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign Up'}
        </Button>
        {error && <p className="error">{error}</p>}
            <Button variant="outline" className="w-full">
              Sign Up with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Sign In
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={background}
          alt="Image"
          width="1920"
          height="1080"
          className=" h-screen w-full object-cover dark:brightness-[0.9] "
        />
      </div>
    </div>
  )
}

export default Register;