import { useState } from 'react';
import {
  BirdIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
interface LoginPageProps {
  onLogin: (user: User) => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Login State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  // Signup State
  const [signupForm, setSignupForm] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    // PHP API Integration:
    // POST /api/login.php
    // Body: { email: string, password: string }
    // Response: { success: boolean, user: { id, name, email, student_id }, token: string }
    try {
      const response = await fetch(
        'http://localhost/lab-bird/api/login.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        onLogin({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          studentId: data.user.student_id
        });
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login request failed', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (
    !signupForm.name ||
    !signupForm.studentId ||
    !signupForm.email ||
    !signupForm.password ||
    !signupForm.confirmPassword)
    {
      setError('Please fill in all fields.');
      return;
    }
    if (!signupForm.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupForm.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    // PHP API Integration:
    // POST /api/register.php
    // Body: { name: string, student_id: string, email: string, password: string }
    // Response: { success: boolean, message: string }
    try {
      const response = await fetch(
        'http://localhost/lab-bird/api/register.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: signupForm.name,
            student_id: signupForm.studentId,
            email: signupForm.email,
            password: signupForm.password
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        setSuccess('Account created! Please sign in.');
        setMode('login');
        setLoginForm({
          email: signupForm.email,
          password: ''
        });
        setSignupForm({
          name: '',
          studentId: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Signup request failed', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const toggleMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#C8102E]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C8102E] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1B2A4A] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 py-12">
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="flex flex-col items-center justify-center text-center mb-8">

          <div className="bg-[#C8102E] p-4 rounded-2xl shadow-lg mb-4">
            <BirdIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Lab Bird
          </h1>
          <p className="mt-2 text-sm text-gray-600 font-medium tracking-wide uppercase">
            Laboratory Equipment Management
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            delay: 0.1
          }}>

          <Card className="shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="h-1 w-full bg-gradient-to-r from-[#C8102E] to-[#D4A843]"></div>
            <CardContent className="px-8 py-10">
              <AnimatePresence mode="wait">
                {error &&
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0
                  }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    marginBottom: 16
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0
                  }}
                  className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start">

                    <AlertCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                }
                {success &&
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0
                  }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    marginBottom: 16
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0
                  }}
                  className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-start">

                    <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                }
              </AnimatePresence>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {mode === 'login' ?
                  <motion.div
                    key="login"
                    initial={{
                      opacity: 0,
                      x: -20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: 20
                    }}
                    transition={{
                      duration: 0.2
                    }}>

                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Welcome back
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Sign in to your account to continue
                        </p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          email: e.target.value
                        })
                        }
                        required
                        disabled={isLoading} />


                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Password
                            </label>
                            <a
                            href="#"
                            className="text-xs font-medium text-[#C8102E] hover:text-[#A00D25]">

                              Forgot password?
                            </a>
                          </div>
                          <div className="relative">
                            <input
                            type={showLoginPassword ? 'text' : 'password'}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                            placeholder="Enter your password"
                            value={loginForm.password}
                            onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              password: e.target.value
                            })
                            }
                            required
                            disabled={isLoading} />

                            <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                            }
                            tabIndex={-1}>

                              {showLoginPassword ?
                            <EyeOffIcon className="h-4 w-4" /> :

                            <EyeIcon className="h-4 w-4" />
                            }
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
                          disabled={isLoading} />

                          <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-700">

                            Remember me
                          </label>
                        </div>

                        <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className="mt-2 h-11 text-base shadow-sm">

                          {isLoading ?
                        <>
                              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                              Signing in...
                            </> :

                        'Sign In'
                        }
                        </Button>
                      </form>

                      <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                          Don't have an account?{' '}
                          <button
                          type="button"
                          onClick={() => toggleMode('signup')}
                          className="font-semibold text-[#C8102E] hover:text-[#A00D25] transition-colors"
                          disabled={isLoading}>

                            Sign up
                          </button>
                        </p>
                      </div>
                    </motion.div> :

                  <motion.div
                    key="signup"
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    transition={{
                      duration: 0.2
                    }}>

                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Create an account
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Join Lab Bird to manage your equipment
                        </p>
                      </div>

                      <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          name: e.target.value
                        })
                        }
                        required
                        disabled={isLoading} />


                        <Input
                        label="Student ID"
                        type="text"
                        placeholder="Enter your student ID"
                        value={signupForm.studentId}
                        onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          studentId: e.target.value
                        })
                        }
                        required
                        disabled={isLoading} />


                        <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          email: e.target.value
                        })
                        }
                        required
                        disabled={isLoading} />


                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <div className="relative">
                            <input
                            type={showSignupPassword ? 'text' : 'password'}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                            placeholder="Min. 8 characters"
                            value={signupForm.password}
                            onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              password: e.target.value
                            })
                            }
                            required
                            disabled={isLoading} />

                            <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() =>
                            setShowSignupPassword(!showSignupPassword)
                            }
                            tabIndex={-1}>

                              {showSignupPassword ?
                            <EyeOffIcon className="h-4 w-4" /> :

                            <EyeIcon className="h-4 w-4" />
                            }
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                            placeholder="Repeat password"
                            value={signupForm.confirmPassword}
                            onChange={(e) =>
                            setSignupForm({
                              ...signupForm,
                              confirmPassword: e.target.value
                            })
                            }
                            required
                            disabled={isLoading} />

                            <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                            }
                            tabIndex={-1}>

                              {showConfirmPassword ?
                            <EyeOffIcon className="h-4 w-4" /> :

                            <EyeIcon className="h-4 w-4" />
                            }
                            </button>
                          </div>
                        </div>

                        <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        className="mt-4 h-11 text-base shadow-sm">

                          {isLoading ?
                        <>
                              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                              Creating account...
                            </> :

                        'Create Account'
                        }
                        </Button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Already have an account?{' '}
                          <button
                          type="button"
                          onClick={() => toggleMode('login')}
                          className="font-semibold text-[#C8102E] hover:text-[#A00D25] transition-colors"
                          disabled={isLoading}>

                            Sign in
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Lab Bird System
      </div>
    </div>);

}