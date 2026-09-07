import type { Metadata } from "next";
import LoginPage from "@/features/login/components/loginPage";

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
    return <LoginPage />
}