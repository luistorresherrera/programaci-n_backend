import { Router } from "express";
const router = Router();

//RENDERIZAR LOGIN
router.get("/", async (req, res) => {
  const { register } = req.query;

  res.render("login", { register });
});

export default router;
