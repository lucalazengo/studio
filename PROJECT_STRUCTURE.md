# Estrutura do Projeto: Employee Manager

Este documento descreve a estrutura de arquivos e diretórios do projeto Employee Manager, uma aplicação Next.js para gerenciamento de funcionários.

## Diretório Raiz (`/`)

Contém arquivos de configuração globais do projeto.

- **`.env`**: Arquivo para variáveis de ambiente.
- **`apphosting.yaml`**: Configuração para deploy no Firebase App Hosting.
- **`components.json`**: Configuração dos componentes da biblioteca `shadcn/ui`.
- **`next.config.ts`**: Arquivo de configuração do Next.js.
- **`package.json`**: Lista as dependências e scripts do projeto (`npm run dev`, `npm run build`, etc.).
- **`README.md`**: Documentação principal do projeto.
- **`tailwind.config.ts`**: Arquivo de configuração do Tailwind CSS.
- **`tsconfig.json`**: Arquivo de configuração do TypeScript.

---

## Diretório `src/`

Abriga todo o código-fonte da aplicação.

### `src/ai/`

Contém a lógica de Inteligência Artificial implementada com Genkit.

- **`genkit.ts`**: Inicializa e configura a instância global do Genkit, definindo o modelo de linguagem a ser utilizado (ex: Gemini).
- **`dev.ts`**: Ponto de entrada para o ambiente de desenvolvimento do Genkit, usado para registrar e testar os `flows`.
- **`flows/analyze-employee-photo.ts`**: Implementa um *flow* de IA para analisar a foto de um funcionário. Ele utiliza ferramentas (`tools`) para verificar a integridade da imagem, dimensões e a presença de um rosto, retornando um feedback sobre a qualidade da foto.

### `src/app/`

Diretório principal do Next.js (App Router).

- **`layout.tsx`**: Layout raiz da aplicação. Define a estrutura HTML base e inclui o `Toaster` para notificações.
- **`globals.css`**: Estilos CSS globais e variáveis de tema (cores, fontes) do Tailwind CSS.
- **`page.tsx`**: Página raiz que redireciona o usuário para `/login`.

#### `src/app/(auth)/`

Grupo de rotas para autenticação.

- **`layout.tsx`**: Layout para as páginas de autenticação, que as centraliza na tela.
- **`login/page.tsx`**: Página de login com campos para e-mail e senha.

#### `src/app/(app)/`

Grupo de rotas para a área logada da aplicação.

- **`layout.tsx`**: Layout principal da aplicação, que inclui a `Sidebar` e o `Header`.
- **`dashboard/page.tsx`**: Painel principal que exibe métricas (total de funcionários, ativos, etc.) e a tabela de funcionários.
- **`employees/[id]/badge/page.tsx`**: Página dinâmica que renderiza o crachá de um funcionário específico com base no seu `id`.

### `src/components/`

Contém os componentes React da aplicação.

- **`ui/`**: Componentes reutilizáveis da biblioteca `shadcn/ui` (Button, Card, Input, etc.).
- **`app/`**: Componentes específicos da aplicação Employee Manager.
    - **`app-sidebar.tsx`**: A barra de navegação lateral.
    - **`employee-table.tsx`**: Tabela que lista todos os funcionários com ações (editar, ver crachá).
    - **`header.tsx`**: Cabeçalho da aplicação.
    - **`new-employee-dialog.tsx`**: Modal (dialog) para cadastrar um novo funcionário.
    - **`photo-upload.tsx`**: Componente de upload de foto que utiliza a Server Action `analyzePhotoAction` para validar a imagem.
    - **`status-badge.tsx`**: Badge para exibir o status do funcionário (Ativo, Inativo, Suspenso).
    - **`user-nav.tsx`**: Menu do usuário no canto da tela.

### `src/hooks/`

Contém os Hooks React customizados.

- **`use-toast.ts`**: Hook para disparar notificações (toasts) na interface.
- **`use-mobile.ts`**: Hook que detecta se o usuário está em um dispositivo móvel.

### `src/lib/`

Módulos de lógica de negócio, dados e utilitários.

- **`actions.ts`**: Define as "Server Actions" do Next.js. Atualmente, contém `analyzePhotoAction` que executa o flow de análise de foto no servidor.
- **`data.ts`**: Fornece dados estáticos para a aplicação, como a lista de funcionários.
- **`schemas.ts`**: Define os esquemas de validação de dados usando `zod`, como o `employeeSchema` para o formulário de novo funcionário.
- **`utils.ts`**: Funções utilitárias, como `cn` para mesclar classes do Tailwind CSS.
- **`placeholder-images.json` e `placeholder-images.ts`**: Arquivos para gerenciar e carregar imagens de exemplo (placeholders) na aplicação.

### `src/types/`

Define os tipos e interfaces TypeScript utilizados no projeto.

- **`index.ts`**: Contém a definição do tipo `Employee`, que estrutura os dados de um funcionário.
