
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginSchema } from "../../validation/authSchema";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import { Button, Input } from "../../components/ui";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Send only the credentials. The backend determines the user's role.
      const loggedInUser = await login({
        email: data.email.trim(),
        password: data.password,
      });

      toast.success("Login successful!");

      // Redirect using the role returned by the backend.
      switch (loggedInUser.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        case "SELLER":
          navigate("/seller", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="w-full">
        {/* Brand */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="group inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
              M
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Campus Reuse
            </span>
          </Link>
        </div>

        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to your account to continue."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            register={register}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            register={register}
            error={errors.password}
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-500">
          Seller and administrator access is determined by your account
          permissions.
        </p>
      </div>
    </AuthCard>
  );
};

export default Login;
