import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateLink } from "./_components/createLink";
import LinksData from "./_components/links/linksData";
import { CreditCard, Link2 } from "lucide-react";
import { getLinks } from "./actions/linksActions";
import { parseAsInteger, createLoader } from 'nuqs/server';
import type { SearchParams } from 'nuqs/server'

const dashboardSearchParamsParsers = {
  page: parseAsInteger.withDefault(1),
  // q: parseAsString.withDefault(''), // Para busca server-side no futuro
};
const loadDashboardParams = createLoader(dashboardSearchParamsParsers);
type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { page: currentPage } = await loadDashboardParams(searchParams ?? {});
  const paginatedLinkData = await getLinks({ page: currentPage, limit: 10 });


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
        <LinksData
        initialLinks={paginatedLinkData.links}
        totalPages={paginatedLinkData.totalPages}
        currentPage={paginatedLinkData.currentPage}
        totalCount={paginatedLinkData.totalCount}
      />
        </TabsContent>
        <TabsContent value="overview" className="space-y-4">
         
        </TabsContent>
      </Tabs>
    </div>
  );
}
