import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import flightsRouter from "./flights";
import hotelsRouter from "./hotels";
import searchRouter from "./search";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(flightsRouter);
router.use(hotelsRouter);
router.use(searchRouter);

export default router;
