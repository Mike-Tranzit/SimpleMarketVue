export const fixedExchangeRate = (price, exchangeRate, fractionDigits = 2) => +(price * exchangeRate).toFixed(fractionDigits);

export function sortGoodsWithCategories({goodsData, categories, exchangeRate}) {
    const newState = [];

    for (const item of goodsData) {

        const {C: price, T: goodsId, G: categoryId, P: availableCount} = item;
        const {G: categoryName, B: listOfGoods} = categories.findById(categoryId);
        const goodsName = listOfGoods[goodsId].N;

        newState[categoryName] = newState[categoryName] || [];


        newState[categoryName].push({
            price: fixedExchangeRate(price, exchangeRate),
            goodsId,
            categoryId,
            availableCount,
            goodsName
        });
    }
    return newState;
}
