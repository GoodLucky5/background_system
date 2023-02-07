<template>
  <div class="container">
    <span>暂无{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    content: {
      type: String,
      default: '图片'
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  border-radius: 25px;
  border: 1px dashed #eee;
  margin: 0 auto;
  color: #ccc;
}
</style>
