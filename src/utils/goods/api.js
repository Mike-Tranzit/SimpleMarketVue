import Vue from 'vue'
import endpoints from './endpoints';
import apiService from '@/services/api.service';

async function withPolling(callback, interval) {
    const data = await callback();

    if (!interval) return {data};

    const observableData = Vue.observable({data});

    Vue.prototype.$goodsList = observableData;

    const poll = () => {
        setTimeout(async () => {
            observableData.data = {...(await callback())};
            poll();
        }, interval);
    };
    poll();

    return observableData;
}

export default function api({endpoint, interval}) {
    return withPolling(() => apiService.get(endpoints[endpoint]), interval);
}
