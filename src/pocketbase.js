import Pocketbase from "pocketbase";
export const dbUrl = `https://oct2025-team#.pockethost.io/`; // Replace with your database URL
const pb = new Pocketbase(dbUrl);
export default pb;
