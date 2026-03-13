# Setup do Frontend

## 1. Instalar dependências

```bash
cd frontend
npm install
```

## 2. Configurar variáveis de ambiente

Crie o arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

**Importante:**
- Substitua `sua_chave_google_maps_aqui` pela sua chave real do Google Maps
- A chave deve ter as seguintes APIs habilitadas:
  - Maps JavaScript API
  - Geocoding API

## 3. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3001**

## 4. Verificar se o backend está rodando

Certifique-se de que o backend está rodando na porta 3000:

```bash
# Em outro terminal
cd backend
npm run dev
```

## ✅ Pronto!

Acesse http://localhost:3001 e você verá:
- Lista de restaurantes
- Mapa interativo
- Filtros de busca
- Botão para adicionar novos restaurantes

## 🐛 Troubleshooting

### Erro: "Cannot find module"
- Execute: `npm install` novamente
- Delete `node_modules` e `package-lock.json`, depois `npm install`

### Mapa não carrega
- Verifique se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurada
- Confirme que a chave está habilitada no Google Cloud Console

### Erro de conexão com API
- Verifique se o backend está rodando: http://localhost:3000
- Confirme a URL no `.env.local`

### Componentes não aparecem
- Verifique se todos os arquivos em `src/components/ui/` foram criados
- Execute: `npm run build` para verificar erros
