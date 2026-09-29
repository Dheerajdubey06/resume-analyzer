import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  Bell,
  SunMoon,
  Trash2,
  AlertTriangle,
  Key,
  ShieldCheck,
  Check,
} from 'lucide-react';

const SettingsPage = () => {
  const { logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Preference toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [atsScoreAlerts, setAtsScoreAlerts] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }

    try {
      setChangingPass(true);
      await userService.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      success('Password successfully changed!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      error('Please type DELETE to confirm account removal.');
      return;
    }

    try {
      setDeleting(true);
      await userService.deleteAccount();
      success('Your account and all associated data have been permanently removed.');
      navigate('/');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete account.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Account & Security Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your login credentials, notifications, and privacy options.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Change Password</h2>
            <p className="text-xs text-slate-400">Ensure your account is using a strong password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={changingPass}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Platform Preferences</h2>
            <p className="text-xs text-slate-400">Configure application alerts and visual theme</p>
          </div>
        </div>

        <div className="space-y-4 pt-2 text-xs">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Analysis Completion Notifications</div>
              <div className="text-slate-400">Receive in-browser alerts when AI finishes processing</div>
            </div>
            <input
              type="checkbox"
              checked={atsScoreAlerts}
              onChange={(e) => setAtsScoreAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="font-semibold text-white">Visual Mode</div>
              <div className="text-slate-400">High-contrast Dark SaaS Theme active</div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold text-[11px]">
              Dark Mode (Default)
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-200">Danger Zone</h2>
            <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Deleting your account will immediately purge your user profile, all uploaded resumes from Cloudinary, all saved job targets, and all AI analysis records. This operation cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete My Account</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm Account Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure? To confirm, please type <strong className="text-rose-400">DELETE</strong> in the field below:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-rose-500 outline-none"
            />
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-40"
              >
                {deleting ? 'Deleting Data...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
