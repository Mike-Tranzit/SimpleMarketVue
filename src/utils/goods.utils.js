export const fixedExchangeRate = (price, exchangeRate, fractionDigits = 2) => +(price * exchangeRate).toFixed(fractionDigits);

export function sortGoodsWithCategories({goodsData, categories, exchangeRate}) {
    const actualData = [];

    for (const item of goodsData) {

        const {C: price, T: goodsId, G: categoryId, P: availableCount} = item;
        const {G: categoryName, B: listOfGoods} = categories.findById(categoryId);
        const goodsName = listOfGoods[goodsId].N;

        actualData[categoryName] = actualData[categoryName] || [];


        actualData[categoryName].push({
            price: fixedExchangeRate(price, exchangeRate),
            goodsId,
            categoryId,
            availableCount,
            goodsName
        });
    }
    return actualData;
}

export let PriceFieldColors;
(function (PriceFieldColors) {
    PriceFieldColors["UP"] = "rgb(221, 79, 67)";
    PriceFieldColors["DOWN"] = "rgb(40, 195, 76)";
    PriceFieldColors["AFTER_CHANGE"] = "rgb(255, 255, 255)";
    PriceFieldColors.priceBecomeLower = (el) => el.style.backgroundColor = PriceFieldColors.DOWN;
    PriceFieldColors.priceBecomeHigher = (el) => el.style.backgroundColor = PriceFieldColors.UP;
    PriceFieldColors.setColorAfterChange = (el) => {
      if(el.style.color === PriceFieldColors.AFTER_CHANGE) {
        return;
      }
      el.style.color = PriceFieldColors.AFTER_CHANGE;
    }
    PriceFieldColors = Object.freeze({...PriceFieldColors});
})(PriceFieldColors || (PriceFieldColors = {}));
