import {createContext, useContext, useState, useEffect} from "react";
import {demoProducts} from "../data/demoProducts";
import * as apiService from "../services/api";

const ShoppingItemsContext = createContext({});

export function useShoppingItems() {
    return useContext(ShoppingItemsContext);
}

export function ShoppingItemsProvider({children}) {
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setIsLoadingProducts(true);
                const dbProducts = await apiService.getProducts();
                setProducts(dbProducts);
                setError(null);
            } catch (err) {
                console.error("Error loading products from API:", err);
                console.log("Falling back to demo products");
                setProducts(demoProducts);
                setError("Using demo data - backend may not be running");
            } finally {
                setIsLoadingProducts(false);
            }
        };

        loadProducts();
    }, []);

    async function addProduct(product) {
        try {
            const newProduct = await apiService.createProduct({
                name: product.name,
                price: parseFloat(product.price),
                imageUrl: product.imgUrl,
                description: product.description || ""
            });
            setProducts(prevProducts => [...prevProducts, newProduct]);
            return newProduct;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    }

    async function updateProduct(id, updatedProduct) {
        try {
            const updated = await apiService.updateProduct(id, {
                name: updatedProduct.name,
                price: parseFloat(updatedProduct.price),
                imageUrl: updatedProduct.imgUrl,
                description: updatedProduct.description || ""
            });
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product._id === id ? updated : product
                )
            );
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }

    async function deleteProduct(id) {
        try {
            await apiService.deleteProduct(id);
            setProducts(prevProducts =>
                prevProducts.filter(product => product._id !== id)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    return (
        <ShoppingItemsContext.Provider
            value={{
                products,
                isLoadingProducts,
                error,
                addProduct,
                updateProduct,
                deleteProduct
            }}
        >
            {children}
        </ShoppingItemsContext.Provider>
    );
}