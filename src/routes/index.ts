import { Express, Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Smart Construction API is running" });
});

router.get("/api", (req, res) => {
  res.json({ 
    success: true, 
    message: "Welcome to Smart Construction API",
    version: "1.0.0"
  });
});

export const setupRoutes = (app: Express) => {
  app.use(router);
  app.use("/api/auth", Router());
  app.use("/api/users", Router());
  app.use("/api/projects", Router());
  app.use("/api/attendance", Router());
  app.use("/api/approvals", Router());
  app.use("/api/construction", Router());
  app.use("/api/quality", Router());
  app.use("/api/safety", Router());
  app.use("/api/materials", Router());
  app.use("/api/equipment", Router());
  app.use("/api/contracts", Router());
  app.use("/api/costs", Router());
  app.use("/api/labor", Router());
  app.use("/api/smart-site", Router());
  app.use("/api/reports", Router());
};
