<template>
  <div>
    <!--顶部小卡片-->
    <card/>
    <!--销售部分-->
    <sale-part/>
    <!--底部部分-->
    <bottom/>
  </div>
</template>

<script>
import Card from '@/views/dashboard/Card'
import SalePart from '@/views/dashboard/SalePart'
import Bottom from '@/views/dashboard/Bottom'

export default {
  name: 'Dashboard',
  components: {Card, SalePart, Bottom},
  methods: {},
  mounted () {
    this.$store.dispatch('home/getData')
  }
}
</script>

<style scoped>

</style>
