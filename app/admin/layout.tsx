import { Sidebar } from "./components/admin/sidebar";
import { getSession } from "@/lib/session";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar session={session} />
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto"> {children}</main>
    </div>
  );
}
