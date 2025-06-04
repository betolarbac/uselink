import { ExternalLink } from "lucide-react";
import { LinkTable } from "../_components/links/link-table";
export const dynamic = 'force-dynamic';
import { getPublicLinks } from "../actions/linksActions";

export default async function DiscoveryPage() {
  const { links: publicLinks } = await getPublicLinks();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Discovery</h2>
        <p className="text-muted-foreground">
          Explore links públicos compartilhados por outros usuários.
        </p>
      </div>

      {publicLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <ExternalLink className="w-10 h-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">
            Nenhum link público encontrado.
          </h3>
          <p className="text-muted-foreground">
            Parece que ainda não há links públicos para explorar ou você chegou
            ao fim.
          </p>
        </div>
      ) : (
        <LinkTable links={publicLinks} contexto="discovery" />
      )}
    </div>
  );
}
