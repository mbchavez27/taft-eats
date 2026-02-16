import dotenv from 'dotenv'
import app from './src/app.ts'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
