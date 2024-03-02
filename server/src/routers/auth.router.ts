import { Router } from "express";
import * as Yup from "yup";
import joi from "joi";
import { sendBadRequestResponse } from "../helpers/common";
import { authController } from "../controllers";
import { rateLimiter } from "../helpers/rate-limiter";

const router = Router();

// middleware
// router.use(rateLimiter(20, 60));

// routes
router.get("/login", (req, res) => {
  if ((req.session as any)?.user) {
    res.json({ login: true, ...(req.session as any)?.user });
  } else {
    res.json({ login: false });
  }
});

router.post("/login", async (req, res) => {
  let data;

  try {
    data = await Yup.object({
      username: Yup.string().min(3).max(20).required(),
      password: Yup.string().min(3).max(20).required(),
    }).validate(req.body, { stripUnknown: true });
  } catch (error: any) {
    return sendBadRequestResponse(res, error);
  }

  await authController.login(req, res, data);
});

router.post("/register", async (req, res) => {
  let data;
  try {
    data = await Yup.object({
      username: Yup.string().min(3).max(20).required(),
      password: Yup.string().min(3).max(20).required(),
    }).validate(req.body, { stripUnknown: true });
  } catch (error: any) {
    return sendBadRequestResponse(res, error?.errors);
  }

  await authController.register(req, res, data);
});

export const authRouter = router;
