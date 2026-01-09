// PM2 Ecosystem Configuration for VPS Deployment
// Usage: pm2 start ecosystem.config.js --env production

module.exports = {
    apps: [
        {
            name: 'blog-api',
            cwd: './backend',
            script: 'dist/main.js',
            instances: 1,                    // 1核VPS只跑1个实例
            exec_mode: 'fork',
            max_memory_restart: '192M',      // 超过192MB自动重启
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            // 日志配置
            error_file: './logs/api-error.log',
            out_file: './logs/api-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            // 重启策略
            exp_backoff_restart_delay: 100,
            max_restarts: 10,
            min_uptime: '10s',
        },
        {
            name: 'blog-frontend',
            cwd: './frontend',
            script: 'node_modules/.bin/next',
            args: 'start -p 3000',
            instances: 1,
            exec_mode: 'fork',
            max_memory_restart: '256M',      // Next.js SSR (稳定配置)
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
            error_file: './logs/frontend-error.log',
            out_file: './logs/frontend-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            exp_backoff_restart_delay: 100,
            max_restarts: 10,
            min_uptime: '10s',
        },
    ],
};
