import { PropsWithChildren } from "react";
import { Sidebar } from "./_components/sidebar";
import { Header } from "./_components/header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
