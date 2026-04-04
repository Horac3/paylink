import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const schema = z
  .object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: Omit<FormData, 'confirmPassword'>) => authApi.register(data),
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth(data.accessToken, data.refreshToken, null);
      const merchant = await authApi.me();
      setAuth(data.accessToken, data.refreshToken, {
        id: merchant.id,
        email: merchant.email,
        businessName: merchant.businessName,
        feeTier: merchant.feeTier,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Registration failed. Email may already be in use.');
    },
  });

  const onSubmit = ({ confirmPassword: _confirmPassword, ...data }: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">PayLink</h1>
          <p className="mt-2 text-text-secondary">Create your merchant account</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Business Name"
              placeholder="Acme Corp"
              error={errors.businessName?.message}
              {...register('businessName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@business.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" loading={mutation.isPending} className="w-full mt-2">
              Create Account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
