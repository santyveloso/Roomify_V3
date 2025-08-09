# Possíveis problemas/dúvidas (PT) · Possible mistakes/doubts (EN)

- (PT) `HouseSerializer.admin` devolve string (username) mas o frontend às vezes espera um objeto com `{ id }` e usa `house.admin.id` noutras. Inconsistência pode quebrar verificações de admin.  
  (EN) `HouseSerializer.admin` returns a string (username) while the frontend sometimes expects an object with `{ id }` and uses `house.admin.id`. Inconsistent shape may break admin checks.

- (PT) `backend/feed/views.py` importa `House` do módulo errado (`from .models import Post, Comment, House`); `House` está em `houses.models`.  
  (EN) `backend/feed/views.py` imports `House` from the wrong module; `House` lives in `houses.models`.

- (PT) Falta de autorização/permissions em endpoints críticos: 
  - `houses` (listar/criar/editar/apagar/members/remove/generate_invite) não têm `IsAuthenticated`; criar casa atribui `admin=request.user` podendo ser `AnonymousUser`.  
  - `tasks.task_detail` e `expenses.expense_detail` permitem `PUT/DELETE` apenas com autenticação, sem verificar se o utilizador pertence à casa ou é autor/admin.  
  (EN) Missing authorization on critical endpoints: houses endpoints lack `IsAuthenticated` (create may set admin to `AnonymousUser`), and tasks/expenses detail allow PUT/DELETE without house membership/ownership checks.

- (PT) Backend de posts só permite o autor editar/apagar; o frontend assume que o admin da casa também pode apagar.  
  (EN) Posts API only allows the author to edit/delete; the frontend assumes house admin can delete too.

- (PT) Resposta do `login` não corresponde ao esperado no frontend: backend devolve `{ user: {...} }`, mas o frontend lê `response.data.username` e `response.data.profile_picture` no topo.  
  (EN) `login` response shape mismatch: backend returns `{ user: {...} }`, frontend reads top-level fields.

- (PT) CSRF: não há pedido inicial garantido para definir o cookie `csrftoken` antes do primeiro POST (login). Risco de 403 em ambientes limpos.  
  (EN) CSRF bootstrap missing: no initial request to set `csrftoken` before first POST; risk of 403 on fresh sessions.

- (PT) Código front misto/obsoleto: alguns componentes usam JWT (`Authorization: Bearer`) e endpoints inexistentes (`/backend/users/me/`, `/houses/{id}/roomies/`, POST de despesas para `/backend/expenses/` sem `houseId`).  
  (EN) Mixed/obsolete frontend code: some components use JWT and non-existent endpoints; inconsistent with session-based backend.

- (PT) Comparações de admin no frontend incoerentes: usa-se `userId` (id do perfil) vs `house.admin` (username string) e noutros pontos `house.admin.id`.  
  (EN) Incoherent admin checks in the frontend: comparing profile id to username string, or expecting `house.admin.id` elsewhere.

- (PT) Typo: `Footer />ss` em `frontend/src/pages/CriarPost.jsx`.  
  (EN) Typo: `Footer />ss` in `CriarPost.jsx`.

- (PT) Vários `print()`/logs de debug no backend (ex.: `users/views.py`) e comentários deixados; ruído para produção.  
  (EN) Several debug prints in backend and leftover comments; noisy for production.

- (PT) Definições de produção: `SECRET_KEY` no repo, `DEBUG=True`, `ALLOWED_HOSTS=[]`.  
  (EN) Prod settings: `SECRET_KEY` committed, `DEBUG=True`, empty `ALLOWED_HOSTS`.

- (PT) Nome do modelo `CustomUser` é um perfil (1-1 com `auth.User`) e não substitui o user; `AUTH_USER_MODEL` está comentado. Pode causar confusão.  
  (EN) `CustomUser` is actually a profile (1-1 with `auth.User`), not a replacement; `AUTH_USER_MODEL` is commented out. Naming is confusing.

