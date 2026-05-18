import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    if (env.failStartup) {
      throw new Error("Intentional startup failure (FAIL_STARTUP=true)");
    }
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`SkillSwap API running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start API", error);
    process.exit(1);
  }
};

startServer();
