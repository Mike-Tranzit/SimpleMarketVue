import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";

describe("CategoriesActionsHandler" , () => {
    it('should have findById', function () {
        const mockArray = [1,2,3];
        const categories = new CategoriesActionsHandler(mockArray);
        expect(typeof categories['findById'] === 'function').toBe(true);
    });
});
