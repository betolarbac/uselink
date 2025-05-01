import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder, FolderLock, Link2, Pen, Tag, Trash } from "lucide-react";
import { getLinks } from "../../actions/linksActions";

export default async function LinksData() {
  const data = await getLinks();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Links
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pastas</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FolderLock className="h-3 w-3 text-amber-500" />2 pastas
                secretas
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Usado em 1 links</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
              Links Recentes
            </CardTitle>
            <CardDescription>
              Seus links adicionados recentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((link) => (
                  <div key={link.id} className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {link.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Editar</span>
                        <Pen />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Excluir</span>
                        <Trash />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
