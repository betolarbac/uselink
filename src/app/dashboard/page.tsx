import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkTable } from "./_components/links/link-table";
import { CreateLink } from "./_components/createLink";
import LinksData from "./_components/links/linksData";
import { CreditCard, Link2 } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Gerencie seus links, pastas e categorias
          </p>
        </div>
        <div className="max-w-28">
          <CreateLink />
        </div>
      </div>
      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="links"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Link2 className="h-4 w-4" />
            Links
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 cursor-pointer"
          >
            <CreditCard />
            Visão Geral
          </TabsTrigger>
        </TabsList>
        <TabsContent value="links" className="space-y-4">
          <LinkTable />
        </TabsContent>
        <TabsContent value="overview" className="space-y-4">
          <LinksData />
        </TabsContent>
      </Tabs>
    </div>
  );
}
