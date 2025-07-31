import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

const sql = neon(process.env.DATABASE_URL);

export default sql;
