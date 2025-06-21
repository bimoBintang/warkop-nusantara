import { LoginForm } from "@/components/loginForm";


export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Masuk ke akun Anda
                </h2>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}