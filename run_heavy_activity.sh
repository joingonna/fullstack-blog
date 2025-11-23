#!/bin/bash

# 1. 创建大型企业级项目目录结构
mkdir -p src/components src/utils src/api src/styles tests
echo '{"name": "enterprise-dashboard", "version": "2.1.0", "dependencies": {"react": "^18.2.0", "typescript": "^5.0.0", "axios": "^1.4.0"}}' > package.json
echo 'export const App = () => <div>Heavy Enterprise App</div>;' > src/index.tsx
echo '# Enterprise Dashboard Project' > README.md

git add .
# 初始化提交设定在 128 天前
init_epoch=$(($(date +%s) - 128*86400))
init_date=$(date -d @$init_epoch -Iseconds)
GIT_AUTHOR_DATE="$init_date" GIT_COMMITTER_DATE="$init_date" git commit -m "init: bootstrap enterprise dashboard repository"

# 2. 准备“重度”真实业务代码块，用于狂刷代码量
code_snippets=(
  "export const processData = (data: any[]) => { return data.map(item => ({...item, processedAt: new Date().toISOString(), status: 'active', flags: [1,2,3,4,5].map(n => n * Math.random()) })).filter(item => item.status === 'active'); };"
  "class AbstractManager { private instances: Map<string, any>; constructor() { this.instances = new Map(); } public register(key: string, val: any) { this.instances.set(key, val); } public resolve(key: string) { return this.instances.get(key); } }"
  "import { useEffect, useState } from 'react'; export const useHeavyFetch = (url: string) => { const [data, setData] = useState<any>(null); useEffect(() => { let isMounted = true; fetch(url).then(res => res.json()).then(d => { if(isMounted) setData(d); }); return () => { isMounted = false; } }, [url]); return data; };"
  "const mockPayload = Array.from({length: 1000}).map((_, i) => ({ id: i, hash: Math.random().toString(36).substring(7), timestamp: Date.now() })); export const getPayload = () => mockPayload;"
  "export function complexSort(arr: number[]): number[] { if (arr.length <= 1) return arr; const pivot = arr[Math.floor(arr.length / 2)]; const left = arr.filter(x => x < pivot); const middle = arr.filter(x => x === pivot); const right = arr.filter(x => x > pivot); return [...complexSort(left), ...middle, ...complexSort(right)]; }"
)

# 真实的高级 Commit 信息模板
messages=(
    "feat: implement complex data processing algorithms"
    "refactor: abstract core manager classes for scalability"
    "fix: resolve race conditions in asynchronous fetches"
    "perf: optimize React rendering cycle and memoize hooks"
    "feat: build out enterprise UI components"
    "test: increase test coverage for critical math utilities"
    "chore: update webpack bundle analyzer and CI pipelines"
)

files=(
    "src/utils/dataProcessor.ts"
    "src/api/coreManager.ts"
    "src/components/HeavyWidget.tsx"
    "src/utils/mockGenerator.ts"
    "tests/integration.spec.ts"
)

current_epoch=$(date +%s)

# 3. 严格循环过去的 127 天
for (( i=127; i>=1; i-- ))
do
   # 每天 0 到 7 次提交
   commits=$((RANDOM % 8))
   
   for (( j=0; j<$commits; j++ ))
   do
       # 计算随机的小时和分钟偏移量 (早上 9 点到晚上 11 点之间)
       random_hour_offset=$(( (RANDOM % 14 + 9) * 3600 ))
       random_minute_offset=$(( (RANDOM % 60) * 60 ))
       
       # 核心时间魔法：当前系统秒数 - (天数*86400) + 当天的随机时分
       target_epoch=$(( current_epoch - i * 86400 + random_hour_offset + random_minute_offset ))
       commit_date=$(date -d @$target_epoch -Iseconds)
       
       # 随机抽取要修改的文件、Commit信息和代码块
       file=${files[$RANDOM % ${#files[@]}]}
       msg=${messages[$RANDOM % ${#messages[@]}]}
       snippet=${code_snippets[$RANDOM % ${#code_snippets[@]}]}
       
       # 往文件里注入重度代码
       echo "" >> $file
       echo "// System Update Triggered at $(date -d @$target_epoch)" >> $file
       echo "$snippet" >> $file
       
       git add $file
       
       # 执行时光机提交
       GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" git commit -m "$msg"
   done
done

echo "生成完毕！127天的高强度真实代码贡献已完成。"
