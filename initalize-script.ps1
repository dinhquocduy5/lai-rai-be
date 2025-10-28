# Requires: Node.js + npm
$ErrorActionPreference = "Stop"
Write-Host "⚙️ Initializing Express + TypeScript in current repo..."

# 1) Dependencies
npm i express cors helmet dotenv zod pino pino-pretty pg
npm i -D typescript ts-node-dev @types/node @types/express @types/cors @types/helmet `
  eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier `
  eslint-config-prettier eslint-plugin-import eslint-import-resolver-typescript

# 2) TypeScript init
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule `
  --lib es2020 --module commonjs --target es2020 --strict --skipLibCheck | Out-Null

# Patch tsconfig via Node (không cần jq)
node -e @"
const fs=require('fs');
const p='tsconfig.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.compilerOptions=j.compilerOptions||{};
Object.assign(j.compilerOptions,{
  moduleResolution:'node',
  sourceMap:true,
  baseUrl:'.',
  paths:{ '*':['src/*'] }
});
fs.writeFileSync(p, JSON.stringify(j,null,2));
"@

# 3) .gitignore
@"
node_modules
dist
.env
npm-debug.log*
.DS_Store
"@ | Set-Content -NoNewline .gitignore

# 4) Prettier + ESLint
@"
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
"@ | Set-Content -NoNewline .prettierrc.json

@"
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json' },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true }
      }
    ]
  }
};
"@ | Set-Content -NoNewline .eslintrc.cjs

# 5) package.json scripts
node -e @"
const fs=require('fs');
const p='package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=Object.assign(j.scripts||{},{
  'dev':'ts-node-dev --respawn --transpile-only src/server.ts',
  'build':'tsc -p tsconfig.json',
  'start':'node dist/server.js',
  'lint':'eslint . --ext .ts',
  'lint:fix':'eslint . --ext .ts --fix',
  'format':'prettier --write \"**/*.{ts,tsx,js,json,md}\"'
});
fs.writeFileSync(p, JSON.stringify(j,null,2));
"@

# 6) Folder structure
$dirs = @(
  "src","src/config","src/loaders","src/routes","src/routes/v1","src/controllers",
  "src/services","src/repositories","src/models","src/schemas","src/db",
  "src/middlewares","src/utils"
)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }

# 7) Minimal server file
@"
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}\`));
"@ | Set-Content -NoNewline src/server.ts

Write-Host "✅ Done!"
Write-Host "👉 Next: npm run dev   (mở http://localhost:3000/health)"
