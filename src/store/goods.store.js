import {
    GET_CATEGORIES,
    GET_DATA,
    SET_CATEGORIES,
    UPDATE_DATA
} from './actions/goods.actions';
import goodsService from "@/services/goods.service";
import currencyService from "@/services/currency.service";

import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";
import {sortGoodsWithCategories} from "@/utils/goods.utils";

export default {
    state: {
        goods: [],
        categories: [],
        cart: []
    },
    getters: {
        getData: state => state.data,
        getCart: state => state.cart,
    },
    actions: {
        [GET_CATEGORIES]: async ({commit}) => {
            const {data: categories} = await goodsService.loadCategories();

            commit(SET_CATEGORIES, categories.data);
        },
        [GET_DATA]: async ({commit}) => {
            const {data: {Value: goods}} = await goodsService.pollGoodsData();
            const exchangeRate = await currencyService.actualDollarExchangeRate();
            commit(UPDATE_DATA, {exchangeRate, goods});
        }
    },
    mutations: {
        [SET_CATEGORIES]: (state, data) => {
            state.categories = new CategoriesActionsHandler(data);
        },
        [UPDATE_DATA]: (state, {exchangeRate, goods}) => {
            const payload = {
                goodsData: goods.Goods,
                categories: state.categories,
                exchangeRate: exchangeRate,
                goodsPricesBuffer: []
            };
            const {actualData} = sortGoodsWithCategories(payload);
            console.log(actualData);
            // this.goodsPricesBuffer = {...cloneGoodsPricesBuffer};
            state.goods = {...actualData};
        }
    }
}
