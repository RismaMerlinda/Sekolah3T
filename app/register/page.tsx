"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, SubmitErrorHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const registerSchema = z
    .object({
        schoolName: z.string().min(3, "Nama sekolah minimal 3 karakter"),
        npsn: z.string().length(8, "NPSN harus 8 digit"),
        email: z.string().email("Email tidak valid"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak sama",
        path: ["confirmPassword"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            await api.post("/auth/register", {
                schoolName: data.schoolName,
                npsn: data.npsn,
                email: data.email,
                password: data.password,
            });

            toast.success("Registrasi berhasil!");
            setIsSuccess(true);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onError: SubmitErrorHandler<RegisterForm> = (errors) => {
        toast.error("Mohon lengkapi semua data yang wajib diisi!");
        console.log("Form Errors:", errors);
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                router.replace("/login");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);


    // ================= SUCCESS PAGE =================
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-bg">
                <Card className="p-8 text-center shadow-xl">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Registrasi Berhasil!</h2>
                    <p>Akun sekolah Anda telah dibuat.</p>
                    <p className="text-sm text-gray-500 mt-2">Mengalihkan ke halaman login...</p>
                </Card>
            </div>
        );
    }

    // ================= FORM PAGE =================
    return (
        <div className="min-h-screen bg-secondary-bg flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-neutral-heading">
                        Daftar Sekolah
                    </h1>
                    <p className="mt-2 text-sm text-neutral-body">
                        Gabung bersama{" "}
                        <span className="font-semibold text-primary">SAHABAT3T</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <Input
                        label="Nama Sekolah"
                        {...register("schoolName")}
                        error={errors.schoolName?.message}
                    />
                    <Input
                        label="NPSN"
                        {...register("npsn")}
                        error={errors.npsn?.message}
                    />
                    <Input
                        label="Email Sekolah"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={errors.password?.message}
                    />
                    <Input
                        label="Konfirmasi Password"
                        type="password"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                    />

                    <Button type="submit" isLoading={isLoading} className="mt-6 w-full">
                        Daftar Sekarang
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-body">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-primary-600"
                    >
                        Masuk disini
                    </Link>
                </p>
            </Card>
        </div>
    );
}
