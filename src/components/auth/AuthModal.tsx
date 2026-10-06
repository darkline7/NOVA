import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onCompleteAuth: (isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onCompleteAuth,
}) => {
  const { showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>(
    initialMode
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (mode === 'signup') {
        setMode('verify');
        showToast('Verification code sent to ' + email, 'info');
      } else if (mode === 'verify') {
        showToast('Email verified! Setting up your identity...', 'success');
        onClose();
        onCompleteAuth(true); // Triggers onboarding
      } else if (mode === 'login') {
        showToast('Welcome back to NOVA', 'success');
        onClose();
        onCompleteAuth(false);
      } else if (mode === 'forgot') {
        showToast('Password recovery instructions dispatched', 'info');
        setMode('login');
      }
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'signup'
          ? 'Join NOVA'
          : mode === 'login'
          ? 'Welcome Back'
          : mode === 'verify'
          ? 'Verify Email'
          : 'Reset Password'
      }
      description={
        mode === 'signup'
          ? 'Your identity. Your interests. Your world.'
          : mode === 'login'
          ? 'Enter your credentials to access your personalized feed.'
          : mode === 'verify'
          ? 'Enter the 6-digit confirmation code sent to your inbox.'
          : 'We will send a secure password reset link to your email.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {mode === 'signup' && (
          <>
            <Input
              label="Full Name / Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Chen"
              required
            />
            <Input
              label="Unique Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alexchen"
              required
            />
          </>
        )}

        {(mode === 'signup' || mode === 'login' || mode === 'forgot') && (
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            required
          />
        )}

        {(mode === 'signup' || mode === 'login') && (
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />
        )}

        {mode === 'verify' && (
          <Input
            label="6-Digit Verification Code"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="748291"
            required
          />
        )}

        {mode === 'login' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-indigo-400 hover:underline text-[11px]"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          variant="primary"
          isLoading={loading}
          size="md"
        >
          {mode === 'signup'
            ? 'Continue to Verification'
            : mode === 'verify'
            ? 'Verify & Start Onboarding'
            : mode === 'login'
            ? 'Sign In to NOVA'
            : 'Send Reset Link'}
        </Button>

        {/* Footer Mode Switchers */}
        <div className="pt-2 text-center text-neutral-400 text-[11px]">
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'login' && (
            <p>
              New to NOVA?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-400 hover:underline font-medium"
              >
                Create Account
              </button>
            </p>
          )}

          {(mode === 'forgot' || mode === 'verify') && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-neutral-400 hover:text-white"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
