import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(cookieParser())

const allowedOrigins = (process.env.ORIGIN_ALLOW || 'http://localhost')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                return callback(null, true)
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true)
            }
            return callback(new Error('Not allowed by CORS'))
        },
        credentials: true,
    })
)
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(`${__dirname}/public`))

app.use(urlencoded({ extended: true }))
app.use(json())

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
