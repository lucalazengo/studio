# Employee Manager

O **Employee Manager** é uma aplicação web moderna construída com Next.js e Firebase, projetada para simplificar o gerenciamento de funcionários. A plataforma permite cadastrar, visualizar e gerenciar informações de funcionários de forma centralizada e eficiente...

A interface é responsiva e intuitiva, utilizando componentes `shadcn/ui` e Tailwind CSS para um design limpo e profissional. A aplicação também incorpora funcionalidades de Inteligência Artificial com **Genkit** para validar as fotos dos funcionários no momento do cadastro.

## Funcionalidades Principais

- **Dashboard de Métricas**: Tenha uma visão geral rápida do seu quadro de funcionários com cartões que exibem o número total, funcionários ativos, inativos e suspensos.
- **Cadastro de Funcionários**: Um formulário intuitivo em um modal permite adicionar novos funcionários, com validação de dados em tempo real.
- **Análise de Foto com IA**: Ao fazer o upload da foto de um funcionário, um sistema de IA (Genkit) analisa a imagem para garantir que ela atenda aos padrões da empresa (ex: detecção de rosto, dimensões e tamanho adequados).
- **Listagem e Gerenciamento**: Visualize todos os funcionários em uma tabela com informações essenciais como nome, função, status e data de validade do crachá.
- **Geração de Crachá (Badge)**: Acesse uma página dedicada que exibe o crachá de cada funcionário, incluindo foto, QR Code e informações relevantes.
- **Sistema de Autenticação**: Tela de login para proteger o acesso à plataforma (backend de autenticação pendente).

## Tech Stack

- **Framework**: Next.js (com App Router e React Server Components)
- **Estilização**: Tailwind CSS e `shadcn/ui`
- **Inteligência Artificial**: Genkit (com modelos do Google Gemini)
- **Formulários**: React Hook Form e Zod (para validação de schema)
- **Ícones**: `lucide-react`
- **Backend (Planejado)**: Firebase (Authentication e Firestore)

## Primeiros Passos

### Pré-requisitos

- Node.js (versão 20 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd employee-manager
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:9002`.

## Estrutura do Projeto

Para uma visão detalhada da organização dos arquivos e diretórios, consulte o arquivo [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).
