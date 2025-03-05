import Paystack from "paystack";
import { config } from "dotenv";

config();
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

export default paystack;
