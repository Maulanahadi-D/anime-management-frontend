import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Registrasi berhasil!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.message
        || 'Registrasi gagal.';
      toast.error(msg);
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
        placeholder="Pilih username"
      />
      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'Email wajib diisi', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid' } })}
        error={errors.email?.message}
        placeholder="email@example.com"
      />
      <Input
        label="Password"
        type="password"
        {...register('password', { required: 'Password wajib diisi', minLength: { value: 6, message: 'Minimal 6 karakter' } })}
        error={errors.password?.message}
        placeholder="Minimal 6 karakter"
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Daftar
      </Button>
      <p className="text-center text-sm text-slate-400">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-violet-400 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
