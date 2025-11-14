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

| Nome da Coluna   | Tipo      | Chave Primária | Default |
| :--------------- | :-------- | :--- |:--- |
| `id`             | `uuid`    | ✅ | `gen_random_uuid()` |
| `name`           | `text`    |    | |
| `role`           | `text`    |    | |
| `department`     | `text`    |    | |
| `businessUnit`   | `text`    |    | |
| `phone`          | `text`    |    | |
| `status`         | `text`    |    | |
| `expiryDate`     | `date`    |    | |
| `photoUrl`       | `text`    |    | |
| `photoHint`      | `text`    |    | |
| `created_at`     | `timestamptz` | | `now()` |

    *   Clique em **Save** para criar a tabela.

## Passo 2: Conectar o Projeto Next.js com o Supabase

1.  **Instale os Pacotes do Supabase para Next.js**:
    No terminal do seu projeto, instale os pacotes necessários para integração com o App Router do Next.js.
    ```bash
    npm install @supabase/supabase-js @supabase/ssr
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
    *   Crie um novo arquivo em `src/lib/supabase/client.ts` para o client-side:

    ```typescript
    // src/lib/supabase/client.ts
    import { createBrowserClient } from '@supabase/ssr'

    export function createClient() {
      return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }
    ```
    * Crie um novo arquivo em `src/lib/supabase/server.ts` para o server-side:
    ```typescript
    // src/lib/supabase/server.ts
    import { createServerClient, type CookieOptions } from '@supabase/ssr'
    import { cookies } from 'next/headers'

    export function createClient(cookieStore: ReturnType<typeof cookies>) {
      return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              try {
                cookieStore.set({ name, value, ...options })
              } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
            remove(name: string, options: CookieOptions) {
              try {
                cookieStore.set({ name, value: '', ...options })
              } catch (error) {
                // The `delete` method was called from a Server Component.
              }
            },
          },
        }
      )
    }
    ```

## Passo 3: Refatoração do Código para CRUD

Agora, você pode refatorar o código para buscar e modificar os dados do Supabase em vez de usar o array estático.

1.  **Listar Funcionários (Read)**:
    Altere o arquivo `src/components/app/employee-table.tsx` para buscar os dados. Como é um Server Component, você pode fazer a busca diretamente.

    ```tsx
    // src/components/app/employee-table.tsx
    import { createClient } from '@/lib/supabase/server';
    import { cookies } from 'next/headers';
    // ... outros imports

    export async function EmployeeTable() {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data: employees, error } = await supabase.from('employees').select('*');

      if (error) { /* ... trate o erro ... */ }
      if (!employees) { /* ... */ }

      return (
        <div className="rounded-lg border shadow-sm">
          <Table>
            {/* ... o resto da sua tabela, fazendo o map em `employees` ... */}
          </Table>
        </div>
      );
    }
    ```
    Em `dashboard/page.tsx`, você precisará marcá-lo como assíncrono e usar o componente da tabela.
    ```tsx
    // src/app/(app)/dashboard/page.tsx
    // ...
    <CardContent>
      {/* @ts-expect-error Server Component */}
      <EmployeeTable />
    </CardContent>
    // ...
    ```

2.  **Criar Funcionário (Create)**:
    Refatore a função `onSubmit` em `src/components/app/new-employee-dialog.tsx` para inserir dados no Supabase.

    ```tsx
    // src/components/app/new-employee-dialog.tsx
    import { createClient } from '@/lib/supabase/client';
    // ...

    export function NewEmployeeDialog() {
      const supabase = createClient();
      // ...

      async function onSubmit(data: EmployeeFormValues) {
        const { name, role, department, businessUnit, phone, expiryDate, status } = data;
        
        // Supondo que photoUrl venha de um estado ou do form
        const { data: newEmployee, error } = await supabase
          .from('employees')
          .insert([{ 
              name, role, department, businessUnit, phone, 
              expiryDate: expiryDate.toISOString(), 
              status, 
              photoUrl: 'URL_DA_FOTO_AQUI' 
          }])
          .select()
          .single();

        if (error) {
          toast({ variant: 'destructive', title: 'Erro ao salvar', description: error.message });
        } else {
          toast({ title: "Funcionário Salvo!", description: `${name} foi adicionado.` });
          // Você precisará de uma forma de atualizar a tabela, como revalidar o path:
          // revalidatePath('/dashboard');
          form.reset();
          setOpen(false);
        }
      }
      // ...
    }
    ```

3. **Editar e Deletar (Update/Delete)**:
   Para estas operações, o ideal é criar **Server Actions**. No seu `employee-table.tsx`, os botões "Editar" e "Suspender" chamariam essas actions.

    *   **Suspender (Update)**: Crie uma action que atualiza o status.
        ```typescript
        // Exemplo de uma Server Action em um arquivo 'src/lib/actions.ts'
        'use server'
        import { createClient } from '@/lib/supabase/server';
        import { cookies } from 'next/headers';
        import { revalidatePath } from 'next/cache';

        export async function suspendEmployee(id: string) {
          const supabase = createClient(cookies());
          const { error } = await supabase
            .from('employees')
            .update({ status: 'Suspenso' })
            .eq('id', id);

          if (error) { /* Tratar erro */ }
          
          revalidatePath('/dashboard'); // Atualiza a UI
        }
        ```

    *   **Deletar (Delete)**: Crie uma action que remove o funcionário.
        ```typescript
        // Exemplo de uma Server Action
        export async function deleteEmployee(id: string) {
          const supabase = createClient(cookies());
          const { error } = await supabase.from('employees').delete().eq('id', id);
          if (error) { /* Tratar erro */ }
          revalidatePath('/dashboard');
        }
        ```

## Passo 4: Autenticação e Superusuário (Admin)

Para restringir o acesso e ter um usuário administrador, usaremos o **Supabase Auth**.

1.  **Habilite a Autenticação**:
    *   No seu projeto Supabase, vá para a seção **Authentication**.
    *   Em **Providers**, habilite o provedor **Email**. Você pode desabilitar a opção "Confirm email" durante o desenvolvimento para facilitar.

2.  **Crie o Superusuário (Admin)**:
    *   A maneira mais simples de criar seu primeiro usuário admin é diretamente no dashboard.
    *   Vá para **Authentication** e clique no botão **"Add user"**.
    *   Insira o e-mail e a senha para sua conta de administrador. Este usuário será adicionado à tabela `auth.users`.
    *   Para diferenciar admins de usuários normais, a melhor abordagem é usar "custom claims" (recurso avançado) ou criar uma tabela `profiles` que se relaciona com a tabela `users`.
    *   **Abordagem Simples com Tabela `profiles`**:
        *   Crie uma tabela `profiles` com as colunas: `id` (tipo `uuid`, chave primária e uma foreign key para `auth.users.id`) e `role` (tipo `text`).
        *   Após criar o usuário, adicione manualmente uma entrada na tabela `profiles` para ele, definindo o `role` como `"admin"`.

3.  **Implemente o Login na Aplicação**:
    *   Refatore a página `src/app/(auth)/login/page.tsx` para usar a autenticação do Supabase.

    ```tsx
    // src/app/(auth)/login/page.tsx
    'use client' // Precisa ser um client component para interatividade
    
    import { createClient } from '@/lib/supabase/client';
    import { useRouter } from 'next/navigation';
    // ...

    export default function LoginPage() {
      const router = useRouter();
      const supabase = createClient();
      
      const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Exibir erro na UI
        } else {
          router.push('/dashboard');
          router.refresh(); // Garante que o layout do servidor seja recarregado
        }
      };

      return (
        // No seu formulário, adicione o handler:
        <form onSubmit={handleLogin}>
          {/* ... inputs de email e senha ... */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      );
    }
    ```

4.  **Proteja as Rotas e Gerencie a Sessão**:
    *   Crie um middleware para proteger as rotas da aplicação. Crie o arquivo `src/middleware.ts`.

    ```typescript
    // src/middleware.ts
    import { type NextRequest } from 'next/server'
    import { updateSession } from '@/lib/supabase/middleware'

    export async function middleware(request: NextRequest) {
      return await updateSession(request)
    }

    export const config = {
      matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      ],
    }
    ```
    * Crie o arquivo `src/lib/supabase/middleware.ts` para gerenciar a sessão.
    ```typescript
    // src/lib/supabase/middleware.ts
    import { createServerClient, type CookieOptions } from '@supabase/ssr'
    import { NextResponse, type NextRequest } from 'next/server'

    export async function updateSession(request: NextRequest) {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      })

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value,
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({
                name,
                value: '',
                ...options,
              })
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      await supabase.auth.getUser()

      return response
    }
    ```

Seguindo estes passos, você terá seu projeto configurado para usar o Supabase como backend, com funcionalidades completas de CRUD e um sistema de autenticação robusto para proteger suas rotas.