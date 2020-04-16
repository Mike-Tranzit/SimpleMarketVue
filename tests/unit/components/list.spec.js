import {createLocalVue, shallowMount} from '@vue/test-utils'
import List from "@/components/goods/List.vue";
import Vuex from 'vuex';
import flushPromises from "flush-promises";

import {GET_CATEGORIES, GET_DATA, UPDATE_DATA} from "@/store/actions/goods.actions";

const localVue = createLocalVue();
localVue.use(Vuex);

const getMockData = (price = 10) => {
    const goods = {
        'Еда': [
            {
                "price": price,
                "goodsId": 8,
                "categoryId": 2,
                "availableCount": 10,
                "goodsName": "Суп с пекинской капустой"
            }
        ]
    };
    return {
        goods
    }
}


describe('Cart.vue', () => {
    let wrapper;
    let store;
    const priceUpdateChecker = jest.fn();

    /* Vuex properties */
    const actions = {
        [GET_CATEGORIES]: jest.fn(),
        [GET_DATA]: jest.fn(),
    };
    const getters = {
        getGoodsData: () => state.goods,
        getCartData: () => []
    };
    let state = {
        goods: getMockData().goods,
        categories: {},
        cart: []
    };
    const mutations = {};

    beforeEach(() => {
        store = new Vuex.Store({
            state,
            getters,
            actions,
            mutations
        });
        wrapper = shallowMount(List, {
            store, localVue, directives: {
                priceUpdateChecker
            }
        });
    });

    it('created() has called', async () => {
        await flushPromises();
        expect(actions[GET_CATEGORIES]).toHaveBeenCalled();
        expect(actions[GET_DATA]).toHaveBeenCalled();
    });

    it('should render products', function () {
        const el = wrapper.findAll('.products-group');
        expect(el.length).toEqual(1);
    });
});
