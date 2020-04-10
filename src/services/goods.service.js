import api from "@/utils/goods/api";

export default {
    fetch: () => api({ endpoint: "categories" }),
    poll: () => api({ endpoint: "data", interval: 10000 })
};
