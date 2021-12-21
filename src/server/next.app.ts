import next from 'next';

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const nextServer = next({ dev: IS_DEVELOPMENT, dir: './src/client' });

export default nextServer;
