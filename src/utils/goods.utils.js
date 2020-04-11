export const fixedExchangeRate = (price, exchangeRate, fractionDigits = 2) => +(price * exchangeRate).toFixed(fractionDigits);

export function sortGoodsWithCategories({goodsData, categories, exchangeRate, pricesBuffer}) {
  const actualData = [];
  const clonePricesBuffer = {...pricesBuffer};

  for (const item of goodsData) {

    const {C: price, T: goodsId, G: categoryId, P: availableCount} = item;
    const {G: categoryName, B: listOfGoods} = categories.findById(categoryId);
    const goodsName =  listOfGoods[goodsId].N;

    actualData[categoryName] = actualData[categoryName] || [];

    const previousPrice = clonePricesBuffer[goodsId];
    clonePricesBuffer[goodsId] = fixedExchangeRate(price, exchangeRate);

    actualData[categoryName].push({
      price: fixedExchangeRate(price, exchangeRate),
      previousPrice,
      goodsId,
      categoryId,
      availableCount,
      goodsName
    });
  }
  return {
    actualData,
    clonePricesBuffer
  };
}
