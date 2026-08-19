import { Request, Response } from "express"
import { Prisma, prisma } from "@repo/db"

export const createProduct = async (req: Request, res: Response) =>{

    const data: Prisma.ProductCreateInput = req.body

    const {colors, images} = data
    if(!colors || !Array.isArray(colors) || colors.length === 0){
        return res.status(400).json({message:"colors must be a non-empty array"})
    }
    if(!images || typeof images !== "object"){
        return res.status(400).json({message:"images must be an object"})
    }
    const missingColors = colors.filter((color) => !(color in images))
    if(missingColors.length > 0){
        return res.status(400).json({message:`Missing images for colors: ${missingColors.join(", ")}`})
    }

    const product = await prisma.product.create({data})
    res.status(201).json(product)


}
export const deleteProduct = async (req: Request, res: Response) =>{}
export const updateProduct = async (req: Request, res: Response) =>{}
export const getProduct = async (req: Request, res: Response) =>{}
export const getAllProduct = async (req: Request, res: Response) =>{}