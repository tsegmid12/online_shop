import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET cart by userId
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId",
    );
    if (!cart) {
      return res.json({ userId: req.params.userId, items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SAVE/UPDATE cart
router.post("/:userId", async (req, res) => {
  const { items } = req.body;

  try {
    // Calculate total price
    let totalPrice = 0;
    if (items && items.length > 0) {
      for (let item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
          totalPrice += product.price * item.quantity;
        }
      }
    }

    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: items || [],
        totalPrice: totalPrice,
      });
    } else {
      cart.items = items || [];
      cart.totalPrice = totalPrice;
    }

    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADD item to cart
router.post("/:userId/add", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    // Calculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// REMOVE item from cart
router.delete("/:userId/item/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId,
    );

    // Recalculate total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CLEAR cart
router.delete("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE item quantity in cart
router.put("/:userId/item/:productId", async (req, res) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === req.params.productId,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    // Recalculate total price
    let totalPrice = 0;
    for (let cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      if (product) {
        totalPrice += product.price * cartItem.quantity;
      }
    }
    cart.totalPrice = totalPrice;

    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("items.productId");
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
