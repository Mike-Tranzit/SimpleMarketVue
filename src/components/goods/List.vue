<template>
  <h1>2</h1>
</template>

<script>
import goodsService from "@/services/goods.service";

export default {
  name: 'GoodsList',
  data() {
    return {
      categories: { data: {} },
      pollData: { data: {} }
    };
  },
  async created() {
    this.categories = await goodsService.fetch();
    const tempPollData = await goodsService.poll();
    this.pollData =
  }
}
</script>
<style scoped>

</style>
