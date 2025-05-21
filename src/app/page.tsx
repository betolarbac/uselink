import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bookmark, FolderLock, Layers, Link2, Tag } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col mx-auto ">
      <nav className="w-full py-4 z-50 relative">
        <div className="container mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-primary" />
            <span className="text-white font-bold text-xl">UseLink</span>
          </a>

          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Preços
            </a>
            <a
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="dark:text-white">
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="py-20 md:py-32 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Organize seus links de forma{" "}
              <span className="gradient-text">inteligente</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Guarde, organize e compartilhe seus links favoritos em um só
              lugar. Com pastas, categorias e proteção por senha.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Button className="bg-bg-primary hover:bg-brand-darkBlue text-white px-8 py-6 text-lg">
                Começar agora
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg">
                Ver demonstração
              </Button>
            </div>

            <div className="mt-16 md:mt-20 relative animate-float">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-1/4"></div>
              <div className="bg-gradient-to-b from-brand-gray to-brand-darkGray p-2 rounded-xl border border-gray-700 relative z-10">
                <div className="bg-brand-black rounded-lg p-1">
                  <Image
                    src="/placeholder.png"
                    alt="LinkVault Dashboard"
                    className="rounded-lg w-full"
                    width={1200}
                    height={675}
                    quality={100}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Funcionalidades
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Tudo o que você precisa para gerenciar seus links de forma
                  eficiente
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Bookmark className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Guarda de Links</h3>
                <p className="text-center text-muted-foreground">
                  Adicione, edite e exclua links facilmente. Cada link pode ter
                  título, descrição, tags e URL personalizada.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Layers className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Pastas Organizadas</h3>
                <p className="text-center text-muted-foreground">
                  Organize seus links em pastas customizáveis com suporte para
                  subpastas e hierarquia.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Tag className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Categorias e Tags</h3>
                <p className="text-center text-muted-foreground">
                  Crie categorias personalizadas e use tags para filtrar e
                  encontrar seus links rapidamente.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <FolderLock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Pastas Secretas</h3>
                <p className="text-center text-muted-foreground">
                  Proteja seus links sensíveis com pastas criptografadas e
                  protegidas por senha.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Planos e Preços
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Escolha o plano que melhor atende às suas necessidades
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
              <div className="flex flex-col rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <div className="mt-4 text-3xl font-bold">R$ 0</div>
                  <p className="mt-2 text-muted-foreground">
                    Para uso pessoal básico
                  </p>
                </div>
                <div className="flex flex-col p-6">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Até 50 links
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Até 5 pastas
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Categorias básicas
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Sem pastas secretas
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                      Sem subpastas
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register">
                      <Button className="w-full dark:text-white">
                        Começar grátis
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                  Popular
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <div className="mt-4 text-3xl font-bold">
                    R$ 9,90
                    <span className="text-sm font-normal text-muted-foreground">
                      /mês
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Para uso profissional e avançado
                  </p>
                </div>
                <div className="flex flex-col p-6">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Links ilimitados
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Pastas ilimitadas
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Categorias avançadas
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Pastas secretas com senha
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Suporte para subpastas
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register?plan=premium">
                      <Button
                        className="w-full dark:text-white"
                        variant="default"
                      >
                        Assinar Premium
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Perguntas Frequentes
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Respostas para as dúvidas mais comuns
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 py-12">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">
                  Como funciona o armazenamento de links?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Seus links são armazenados de forma segura em nossa
                  plataforma. Você pode acessá-los de qualquer dispositivo com
                  acesso à internet.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">
                  Posso compartilhar minhas pastas com outras pessoas?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Sim, você pode compartilhar pastas específicas com outros
                  usuários ou gerar links públicos para compartilhamento.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">
                  Como funcionam as pastas secretas?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  As pastas secretas são protegidas por senha. Apenas pessoas
                  com a senha correta podem acessar o conteúdo dessas pastas.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-bold">
                  Posso mudar de plano depois?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento. As mudanças entram em vigor imediatamente.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="mx-auto flex flex-col items-center justify-between gap-4 md:flex-row max-w-7xl">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">LinkVault</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LinkVault. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Termos
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
