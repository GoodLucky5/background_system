<template>
  <div style="user-select: none">
    <div class="card-header">
      <!--card标题-->
      <span class="title">{{ title }}</span>
      <!--info图标-->
      <svg t="1662343162256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="3120" width="16" height="16">
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z"
          p-id="3121" fill="#d9d9d9"></path>
        <path d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z" p-id="3122" fill="#d9d9d9"></path>
        <path
          d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z"
          p-id="3123" fill="#d9d9d9"></path>
      </svg>
    </div>
    <!--card内容-->
    <div class="card-content">
      {{ count }}
    </div>
    <!--card图表部分-->
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <!--card底部-->
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: {
    //标题
    title: {
      type: String,
      default: "xxxxx"
    },
    //数量
    count: {
      default: 0
    }
  }
}
</script>

<style scoped lang="less">
//头部
.card-header {
  font-size: 16px;
  color: #d9d9d9;
  display: flex;
  justify-content: space-between;
}

//内容区域
.card-content {
  font-size: 30px;
  padding: 10px 0;
}

//图表部分
.card-charts {
  display: flex;
  justify-content: space-between;
  height: 50px;
  font-size: 16px;
  padding-bottom: 5px;
}

//card底部
.card-footer {
  border-top: 1px solid #eee;
  padding: 5px 0;
}
</style>
