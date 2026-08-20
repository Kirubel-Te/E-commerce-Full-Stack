import {Router} from "express"
import { createProduct, deleteProduct, updateProduct, getProduct, getAllProduct } from "../controllers/product.controller"
import { shouldBeAdmin } from "../middleware/authMiddleware"

export const router:Router = Router()

router.post("/",shouldBeAdmin, createProduct)
router.delete("/:id",shouldBeAdmin, deleteProduct)
router.put("/:id",shouldBeAdmin, updateProduct)
router.get("/:id", getProduct)
router.get("/", getAllProduct)
