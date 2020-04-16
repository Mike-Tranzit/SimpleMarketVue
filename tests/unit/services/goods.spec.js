import goodsService from "@/services/goods.service";

const api = jest.fn();

describe("goodsService", () => {
    it('should call loadCategories', function () {
        const data = 'Result';
        api.mockImplementationOnce(() => Promise.resolve(data));
        expect(goodsService.loadCategories()).resolves.toEqual(data);
    });

    it('should call loadCategories', function () {
        const data = 'Pooling';
        api.mockImplementationOnce(() => Promise.resolve(data));
        expect(goodsService.pollGoodsData()).resolves.toEqual(data);
    });
});
