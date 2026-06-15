import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../../store/AuthContext';
import {
  getUser,
  uploadAvatar,
  updateProfile,
  changePassword,
  getXpTransactions,
  UserProfile,
  XpTransaction,
} from '../../../api/userApi';
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validatePersonName,
  validateBirthday,
} from '../../../utils/validation';

export const useProfilePage = () => {
  const { userId, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<XpTransaction[]>([]);
  const [visibleTxCount, setVisibleTxCount] = useState(8);
  const [activeTab, setActiveTab] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const data = await getUser(userId);
        setProfile(data);
        setFullName(data.fullName);
        setUsername(data.username);
        setEmail(data.email);
        setSex(data.sex || '');
        setBirthday(data.birthday ? data.birthday.substring(0, 10) : '');
      } catch {
        setToastType('error');
        setToastMessage('Failed to load user profile.');
      }
    };

    const fetchTransactions = async () => {
      try {
        const txData = await getXpTransactions(userId);
        setTransactions(txData);
      } catch {
        console.error('Failed to load XP history.');
      }
    };

    fetchUser();
    fetchTransactions();
  }, [userId]);

  const handleAvatarUpload = async (file: File) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const newAvatarUrl = await uploadAvatar(userId, file);
      if (profile) {
        setProfile({ ...profile, avatarUrl: newAvatarUrl });
      }
      setToastType('success');
      setToastMessage('Avatar uploaded successfully.');
    } catch {
      setToastType('error');
      setToastMessage('Failed to upload avatar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !profile) return;

    const nextFullNameError = validatePersonName(fullName, 'Full Name');
    const nextUsernameError = validateUsername(username);
    const nextEmailError = validateEmail(email);
    const nextBirthdayError = validateBirthday(birthday);

    setFullNameError(nextFullNameError);
    setUsernameError(nextUsernameError);
    setEmailError(nextEmailError);
    setBirthdayError(nextBirthdayError);

    if (nextFullNameError || nextUsernameError || nextEmailError || nextBirthdayError) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        sex: sex,
        birthday: birthday || undefined,
      };

      await updateProfile(userId, updatedData);
      setProfile({
        ...profile,
        fullName: updatedData.fullName,
        username: updatedData.username,
        email: updatedData.email,
        sex: updatedData.sex,
        birthday: updatedData.birthday,
      });

      setToastType('success');
      setToastMessage('Profile updated successfully.');
    } catch (err: any) {
      setToastType('error');
      const apiError = err.response?.data || 'Failed to update profile.';
      const errorMessage = typeof apiError === 'string' ? apiError : 'Failed to update profile.';
      setToastMessage(errorMessage);
      if (errorMessage.toLowerCase().includes('username')) {
        setUsernameError(errorMessage);
      } else if (errorMessage.toLowerCase().includes('email')) {
        setEmailError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    const nextCurrentPasswordError = currentPassword ? '' : 'Current password is required.';
    const nextNewPasswordError = validatePassword(newPassword);
    const nextConfirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);

    setCurrentPasswordError(nextCurrentPasswordError);
    setNewPasswordError(nextNewPasswordError);
    setConfirmPasswordError(nextConfirmPasswordError);

    if (nextCurrentPasswordError || nextNewPasswordError || nextConfirmPasswordError) {
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(userId, {
        currentPassword,
        newPassword,
      });
      setToastType('success');
      setToastMessage('Password changed successfully. Logging out...');
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err: any) {
      setToastType('error');
      const apiError = err.response?.data || 'Failed to change password.';
      setToastMessage(typeof apiError === 'string' ? apiError : 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = profile?.stats || {
    currentLevel: 1,
    currentXp: 0,
    xpToNextLevel: 100,
    totalDaysActive: 0,
    totalHabitsDone: 0,
    totalXpEarned: 0,
  };

  const getLevelProgress = () => {
    const currentLevel = stats.currentLevel;
    const totalXpEarned = stats.totalXpEarned;
    const xpStart = currentLevel > 1 ? Math.pow((currentLevel - 1) * 10, 2) : 0;
    const xpEnd = Math.pow(currentLevel * 10, 2);
    const range = xpEnd - xpStart;
    const progressInLevel = totalXpEarned - xpStart;
    const progressPercent = Math.min(100, Math.max(0, (progressInLevel / range) * 100));
    const xpLeft = Math.max(0, xpEnd - totalXpEarned);
    const percentLeft = Math.min(100, Math.max(0, (xpLeft / range) * 100));

    return {
      progress: progressPercent,
      xpLeft,
      percentLeft: Math.round(percentLeft),
    };
  };

  const levelInfo = getLevelProgress();
  const xpPercentage = levelInfo.progress;
  const xpLeft = levelInfo.xpLeft;
  const percentLeft = levelInfo.percentLeft;

  return {
    profile,
    transactions,
    visibleTxCount,
    setVisibleTxCount,
    activeTab,
    setActiveTab,
    toastMessage,
    setToastMessage,
    toastType,
    isLoading,
    fullName,
    setFullName,
    username,
    setUsername,
    email,
    setEmail,
    sex,
    setSex,
    birthday,
    setBirthday,
    fullNameError,
    setFullNameError,
    usernameError,
    setUsernameError,
    emailError,
    setEmailError,
    birthdayError,
    setBirthdayError,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    setCurrentPasswordError,
    newPasswordError,
    setNewPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
    handleAvatarUpload,
    handleProfileSubmit,
    handlePasswordSubmit,
    stats,
    xpPercentage,
    xpLeft,
    percentLeft,
  };
};
