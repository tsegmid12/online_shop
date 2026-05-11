const API_BASE_URL = "http://localhost:5000/api";

// Get all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get single product
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/${query}`);
    if (!response.ok) throw new Error("Failed to search products");
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error("Server is not responding");
    return await response.json();
  } catch (error) {
    console.error("Server health check failed:", error);
    throw error;
  }
};

// CART ENDPOINTS

// Get user's cart
export const getCart = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch cart");
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Save entire cart
export const saveCart = async (userId, items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error("Failed to save cart");
    return await response.json();
  } catch (error) {
    console.error("Error saving cart:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCartAPI = async (userId, productId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/item/${productId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error("Failed to remove item");
    return await response.json();
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
};

// Update item quantity in cart
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/item/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );
    if (!response.ok) throw new Error("Failed to update quantity");
    return await response.json();
  } catch (error) {
    console.error("Error updating quantity:", error);
    throw error;
  }
};

// Clear entire cart
export const clearCartAPI = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear cart");
    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
