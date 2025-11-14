# Guia de Integração com Supabase

Este documento fornece um guia passo a passo para configurar e integrar o Supabase como o banco de dados e backend para o projeto **Employee Manager**.

## Passo 1: Configuração do Projeto no Supabase

Antes de conectar a aplicação, você precisa criar um projeto no Supabase e configurar a tabela de funcionários.

1.  **Crie uma Conta e um Projeto**:
    *   Acesse [supabase.com](https://supabase.com/) e crie uma conta.
    *   No seu dashboard, clique em **"New Project"**.
    *   Dê um nome ao seu projeto (ex: `employee-manager`), gere uma senha segura para o banco de dados e escolha a região mais próxima de você.
    *   Aguarde a criação do seu projeto.

2.  **Crie a Tabela `employees`**:
    *   No menu lateral do seu projeto Supabase, vá para **Table Editor**.
    *   Clique em **"Create a new table"**.
    *   Nomeie a tabela como `employees`.
    *   Desabilite a opção "Enable Row Level Security (RLS)" por enquanto, para facilitar o desenvolvimento inicial. **Lembre-se de habilitá-la e configurar as políticas de acesso antes de ir para produção.**
    *   Adicione as seguintes colunas, correspondendo ao tipo `Employee` da nossa aplicação:

| Nome da Coluna   | Tipo      | Chave Primária |
| :--------------- | :-------- | :------------- |
| `id`             | `text`    | ✅ (Sim)       |
| `name`           | `text`    |                |
| `role`           | `text`    |                |
| `department`     | `text`    |                |
| `businessUnit`   | `text`    |                |
| `phone`          | `text`    |                |
| `status`         | `text`    |                |
| `expiryDate`     | `date`    |                |
| `photoUrl`       | `text`    |                |
| `photoHint`      | `text`    |                |
| `created_at`     | `timestamptz` | (Padrão: `now()`) |


    *   Clique em **Save** para criar a tabela.

## Passo 2: Conectar o Projeto Next.js com o Supabase

1.  **Instale o Client do Supabase**:
    No terminal do seu projeto, instale os pacotes necessários:
    ```bash
    npm install @supabase/supabase-js
    ```

2.  **Obtenha as Chaves de API**:
    *   No dashboard do Supabase, vá para **Project Settings** (ícone de engrenagem) > **API**.
    *   Você precisará de duas informações: o **Project URL** e a chave **`anon` public**.

3.  **Configure as Variáveis de Ambiente**:
    *   Crie um arquivo chamado `.env.local` na raiz do seu projeto (se ele ainda não existir).
    *   Adicione as chaves que você copiou, como no exemplo abaixo:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_PROJETO_SUPABASE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
    ```
    *   **Importante**: O prefixo `NEXT_PUBLIC_` é necessário para que essas variáveis sejam acessíveis no lado do cliente (no navegador).

4.  **Crie o Client do Supabase**:
    *   Crie um novo arquivo em `src/lib/supabase.ts`:

    ```typescript
    // src/lib/supabase.ts
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and anon key are required.');
    }

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

## Passo 3: Substituir os Dados Estáticos

Agora, você pode refatorar o código para buscar e modificar os dados do Supabase em vez de usar o array estático.

### Exemplo: Listar Funcionários no Dashboard

Altere o arquivo `src/app/(app)/dashboard/page.tsx` para buscar os dados do Supabase. Como esta é uma Server Component, você pode fazer a busca diretamente.

**Antes (em `src/lib/data.ts`):**
```typescript
export const employees: Employee[] = [ /* ...dados estáticos... */ ];
```

**Depois (em `src/app/(app)/dashboard/page.tsx` e `src/components/app/employee-table.tsx`):**

Você precisará transformar esses componentes em `async` e buscar os dados diretamente do Supabase.

1.  **Em `employee-table.tsx`**:
    ```tsx
    // src/components/app/employee-table.tsx
    import { supabase } from '@/lib/supabase';
    // ... outros imports

    export async function EmployeeTable() {
      const { data: employees, error } = await supabase.from('employees').select('*');

      if (error) {
        console.error('Error fetching employees:', error);
        return <p>Erro ao carregar funcionários.</p>;
      }

      if (!employees) {
        return <p>Nenhum funcionário encontrado.</p>;
      }

      return (
        <div className="rounded-lg border shadow-sm">
          <Table>
            {/* ... o resto da sua tabela, fazendo o map em `employees` ... */}
          </Table>
        </div>
      );
    }
    ```

2.  **Em `dashboard/page.tsx`**:
    O componente `EmployeeTable` agora é assíncrono. O Next.js com Server Components suporta isso nativamente.

    ```tsx
    // src/app/(app)/dashboard/page.tsx
    // ...
    <Card>
      <CardHeader>
        <CardTitle>Lista de Funcionários</CardTitle>
      </CardHeader>
      <CardContent>
        {/* @ts-expect-error Server Component */}
        <EmployeeTable />
      </CardContent>
    </Card>
    // ...
    ```
    *Adicionamos um comentário `@ts-expect-error` porque o TypeScript pode reclamar sobre o uso de um componente `async` diretamente no JSX, mas isso é totalmente suportado pelo React e Next.js.*

Seguindo estes passos, você terá seu projeto configurado para usar o Supabase como backend, abrindo caminho para implementar a criação, edição, exclusão e autenticação de funcionários.
