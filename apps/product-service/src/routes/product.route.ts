import {Router} from "express"
import { createProduct, deleteProduct, updateProduct, getProduct, getAllProduct } from "../controllers/product.controller"

export const router:Router = Router()

router.post("/", createProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)
router.get("/:id", getProduct)
router.get("/", getAllProduct)
