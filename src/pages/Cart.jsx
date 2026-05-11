import { Container, Row, Col, Button, Stack, Card } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useShoppingItems } from "../context/ShoppingItemsContext";
import { CartItem } from "../components/CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import "./Cart.css";

export default function Cart() {
    const { cartItems, clearCart } = useShoppingCart();
    const { products } = useShoppingItems();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const total = cartItems.reduce((total, cartItem) => {
        const product = products.find(p => p.id === cartItem.id);
        return total + (product?.price || 0) * cartItem.quantity;
    }, 0);

    const cartItemsWithDetails = cartItems.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            ...item,
            name: product?.name || "",
            price: product?.price || 0,
            imgUrl: product?.imgUrl || ""
        };
    });

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!", {
                position: "top-right",
                autoClose: 2000,
                theme: "dark"
            });
            return;
        }
        try {
            setIsCheckingOut(true);
            navigate("/checkout", { 
                state: { 
                    items: cartItemsWithDetails,
                    total: total 
                }
            });
        } catch (error) {
            toast.error("Checkout failed. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark"
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleClearCart = () => {
        clearCart();
        toast.info("Cart cleared!", {
            position: "top-right",
            autoClose: 2000,
            theme: "dark"
        });
    };

    return (
        <Container className="py-5">
            <Row className="mb-5">
                <Col>
                    <h1 className="text-white fw-bold mb-4">
                        Shopping Cart
                    </h1>
                </Col>
            </Row>

            {cartItems.length === 0 ? (
                <Row className="justify-content-center">
                    <Col md={6} className="text-center">
                        <Card className="bg-dark border-secondary p-5">
                            <h3 className="text-secondary mb-4">Your cart is empty</h3>
                            <p className="text-secondary mb-4">
                                Start shopping to add items to your cart!
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate("/")}
                                className="cart-action-btn"
                            >
                                Continue Shopping
                            </Button>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col lg={8}>
                        <Stack gap={3} className="mb-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item-wrapper">
                                    <CartItem {...item} />
                                </div>
                            ))}
                        </Stack>
                    </Col>

                    <Col lg={4}>
                        <Card className="bg-dark border-secondary sticky-top" style={{ top: "2rem" }}>
                            <Card.Body className="p-4">
                                <h5 className="text-white fw-bold mb-4">Order Summary</h5>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Items:</span>
                                        <span className="text-white">
                                            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3 border-bottom border-secondary pb-3">
                                        <span className="text-secondary">Subtotal:</span>
                                        <span className="text-white">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 d-flex justify-content-between align-items-center">
                                    <span className="text-white fs-5 fw-bold">Total:</span>
                                    <span className="text-primary fs-4 fw-bold">
                                        {formatCurrency(total)}
                                    </span>
                                </div>

                                <Stack gap={2}>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut || cartItems.length === 0}
                                        className="w-100 cart-action-btn fw-bold"
                                        style={{
                                            background: '#8a2be2',
                                            borderColor: '#8a2be2',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {isCheckingOut ? (
                                            <span>Processing...</span>
                                        ) : (
                                            <span>Proceed to Checkout</span>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        size="lg"
                                        onClick={() => navigate("/")}
                                        className="w-100 fw-bold"
                                    >
                                        Continue Shopping
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={handleClearCart}
                                        className="w-100 mt-2"
                                    >
                                        Clear Cart
                                    </Button>
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}
