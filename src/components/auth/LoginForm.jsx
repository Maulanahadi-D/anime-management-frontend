import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Login berhasil!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Username"
        {...register('username', { required: 'Username wajib diisi', minLength: { value: 3, message: 'Minimal 3 karakter' } })}
        error={errors.username?.message}
        placeholder="Masukkan username"
      />
      <Input
        label="Password"
        type="password"
        {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Minimal 6 karakter' } })}
        error={errors.password?.message}
        placeholder="Masukkan password"
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Login
      </Button>
      <p className="text-center text-sm text-slate-400">
        Belum punya akun?{' '}
        <Link to="/register" className="text-violet-400 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
