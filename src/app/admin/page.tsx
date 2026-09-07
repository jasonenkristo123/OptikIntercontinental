import type { Metadata } from "next";
import AdminDashboardPage from "@/features/admin/components/adminPage";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Admin() {
    return (
        <section>
            <AdminDashboardPage />
        </section>
    )
}