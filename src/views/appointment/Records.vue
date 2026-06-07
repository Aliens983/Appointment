<template>
  <div class="container page">
    <h2 class="title">我的预约</h2>
    <el-tabs v-model="activeTab" @tab-change="onTabChange">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="待咨询" name="upcoming" />
      <el-tab-pane label="已完成" name="completed" />
      <el-tab-pane label="已取消" name="cancelled" />
    </el-tabs>

    <EmptyState v-if="!loading && list.length === 0" />
    <AppointmentCard
      v-for="a in list"
      :key="a.id"
      :item="a"
      @detail="$router.push(`/appointment/records/${a.id}`)"
      @cancel="onCancel"
      @review="openReview"
    />

    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @current-change="load"
      @size-change="load"
    />

    <el-dialog v-model="reviewVisible" title="评价" width="420px">
      <el-form>
        <el-form-item label="评分">
          <el-rate v-model="reviewForm.score" />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="reviewForm.content" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitReview">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import AppointmentCard from '@/components/AppointmentCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const store = useStore()
const list = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const activeTab = ref('all')

const reviewVisible = ref(false)
const submitting = ref(false)
const reviewTarget = ref(null)
const reviewForm = reactive({ score: 5, content: '' })

async function load() {
  loading.value = true
  try {
    const res = await store.dispatch('appointment/fetchList', { status: activeTab.value, page: page.value, pageSize: pageSize.value })
    list.value = res.list
    total.value = res.total
  } finally { loading.value = false }
}

function onTabChange() { page.value = 1; load() }

async function onCancel(item) {
  try {
    await ElMessageBox.confirm(`确定要取消 #${item.id} 的预约吗?`, '提示', { type: 'warning' })
    await store.dispatch('appointment/cancel', item.id)
    ElMessage.success('已取消')
    load()
  } catch (e) {}
}

function openReview(item) {
  reviewTarget.value = item
  reviewForm.score = 5
  reviewForm.content = ''
  reviewVisible.value = true
}

async function submitReview() {
  submitting.value = true
  try {
    await store.dispatch('appointment/review', { id: reviewTarget.value.id, score: reviewForm.score, content: reviewForm.content })
    ElMessage.success('评价成功')
    reviewVisible.value = false
    load()
  } catch (e) {} finally { submitting.value = false }
}

watch(() => route.query.status, v => {
  if (v) activeTab.value = String(v)
  load()
}, { immediate: true })

onMounted(load)
</script>

<style scoped>
.title { margin: 0 0 16px; }
.pagination { display: flex; justify-content: center; margin-top: 24px; }
</style>
