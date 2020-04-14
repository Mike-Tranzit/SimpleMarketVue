import api from "@/utils/goods/api";

export default {
    loadCategories: () => api({ endpoint: "categories" }),
    pollGoodsData: () => api({ endpoint: "data", interval: 100000 })
};
