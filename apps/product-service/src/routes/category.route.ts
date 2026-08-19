import {Router} from "express"
import { createCategory, deleteCategory, updateCategory, getCategories } from "../controllers/category.controller"

export const router: Router = Router()

router.post("/", createCategory)
router.delete("/:id", deleteCategory)
router.put("/:id", updateCategory)
router.get("/", getCategories)