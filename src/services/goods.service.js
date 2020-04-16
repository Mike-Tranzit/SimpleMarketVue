import api from "@/utils/goods/api";
import {POLLING_TIMEOUT} from "@/utils/variables";

export default {
    loadCategories: () => api({ endpoint: "categories" }),
    pollGoodsData: () => api({ endpoint: "data", interval: POLLING_TIMEOUT })
};
