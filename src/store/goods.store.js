import Vue from "vue";
import {GET_CATEGORIES, GET_DATA, SET_CATEGORIES, UPDATE_DATA} from './actions/goods.actions';
import goodsService from "@/services/goods.service";
import currencyService from "@/services/currency.service";
import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";
import {sortGoodsWithCategories} from "@/utils/goods.utils";

export default {
    state: {
        goods: {},
        categories: {},
        cart: []
    },
    getters: {
        getGoodsData: state => state.goods,
        getCart: state => state.cart,
    },
    actions: {
        [GET_CATEGORIES]: async ({commit}) => {
            const {data: categories} = await goodsService.loadCategories();

            commit(SET_CATEGORIES, categories.data);
        },
        [GET_DATA]: async ({dispatch}) => {
            const {data} = await goodsService.pollGoodsData();
            new Vue({
                watch: {
                    '$goodsList.data'(data) {
                        dispatch(UPDATE_DATA, data);
                    }
                }
            });
            dispatch(UPDATE_DATA, data);
        },
        [UPDATE_DATA]: async ({commit}, {data}) => {
            const exchangeRate = await currencyService.actualDollarExchangeRate();
            const {Value: {Goods: goods = []}} = data;
            commit(UPDATE_DATA, {exchangeRate, goods});
        }
    },
    mutations: {
        [SET_CATEGORIES]: (state, data) => {
            state.categories = data;
        },
        [UPDATE_DATA]: (state, {exchangeRate, goods}) => {
            const payload = {
                goodsData: goods,
                categories: new CategoriesActionsHandler({...state.categories}),
                exchangeRate: exchangeRate,
            };
            const actualData = sortGoodsWithCategories(payload);
            state.goods = {...actualData};
        }
    }
}
