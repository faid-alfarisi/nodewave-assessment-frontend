'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { UserPlus, ArrowLeft, AlertCircle, Camera, Upload } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PRODUCT_MANAGER' | 'INTERNAL_TEAM' | 'CLIENT_GUEST'>('INTERNAL_TEAM');
  const [department, setDepartment] = useState<'MANAGEMENT' | 'UIUX' | 'FRONTEND' | 'BACKEND' | 'CLIENT'>('FRONTEND');

  // Avatar file state & local preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (selectedRole: any) => {
    setRole(selectedRole);
    if (selectedRole === 'PRODUCT_MANAGER') {
      setDepartment('MANAGEMENT');
    } else if (selectedRole === 'CLIENT_GUEST') {
      setDepartment('CLIENT');
    } else {
      if (department === 'MANAGEMENT' || department === 'CLIENT') {
        setDepartment('FRONTEND');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Avatar file size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('department', department);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAuth(res.data.user, res.data.token);
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#50B1D2] to-[#094C86] shadow-xl shadow-[#50B1D2]/20 mb-3">
            <span className="font-extrabold text-black text-2xl">N</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create NodeWave Account</h1>
          <p className="text-sm text-[#A3A0AF] mt-1">Join as a PM, Engineer, or Client Stakeholder</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[rgba(18,22,28,0.7)] border border-[rgba(80,177,210,0.15)] backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Avatar Upload with Live Preview */}
            <div className="flex flex-col items-center justify-center gap-2 pb-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-20 h-20 rounded-full border-2 border-dashed border-[#50B1D2]/40 hover:border-[#50B1D2] cursor-pointer overflow-hidden flex items-center justify-center bg-[rgba(255,255,255,0.02)] transition-all shadow-lg"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#A3A0AF] group-hover:text-[#50B1D2]">
                    <Camera className="w-6 h-6 mb-0.5" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-[11px] text-[#A3A0AF]">Profile Photo (Optional)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3A0AF] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#50B1D2] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3A0AF] mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@nodewave.id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#50B1D2] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A3A0AF] mb-1.5">Password (Min. 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#50B1D2] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#A3A0AF] mb-1.5">Role (RBAC)</label>
                <select
                  value={role}
                  onChange={(e: any) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] text-white text-xs focus:outline-none focus:border-[#50B1D2]"
                >
                  <option value="INTERNAL_TEAM">INTERNAL_TEAM</option>
                  <option value="PRODUCT_MANAGER">PRODUCT_MANAGER</option>
                  <option value="CLIENT_GUEST">CLIENT_GUEST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A3A0AF] mb-1.5">Department (ABAC)</label>
                <select
                  value={department}
                  disabled={role === 'PRODUCT_MANAGER' || role === 'CLIENT_GUEST'}
                  onChange={(e: any) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.08)] text-white text-xs focus:outline-none focus:border-[#50B1D2] disabled:opacity-40"
                >
                  {role === 'PRODUCT_MANAGER' && <option value="MANAGEMENT">MANAGEMENT</option>}
                  {role === 'CLIENT_GUEST' && <option value="CLIENT">CLIENT</option>}
                  {role === 'INTERNAL_TEAM' && (
                    <>
                      <option value="FRONTEND">FRONTEND</option>
                      <option value="BACKEND">BACKEND</option>
                      <option value="UIUX">UIUX</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-[#50B1D2] to-[#094C86] hover:opacity-90 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#50B1D2]/20 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] text-center">
            <Link
              href="/login"
              className="text-xs text-[#A3A0AF] hover:text-[#50B1D2] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Already have an account? Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
