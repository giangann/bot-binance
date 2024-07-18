import dotenv from 'dotenv'
dotenv.config()

export const BOT_RUN_INTERVAL = parseInt(process.env.BOT_RUN_INTERVAL||'3') // second

