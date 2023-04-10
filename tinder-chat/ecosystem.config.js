module.exports = {
  apps: [
    {
      name: 'tinder-chat',
      script: './index.js',
      instances: 1,
      max_memory_restart: '300M',

      // Env Specific Config
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
        exec_mode: 'cluster_mode',
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 8080,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          './node_modules',
          './public',
          './package.json',
          './src',
        ],
      },
    },
  ],
};
