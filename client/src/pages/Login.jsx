import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <PageWrapper>
      <Helmet><title>Sign In - XRSave-YT</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl">xrsave <span className="text-brand-500">YT</span></span>
            </Link>
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500 mt-2">Sign in to access your download history</p>
          </div>

          <div className="card p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Email</label>
                <input {...register('email')} type="email" placeholder="you@example.com" className="input-field" autoComplete="email" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-10" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3.5 disabled:opacity-50">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
