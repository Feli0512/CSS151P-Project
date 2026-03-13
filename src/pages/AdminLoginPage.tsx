import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircleIcon } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AdminUser } from '../types';
import { ForgotPasswordFlow } from '../components/ForgotPasswordFlow';
interface AdminLoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToStudent: () => void;
  onSignupRequest: (
  adminUser: Omit<AdminUser, 'id' | 'status' | 'requestedAt'>)
  => void | boolean;
  adminUsers: AdminUser[];
}
export function AdminLoginPage({
  onLogin,
  onNavigateToStudent,
  onSignupRequest,
  adminUsers
}: AdminLoginPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(
    'login'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: '',
    employeeId: '',
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
    setTimeout(() => {
      setIsLoading(false);
      // Check against adminUsers list
      const adminUser = adminUsers.find(
        (u) => u.email.toLowerCase() === loginForm.email.toLowerCase()
      );
      if (!adminUser) {
        setError('No admin account found with this email.');
        return;
      }
      if (adminUser.status === 'pending') {
        setError('Your admin account is still pending approval.');
        return;
      }
      if (adminUser.status === 'rejected') {
        setError('Your admin account request was rejected.');
        return;
      }
      // Check password
      if (adminUser.password !== loginForm.password) {
        setError('Invalid email or password.');
        return;
      }
      // Successful login
      onLogin({
        name: adminUser.name,
        email: adminUser.email,
        studentId: adminUser.employeeId,
        role: 'admin'
      });
    }, 1000);
  };
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (
    !signupForm.name ||
    !signupForm.employeeId ||
    !signupForm.email ||
    !signupForm.password ||
    !signupForm.confirmPassword)
    {
      setError('Please fill in all fields.');
      return;
    }
    if (signupForm.email.endsWith('@mymail.mapua.edu.ph')) {
      setError('Student emails cannot be used for admin accounts.');
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
    setTimeout(() => {
      setIsLoading(false);
      // Check if email is already registered
      const existingEmail = adminUsers.find(
        (u) => u.email.toLowerCase() === signupForm.email.toLowerCase()
      );
      if (existingEmail) {
        setError('An admin account with this email already exists.');
        return;
      }
      // Check if employee ID is already taken
      const existingId = adminUsers.find(
        (u) => u.employeeId === signupForm.employeeId
      );
      if (existingId) {
        setError('This Employee ID is already registered.');
        return;
      }
      onSignupRequest({
        name: signupForm.name,
        email: signupForm.email,
        employeeId: signupForm.employeeId,
        password: signupForm.password,
        role: 'admin'
      });
      setSuccess('Admin request submitted! Please wait for approval.');
      setMode('login');
      setLoginForm({
        email: signupForm.email,
        password: ''
      });
      setSignupForm({
        name: '',
        employeeId: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }, 1000);
  };
  const toggleMode = (newMode: 'login' | 'signup' | 'forgot-password') => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center relative overflow-hidden">
      {/* Admin specific background styling */}
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 py-12 px-4 sm:px-0">
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
          
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg mb-4">
            <ShieldCheckIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Lab Bird Admin
          </h1>
          <p className="mt-2 text-sm text-blue-200 font-medium tracking-wide uppercase">
            System Administration Portal
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
          
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardContent className="px-4 sm:px-8 py-10">
              <AnimatePresence mode="wait">
                {error && mode !== 'forgot-password' &&
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
                {success && mode !== 'forgot-password' &&
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
                          Admin Access
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Sign in with your administrator credentials
                        </p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <Input
                        label="Admin Email"
                        type="email"
                        placeholder="admin@mapua.edu.ph"
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
                            <button
                            type="button"
                            onClick={() => toggleMode('forgot-password')}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                            
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <input
                            type={showPassword ? 'text' : 'password'}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
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
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}>
                            
                              {showPassword ?
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
                        className="mt-4 h-11 text-base shadow-sm bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500">
                        
                          {isLoading ?
                        <>
                              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                              Authenticating...
                            </> :

                        'Sign In as Admin'
                        }
                        </Button>
                      </form>

                      <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-gray-600">
                          Need admin access?{' '}
                          <button
                          type="button"
                          onClick={() => toggleMode('signup')}
                          className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          disabled={isLoading}>
                          
                            Request account
                          </button>
                        </p>

                        <div className="pt-4 border-t border-gray-100">
                          <button
                          type="button"
                          onClick={onNavigateToStudent}
                          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                          disabled={isLoading}>
                          
                            <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                            Return to Student Portal
                          </button>
                        </div>
                      </div>
                    </motion.div> :
                  mode === 'signup' ?
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
                          Request Admin Access
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Your account will require approval from an existing
                          administrator
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
                        label="Employee ID"
                        type="text"
                        placeholder="e.g. EMP-12345"
                        value={signupForm.employeeId}
                        onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          employeeId: e.target.value
                        })
                        }
                        required
                        disabled={isLoading} />
                      

                        <Input
                        label="Work Email Address"
                        type="email"
                        placeholder="you@mapua.edu.ph"
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
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
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
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
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
                        className="mt-4 h-11 text-base shadow-sm bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500">
                        
                          {isLoading ?
                        <>
                              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                              Submitting request...
                            </> :

                        'Request Admin Access'
                        }
                        </Button>
                      </form>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                          Already have an account?{' '}
                          <button
                          type="button"
                          onClick={() => toggleMode('login')}
                          className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          disabled={isLoading}>
                          
                            Sign in
                          </button>
                        </p>
                      </div>
                    </motion.div> :

                  <motion.div
                    key="forgot-password"
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
                    
                      <ForgotPasswordFlow
                      onBackToLogin={() => toggleMode('login')}
                      userType="admin" />
                    
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Lab Bird System • Admin Portal
      </div>
    </div>);

}