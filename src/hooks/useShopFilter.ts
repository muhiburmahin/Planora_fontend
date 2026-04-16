// import { useState, useMemo } from "react";
// import { Medicine } from "@/types/medicine.type";

// export const useShopFilter = (initialData: Medicine[]) => {
//     const [selectedCategory, setSelectedCategory] = useState("All");
//     const [priceRange, setPriceRange] = useState([1000]);
//     const [sortBy, setSortBy] = useState("default");

//     const filteredMedicines = useMemo(() => {
//         let result = [...initialData];

//         if (selectedCategory !== "All") {
//             result = result.filter(med => med.category?.name === selectedCategory);
//         }

//         result = result.filter(med => med.price <= priceRange[0]);

//         if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
//         if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);

//         return result;
//     }, [selectedCategory, priceRange, sortBy, initialData]);

//     return {
//         selectedCategory, setSelectedCategory,
//         priceRange, setPriceRange,
//         sortBy, setSortBy,
//         filteredMedicines
//     };
// };