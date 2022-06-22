import url from 'url'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'

var app = express();

app.set('views', path.join(path.dirname(url.fileURLToPath(import.meta.url)), 'views'));
app.use(express.static(path.join(path.dirname(url.fileURLToPath(import.meta.url)), 'public')));


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin:'*'}))


export {app}
