import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urlToProcess = body.url;

    if (!urlToProcess || typeof urlToProcess !== "string") {
      return new Response(
        JSON.stringify({ error: "URL é obrigatória e deve ser uma string." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const google = createGoogleGenerativeAI();
    const model = google("models/gemini-2.0-flash");

    const result = await streamText({
      model: model,
      prompt: `Tarefa: Gerar uma descrição textual concisa para o conteúdo da página web da URL fornecida.
              A descrição deve:
              1. Ser puramente textual, sem qualquer formatação (como Markdown, negrito, etc.).
              2. Ter entre 1 a 3 frases.
              3. Explicar de forma objetiva e direta o propósito principal e o conteúdo do site.
              4. Facilitar ao usuário lembrar do que se trata o site.

              Instruções Estritas para a Saída:
              -   NÃO inclua nenhum título, cabeçalho, nome do site como prefixo, ou qualquer texto introdutório (ex: "Descrição para o link:", "Este site é sobre:").
              -   NÃO utilize Markdown ou qualquer outra forma de formatação de texto.
              -   Retorne APENAS o texto da descrição como um parágrafo simples.

              Exemplo de saída NÃO desejada:
              "## Descrição para Exemplo.com:
              **Exemplo.com:** Este é um site de exemplos."

              Exemplo de saída DESEJADA (apenas o texto):
              "Plataforma online para criar e compartilhar exemplos de projetos diversos de forma colaborativa."

              Analise o conteúdo da URL: ${urlToProcess} e forneça a descrição conforme as instruções acima.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Erro ao gerar descrição com IA:", error);
    let errorMessage = "Falha ao gerar descrição.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
