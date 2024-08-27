import { NextFunction, Response } from "express";
import IRequest from "../../express/expressInterfaces";
import catchAsync from "../../utils/catchAsync";
import { createOne, deleteOne, getAll, getOne, updateOne } from '../../repositories/mainFactory';
import Cart from "./cartModel";
import Product from "../product/productModel";
import AppError from "../../utils/appError";

const getCart = getOne(Cart, ["products"]);
const getAllCarts = getAll(Cart);
const createCart = createOne(Cart);
const updateCart = updateOne(Cart);
const deleteCart = deleteOne(Cart);

const addToCart = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        next(new AppError('There is no such product haveing this ID', 404));
    }
    await Cart.findByIdAndUpdate(req.params.id, {
        products: {
            $push: {
                productId: product!._id,
                amount: 1,
                price: product!.price
            }
        }
    });
    res.status(200).json({
        status: 'success',
        message: 'Added to cart successfuly'
    });
});

const buyCart = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: {
            status: 'On-Going',
            adress: req.body.adress
        }
    });

    if (!cart) {
        next(new AppError('Invalid cart ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your request has been sent to the shop, please check your notifications after few minutes'
    });

});

const acceptCart = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: {
            status: 'On-Way',
            dateToDelivered: req.body.dataToDelivered
        }
    });

    if (!cart) {
        next(new AppError('Invalid cart ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `Your request on the way. Please get your request in ${cart?.adress} at ${cart?.dateToDelivered}`
    });
});

const cancelCart = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: {
            status: 'rejected',
            reason: req.body.reason
        }
    });

    if (!cart) {
        next(new AppError('Invalid cart ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `Your cart has been rejected, reason: ${cart?.reason}`
    });
});

const deliveredCart = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: {
            status: 'delivered',
            deliverdTime: Date.now()
        }
    });

    if (!cart) {
        next(new AppError('Invalid cart ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `Your cart has been rejected, reason: ${cart?.reason}`
    });
});

export default {
    getAllCarts,
    createCart,
    getCart,
    updateCart,
    deleteCart,
    addToCart,
    buyCart,
    acceptCart,
    cancelCart,
    deliveredCart
}