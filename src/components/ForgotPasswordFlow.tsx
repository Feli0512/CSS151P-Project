import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  MailIcon,
  ArrowLeftIcon,
  Loader2Icon,
  CheckCircleIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  KeyRoundIcon } from
'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
type Step = 'email' | 'otp' | 'new-password' | 'success';
interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
  userType?: 'student' | 'admin';
}
export function ForgotPasswordFlow({
  onBackToLogin,
  userType = 'student'
}: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);
  // Auto-redirect after success
  useEffect(() => {
    if (step !== 'success') return;
    const timeout = setTimeout(() => {
      onBackToLogin();
    }, 4000);
    return () => clearTimeout(timeout);
  }, [step, onBackToLogin]);
  const apiSendCode = useCallback(
    async (
    emailAddress: string)
    : Promise<{
      success: boolean;
      message: string;
    }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Verification code sent to your email.'
          });
        }, 1200);
      });
    },
    [userType]
  );
  const apiVerifyCode = useCallback(
    async (
    emailAddress: string,
    code: string)
    : Promise<{
      success: boolean;
      reset_token?: string;
      message?: string;
    }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (code.length === 6) {
            resolve({
              success: true,
              reset_token: 'simulated_token_' + Date.now()
            });
          } else {
            resolve({
              success: false,
              message: 'Invalid verification code.'
            });
          }
        }, 1000);
      });
    },
    [userType]
  );
  const apiResetPassword = useCallback(
    async (
    emailAddress: string,
    token: string,
    password: string)
    : Promise<{
      success: boolean;
      message: string;
    }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Password has been reset successfully.'
          });
        }, 1000);
      });
    },
    [userType]
  );
  const apiResendCode = useCallback(
    async (
    emailAddress: string)
    : Promise<{
      success: boolean;
      message: string;
    }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'A new verification code has been sent.'
          });
        }, 800);
      });
    },
    [userType]
  );
  // --- Handlers ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    // Validate email domain based on userType
    if (userType === 'student' && !email.endsWith('@mymail.mapua.edu.ph')) {
      setError('Please enter a valid @mymail.mapua.edu.ph email.');
      return;
    }
    if (userType === 'admin' && email.endsWith('@mymail.mapua.edu.ph')) {
      setError('Student emails cannot be used for admin password reset.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiSendCode(email);
      if (result.success) {
        setStep('otp');
        setResendCooldown(60);
      } else {
        setError(result.message || 'Failed to send verification code.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);
    // Auto-advance to next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.
    getData('text').
    replace(/\D/g, '').
    slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      // Focus the next empty input or the last one
      const nextEmpty = newOtp.findIndex((d) => !d);
      otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
    }
  };
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiVerifyCode(email, code);
      if (result.success && result.reset_token) {
        setResetToken(result.reset_token);
        setStep('new-password');
      } else {
        setError(result.message || 'Invalid verification code.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsLoading(true);
    try {
      const result = await apiResendCode(email);
      if (result.success) {
        setOtp(['', '', '', '', '', '']);
        setResendCooldown(60);
        otpRefs.current[0]?.focus();
      } else {
        setError(result.message || 'Failed to resend code.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await apiResetPassword(email, resetToken, newPassword);
      if (result.success) {
        setStep('success');
      } else {
        setError(result.message || 'Failed to reset password.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const passwordMeetsLength = newPassword.length >= 8;
  const passwordsMatch =
  newPassword === confirmPassword && confirmPassword.length > 0;
  const slideVariants = {
    enter: {
      opacity: 0,
      x: 20
    },
    center: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: -20
    }
  };
  return (
    <div>
      <AnimatePresence mode="wait">
        {error &&
        <motion.div
          key="error"
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
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Step 1: Email Entry */}
        {step === 'email' &&
        <motion.div
          key="step-email"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.2
          }}>
          
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <MailIcon className="w-7 h-7 text-[#C8102E]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reset your password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email and we'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <Input
              label="Email Address"
              type="email"
              placeholder={
              userType === 'student' ?
              'you@mymail.mapua.edu.ph' :
              'admin@mapua.edu.ph'
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              disabled={isLoading} />
            

              <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="h-11 text-base shadow-sm">
              
                {isLoading ?
              <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Sending code...
                  </> :

              'Send Verification Code'
              }
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
              type="button"
              onClick={onBackToLogin}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isLoading}>
              
                <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                Back to Sign In
              </button>
            </div>
          </motion.div>
        }

        {/* Step 2: OTP Verification */}
        {step === 'otp' &&
        <motion.div
          key="step-otp"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.2
          }}>
          
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-7 h-7 text-[#C8102E]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                We sent a 6-digit code to{' '}
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3 text-center">
                  Verification Code
                </label>
                <div
                className="flex items-center justify-center gap-2.5"
                onPaste={handleOtpPaste}>
                
                  {otp.map((digit, index) =>
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={isLoading}
                  className={`w-11 h-13 text-center text-xl font-bold rounded-lg border-2 transition-all duration-150
                        focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E]
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${digit ? 'border-[#C8102E] bg-red-50/50' : 'border-gray-300 bg-white'}
                      `}
                  aria-label={`Digit ${index + 1} of verification code`} />

                )}
                </div>
              </div>

              <Button
              type="submit"
              fullWidth
              disabled={isLoading || otp.join('').length !== 6}
              className="h-11 text-base shadow-sm">
              
                {isLoading ?
              <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </> :

              'Verify Code'
              }
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                {resendCooldown > 0 ?
              <span className="font-medium text-gray-400">
                    Resend in {resendCooldown}s
                  </span> :

              <button
                type="button"
                onClick={handleResendCode}
                className="font-semibold text-[#C8102E] hover:text-[#A00D25] transition-colors"
                disabled={isLoading}>
                
                    Resend code
                  </button>
              }
              </p>
              <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp(['', '', '', '', '', '']);
                setError(null);
              }}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isLoading}>
              
                <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
                Use a different email
              </button>
            </div>
          </motion.div>
        }

        {/* Step 3: New Password */}
        {step === 'new-password' &&
        <motion.div
          key="step-password"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.2
          }}>
          
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <KeyRoundIcon className="w-7 h-7 text-[#C8102E]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create new password
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Your new password must be at least 8 characters
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={isLoading} />
                
                  <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}>
                  
                    {showNewPassword ?
                  <EyeOffIcon className="h-4 w-4" /> :

                  <EyeIcon className="h-4 w-4" />
                  }
                  </button>
                </div>
                {/* Password strength indicator */}
                {newPassword.length > 0 &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                className="flex items-center gap-1.5 mt-1.5">
                
                    <div
                  className={`h-1 flex-1 rounded-full transition-colors ${newPassword.length >= 3 ? newPassword.length >= 8 ? 'bg-green-500' : 'bg-amber-400' : 'bg-gray-200'}`} />
                
                    <div
                  className={`h-1 flex-1 rounded-full transition-colors ${newPassword.length >= 6 ? newPassword.length >= 8 ? 'bg-green-500' : 'bg-amber-400' : 'bg-gray-200'}`} />
                
                    <div
                  className={`h-1 flex-1 rounded-full transition-colors ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                
                    <span
                  className={`text-xs ml-1 ${passwordMeetsLength ? 'text-green-600' : 'text-gray-400'}`}>
                  
                      {passwordMeetsLength ?
                  '✓ Strong' :
                  `${newPassword.length}/8`}
                    </span>
                  </motion.div>
              }
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition-colors ${confirmPassword.length > 0 && !passwordsMatch ? 'border-red-300' : confirmPassword.length > 0 && passwordsMatch ? 'border-green-300' : 'border-gray-300'}`}
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  disabled={isLoading} />
                
                  <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}>
                  
                    {showConfirmPassword ?
                  <EyeOffIcon className="h-4 w-4" /> :

                  <EyeIcon className="h-4 w-4" />
                  }
                  </button>
                </div>
                {confirmPassword.length > 0 &&
              <motion.p
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                
                    {passwordsMatch ?
                '✓ Passwords match' :
                'Passwords do not match'}
                  </motion.p>
              }
              </div>

              <Button
              type="submit"
              fullWidth
              disabled={isLoading || !passwordMeetsLength || !passwordsMatch}
              className="mt-2 h-11 text-base shadow-sm">
              
                {isLoading ?
              <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Resetting password...
                  </> :

              'Reset Password'
              }
              </Button>
            </form>
          </motion.div>
        }

        {/* Success State */}
        {step === 'success' &&
        <motion.div
          key="step-success"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.3
          }}
          className="text-center py-4">
          
            <motion.div
            initial={{
              scale: 0
            }}
            animate={{
              scale: 1
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.1
            }}
            className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
            
              <CheckCircleIcon className="w-9 h-9 text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password reset successful!
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <Button
            type="button"
            fullWidth
            onClick={onBackToLogin}
            className="h-11 text-base shadow-sm">
            
              Back to Sign In
            </Button>

            <p className="text-xs text-gray-400 mt-4">
              Redirecting automatically in a few seconds...
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}