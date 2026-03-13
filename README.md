# Frontend - Localiza Banricard

Frontend do sistema de localização de estabelecimentos (restaurantes, postos, farmácias) que aceitam Banricard Vale Refeição.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Google Maps API** - Mapas interativos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Backend API rodando (porta 3000)
- Chave da API do Google Maps

## 🔧 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Instalar componentes shadcn/ui:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog input label select card badge
```

3. **Configurar variáveis de ambiente:**
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```

4. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

Acesse: http://localhost:3001

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx             # Página inicial
│   │   └── globals.css          # Estilos globais
│   ├── components/
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── RestaurantCard.tsx   # Card de restaurante
│   │   ├── RestaurantList.tsx   # Lista de restaurantes
│   │   ├── RestaurantMap.tsx    # Mapa interativo
│   │   ├── RestaurantForm.tsx   # Formulário de cadastro
│   │   └── Filters.tsx          # Filtros de busca
│   ├── hooks/
│   │   └── useRestaurants.ts    # Hook customizado
│   └── lib/
│       ├── api.ts               # Cliente API
│       └── utils.ts             # Utilitários
├── public/                      # Arquivos estáticos
└── package.json
```

## 🎨 Componentes

### RestaurantCard
Card individual de estabelecimento com informações básicas.

### RestaurantList
Lista de estabelecimentos com loading e empty states.

### RestaurantMap
Mapa interativo do Google Maps com marcadores.

### RestaurantForm
Formulário para adicionar novos estabelecimentos.

### Filters
Filtros de busca (cidade, bairro, região, texto).

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3000/api` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Chave Google Maps | `AIza...` |

## 🚀 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Linter
npm run lint
```

## 📝 Próximos Passos

1. ✅ Estrutura criada
2. ✅ Componentes implementados
3. ✅ Integração com API
4. ✅ Google Maps integrado
5. ⏳ Testes e ajustes

## 🐛 Troubleshooting

### Erro ao carregar mapa
- Verifique se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurada
- Confirme que a chave está habilitada para Maps JavaScript API

### Erro de conexão com API
- Verifique se o backend está rodando na porta 3000
- Confirme `NEXT_PUBLIC_API_URL` no `.env.local`

### Componentes shadcn/ui não encontrados
- Execute: `npx shadcn-ui@latest add [componente]`
- Verifique se `components.json` está configurado
