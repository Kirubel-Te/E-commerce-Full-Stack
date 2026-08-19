import { Request, Response } from "express"
import { Prisma, prisma } from "@repo/db"

export const createCategory = async (req: Request, res: Response) =>{

    const data: Prisma.CategoryCreateInput = req.body
    const category = await prisma.category.create({data})
    res.status(201).json(category)

}

export const deleteCategory = async (req: Request, res: Response) =>{}
export const updateCategory = async (req: Request, res: Response) =>{}
export const getCategories = async (req: Request, res: Response) =>{}