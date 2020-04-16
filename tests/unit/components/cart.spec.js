import {createLocalVue, shallowMount} from '@vue/test-utils'
import Cart from "@/components/goods/Cart.vue";
import Vuex from 'vuex';

import {DELETE_FROM_CART, UPDATE_CART, UPDATE_DATA} from "@/store/actions/goods.actions";
import {debounce} from "@/utils/custom.utils";

const localVue = createLocalVue();
localVue.use(Vuex);

const getMockData = (availableCount = 0, elementValue = '') => {
    const product = {
        "price": 169.06,
        "goodsId": 8,
        "categoryId": 2,
        "availableCount": availableCount,
        "goodsName": "Суп с пекинской капустой"
    };
    const productInBox = {
        "goodsId": 8,
        "price": 100.58,
        "count": 1,
        "goodsName": "Суп с пекинской капустой",
        "groupName": "Еда"
    };
    const index = "Еда";
    const event = {
        target: {
            value: elementValue
        }
    }
    return {
        product,
        productInBox,
        index,
        event
    }
}

describe('Cart.vue', () => {
    let wrapper;
    let store;

    /* Vuex properties */
    const actions = {
        [DELETE_FROM_CART]: jest.fn(),
        [UPDATE_CART]: jest.fn((groupName, product) => {
            state.cart.push(product);
        }),
        [UPDATE_DATA]: jest.fn((index) => {
            state.cart.splice(index, 1);
        }),
    };
    const getters = {
        getGoodsData: () => ({
            'Еда': [
                getMockData(10).product
            ]
        }),
        getCartData: () => []
    };
    let state = {
        goods: {},
        categories: {},
        cart: []
    };
    const mutations = {
        [UPDATE_DATA]: jest.fn()
    };
    beforeEach(() => {
        store = new Vuex.Store({
            state,
            getters,
            actions,
            mutations
        });
        wrapper = shallowMount(Cart, {store, localVue});
    });

    it('Cart is created', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    });

    it('product has\'t added to cart', function () {
        let {index, product} = getMockData(0);
        wrapper.vm.addProduct(product, index);
        expect(actions[UPDATE_CART]).not.toHaveBeenCalled();
        expect(state.cart.length).toBe(0);
    });

    it('call addProduct with positive availableCount', () => {
        let {index, product} = getMockData(1);
        wrapper.vm.addProduct(product, index);
        expect(actions[UPDATE_CART]).toHaveBeenCalled();
    });

    it('product has added to cart', function () {
        let {index, product} = getMockData(1);
        wrapper.vm.addProduct(product, index);
        expect(state.cart.length).toBeGreaterThan(0);
    });

    it('delete was called', function () {
        wrapper.vm.deleteProduct(0);
        expect(actions[DELETE_FROM_CART]).toHaveBeenCalled();
    });

    it('slice item when delete call', function () {
        let {index, product} = getMockData(1);
        wrapper.vm.addProduct(product, index);
        wrapper.vm.deleteProduct(0);
    });

    it('cartIsNotEmpty is false', () => {
        expect(wrapper.vm.cartIsNotEmpty).toBe(false);
    });

    it('countChecker was\'t called', (done) => {
        let {event, product} = getMockData(0, 0);
        wrapper.vm.checkAvailableCount(product, event);
        const checker = jest.fn(wrapper.vm.countChecker);
        const CHANGE_DEBOUNCE = 500;
        debounce(CHANGE_DEBOUNCE, () => {
            expect(checker).not.toHaveBeenCalled();
            done();
        })();
    });

    it('should commit UPDATE_DATA', function () {
        let {productInBox: product, event} = getMockData(10, 2);
        wrapper.vm.countChecker(product, event);
        expect(mutations[UPDATE_DATA]).toHaveBeenCalled();
    });

    afterEach(() => {
        state = {
            goods: {},
            categories: {},
            cart: []
        };
        jest.restoreAllMocks();
    });
})

