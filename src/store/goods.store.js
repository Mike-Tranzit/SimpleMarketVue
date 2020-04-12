import Vue from "vue";
import {ADD_TO_CART, GET_CATEGORIES, GET_DATA, SET_CATEGORIES, INIT_DATA, UPDATE_DATA} from './actions/goods.actions';
import goodsService from "@/services/goods.service";
import currencyService from "@/services/currency.service";
import {CategoriesActionsHandler} from "@/utils/category-proxy.utils";
import {sortGoodsWithCategories} from "@/utils/goods.utils";
import Cart from "@/utils/cart.utils";

export default {
    state: {
        goods: {},
        categories: {},
        cart: []
    },
    getters: {
        getGoodsData: state => state.goods,
        getCartData: state => state.cart,
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
                        dispatch(INIT_DATA, data);
                    }
                }
            });
            dispatch(INIT_DATA, data);
        },
        [INIT_DATA]: async ({commit}, {data}) => {
            const exchangeRate = await currencyService.actualDollarExchangeRate();
            const {Value: {Goods: goods = []}} = data;
            commit(INIT_DATA, {exchangeRate, goods});
        },
        [ADD_TO_CART]({commit, state}, {product, groupName}) {
            const cart = new Cart(product, groupName, {
                cartState: state.cart,
                goodsState: state.goods
            });
            cart.setInitCartPosition();
            cart.increaseProductCount();
            commit(ADD_TO_CART, {newState: cart.state.cartState});
            commit(UPDATE_DATA, {newState: cart.state.goodsState});
        }
    },
    mutations: {
        [SET_CATEGORIES]: (state, data) => {
            state.categories = data;
        },
        [INIT_DATA]: (state, {exchangeRate, goods}) => {
            const payload = {
                goodsData: goods,
                categories: new CategoriesActionsHandler({...state.categories}),
                exchangeRate: exchangeRate,
            };
            const actualData = sortGoodsWithCategories(payload);
            state.goods = {...actualData};
        },
        [UPDATE_DATA]: (state, {newState}) => {

        },
        [ADD_TO_CART]: (state, {newState}) => {
            state.cart = [...newState];
        }
    }
}
