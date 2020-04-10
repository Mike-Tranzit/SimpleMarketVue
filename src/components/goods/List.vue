<template>
  <h1>2</h1>
</template>

<script>

//import { mapGetters } from "vuex";
import { GET_CATEGORIES } from "@/store/actions/goods.actions"; // GET_DATA

export default {
  name: 'GoodsList',
  data() {
    return {
      data: { data: {} }
    };
  },
  async created() {
    await this.$store.dispatch(GET_CATEGORIES);
    // await this.$store.dispatch(GET_DATA);
  }
}
</script>
<style scoped>

</style>
