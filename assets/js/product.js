// Sample product data
const products = [
    {
        id: 1,
        name: "Minimalist Bed Frame",
        price: "1,250",
        description: "Handcrafted minimalist bed frame made from sustainably sourced Ethiopian Wanza wood. Features clean lines and a floating design.",
        materials: ["Wanza Wood", "Organic Cotton", "Natural Oil Finish"],
        dimensions: "200cm × 180cm × 40cm",
        origin: "Ethio-Modern Collection",
        location: "Addis Ababa",
        productionTime: "4 weeks",
        rating: 5,
        reviews: 24,
        images: [
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            "https://images.unsplash.com/photo-1566666395328-61b8b098eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            "https://images.unsplash.com/photo-1616627561839-074385245ff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        ],
        category: "bedroom"
    },
    // ... (include all your other products here)
    {
        id: 8,
        name: "Dining Table",
        price: "$1,850",
        description: "Expandable dining table with butterfly leaf system, showcasing the natural grain of Ethiopian Wanza wood.",
        materials: ["Wanza Wood", "Brass Hardware", "Natural Oil Finish"],
        dimensions: "180cm × 90cm × 75cm (extends to 240cm)",
        origin: "Heritage Modern Line",
        location: "Gonder",
        productionTime: "6 weeks",
        rating: 5,
        reviews: 19,
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
            "https://images.unsplash.com/photo-1567538096631-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        ],
        category: "dining"
    }
];

// Export products for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
}

// Save initial products to localStorage if not already present
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Make products available globally for the frontend
window.products = products;