- (PT) Duplicação/confusão de componentes de navegação: `Navbar.jsx` vs `NavAposLogin.jsx` (um ficheiro contém cabeçalho comentado como "Navbar").  
  (EN) Duplicate/confusing nav components: `Navbar.jsx` vs `NavAposLogin.jsx` with overlapping roles/comments.


---

# Sugestões objetivas (PT) · Objective suggestions (EN)

- (PT) Uniformizar `HouseSerializer.admin`: devolver objeto mínimo com `{ id, username }` ou padronizar o frontend para tratar sempre como string; preferível devolver objeto.  
  (EN) Standardize `HouseSerializer.admin`: return `{ id, username }` or treat as string consistently; returning an object is preferable.

- (PT) Corrigir import em `feed/views.py` para `from houses.models import House` e (opcional) permitir admin da casa apagar posts além do autor.  
  (EN) Fix import in `feed/views.py` and (optionally) allow house admin to delete posts.

- (PT) Adicionar `@permission_classes([IsAuthenticated])` em todos os endpoints de `houses` e reforçar verificações de pertença à casa antes de ler/alterar dados.  
  (EN) Add `IsAuthenticated` to all `houses` endpoints and enforce house membership checks.

- (PT) Em `tasks` e `expenses`, restringir `PUT/DELETE` a criador/admin da casa e validar que a entidade pertence à mesma `house` do `request.user.profile`.  
  (EN) In `tasks` and `expenses`, restrict `PUT/DELETE` to creator/house admin and validate same house ownership.

- (PT) Alinhar resposta do `login` com o frontend (superfície mínima necessária) ou alterar o frontend para usar apenas `/backend/users/profile/` após login.  
  (EN) Align `login` response or change frontend to rely solely on `/backend/users/profile/` after login.

- (PT) Criar endpoint GET simples para fixar o cookie CSRF (ex.: `/backend/csrf/` com `@ensure_csrf_cookie`) e chamá-lo ao iniciar a app; ou fazer um GET ao `/backend/users/profile/` antes do primeiro POST.  
  (EN) Add a CSRF bootstrap endpoint and call it on app init; or GET the profile first to set the cookie.

- (PT) Remover/atualizar código frontend que usa JWT/rotas antigas; padronizar axios com `withCredentials` e header `X-CSRFToken`.  
  (EN) Remove/update JWT-based code; standardize axios calls with `withCredentials` and `X-CSRFToken`.

- (PT) Corrigir comparações de admin no frontend após padronizar `admin` (usar `house.admin.id === currentUserAuthId` ou comparar por username de forma consistente).  
  (EN) Fix admin comparisons in the frontend once `admin` shape is standardized.

- (PT) Ajustar o apagar de posts no frontend para usar `axios` com CSRF/sessão e (se aplicado) permitir admin.  
  (EN) Change post deletion to use session + CSRF (axios) and allow admin if backend supports it.

- (PT) Limpar `CriarPost.jsx` (remover `ss`) e remover prints/comentários de debug no backend; usar logging.  
  (EN) Clean `CriarPost.jsx` and remove debug prints; use proper logging.

- (PT) Endurecer settings de produção: mover `SECRET_KEY` para env, `DEBUG=False`, configurar `ALLOWED_HOSTS`.  
  (EN) Harden prod settings: env secret, `DEBUG=False`, proper `ALLOWED_HOSTS`.

- (PT) Renomear `CustomUser` para `UserProfile` para clarificar finalidade; manter `AUTH_USER_MODEL` padrão.  
  (EN) Rename `CustomUser` to `UserProfile` for clarity; keep default `AUTH_USER_MODEL`.

- (PT) Adicionar testes de autorização para tarefas/despesas/posts, e testes de contratos de API para evitar regressões.  
  (EN) Add authorization and API contract tests.



