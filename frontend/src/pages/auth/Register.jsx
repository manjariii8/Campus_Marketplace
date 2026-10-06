import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, ShieldCheck, MapPin } from "lucide-react";

import PasswordInput from "../../components/auth/PasswordInput";
import { Button, Input } from "../../components/ui";
import { registerSchema } from "../../validation/authSchema";
import useAuth from "../../hooks/useAuth";
import api from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [campusesLoading, setCampusesLoading] = useState(true);
  const [campuses, setCampuses] = useState([]);
  const [campusError, setCampusError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      campusId: undefined,
    },
  });

  useEffect(() => {
    const loadCampuses = async () => {
      try {
        setCampusesLoading(true);
        setCampusError("");

        const response = await api.get("/campuses");

        const data = response?.data;

        // Supports both:
        // 1. Raw array response
        // 2. ApiResponse wrapper containing data
        const campusList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setCampuses(campusList);
      } catch (error) {
        console.error("Failed to load campuses:", error);

        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to load campuses. Please try again.";

        setCampusError(message);
      } finally {
        setCampusesLoading(false);
      }
    };

    loadCampuses();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setRegistrationError("");

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        campusId: Number(data.campusId),
      };

      await registerUser(payload);

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed. Please try again.";

      setRegistrationError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white bg-white shadow-xl">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="p-6 sm:p-10">
            <Link
              to="/"
              className="mb-8 flex items-center justify-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <Store size={25} />
              </span>

              <span className="text-xl font-bold text-slate-900">
                Campus Reuse Marketplace
              </span>
            </Link>

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Join your campus community to discover affordable items
                and give unused essentials a second life.
              </p>
            </div>

            {registrationError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {registrationError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <Input
                label="Full name"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Enter your full name"
                autoComplete="name"
              />

              <Input
                label="Email address"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <PasswordInput
                label="Password"
                name="password"
                register={register}
                error={errors.password}
              />

              <PasswordInput
                label="Confirm password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword}
              />

              <div>
                <label
                  htmlFor="campusId"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Campus / University
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="campusId"
                    {...register("campusId", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                    disabled={campusesLoading || !!campusError}
                    className={`w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                      errors.campusId
                        ? "border-red-300"
                        : "border-slate-200"
                    } ${
                      campusesLoading || campusError
                        ? "cursor-not-allowed bg-slate-100"
                        : ""
                    }`}
                  >
                    <option value="">
                      {campusesLoading
                        ? "Loading campuses..."
                        : "Select your campus"}
                    </option>

                    {campuses.map((campus) => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name} — {campus.city}, {campus.state}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.campusId && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.campusId.message}
                  </p>
                )}

                {campusError && (
                  <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {campusError}
                  </div>
                )}

                {!campusesLoading &&
                  !campusError &&
                  campuses.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">
                      No active campuses are currently available.
                    </p>
                  )}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-5 text-blue-900">
                  Your account is created with the standard customer role.
                  You can apply to become a seller after signing in.
                </p>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={
                  loading ||
                  campusesLoading ||
                  !!campusError ||
                  campuses.length === 0
                }
                className="w-full"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-slate-400">
              By creating an account, you agree to use the marketplace
              responsibly and respect other students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;