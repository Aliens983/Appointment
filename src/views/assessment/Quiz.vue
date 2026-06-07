<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.back()" :content="quiz?.title || '测评答题'" />

    <el-card class="mt-16" v-if="quiz">
      <div class="head">
        <el-progress :percentage="progress" />
        <span class="muted">{{ currentIndex + 1 }} / {{ quiz.questions.length }}</span>
      </div>

      <div class="question">
        <h3>{{ currentIndex + 1 }}. {{ current.title }}</h3>

        <el-radio-group v-if="current.type === 'single'" v-model="answers[current.id]" class="opts">
          <el-radio v-for="o in current.options" :key="o.value" :value="o.value" border>{{ o.label }}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-else-if="current.type === 'multi'" v-model="answers[current.id]" class="opts">
          <el-checkbox v-for="o in current.options" :key="o.value" :value="o.value" border>{{ o.label }}</el-checkbox>
        </el-checkbox-group>

        <div v-else-if="current.type === 'scale'" class="opts">
          <el-radio-group v-model="answers[current.id]">
            <el-radio v-for="n in scaleRange" :key="n" :value="n">{{ n }}</el-radio>
          </el-radio-group>
          <div class="muted scale-tip">
            <span>{{ current.scaleMinLabel }}</span>
            <span>{{ current.scaleMaxLabel }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button :disabled="currentIndex === 0" @click="prev">上一题</el-button>
        <el-button v-if="currentIndex < quiz.questions.length - 1" type="primary" :disabled="!hasAnswer" @click="next">下一题</el-button>
        <el-button v-else type="success" :disabled="!hasAnswer" :loading="submitting" @click="submit">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()
const loading = ref(false)
const submitting = ref(false)
const quiz = ref(null)
const currentIndex = ref(0)
const answers = ref({})

const current = computed(() => quiz.value?.questions[currentIndex.value] || {})
const progress = computed(() => quiz.value ? Math.round(((currentIndex.value + 1) / quiz.value.questions.length) * 100) : 0)
const scaleRange = computed(() => {
  if (current.value.type !== 'scale') return []
  const arr = []
  for (let i = current.value.scaleMin; i <= current.value.scaleMax; i++) arr.push(i)
  return arr
})
const hasAnswer = computed(() => {
  const v = answers.value[current.value.id]
  if (current.value.type === 'multi') return Array.isArray(v) && v.length > 0
  return v !== undefined && v !== null && v !== ''
})

async function load() {
  loading.value = true
  try {
    quiz.value = await store.dispatch('assessment/fetchDetail', route.params.id)
    // 初始化答案
    quiz.value.questions.forEach(q => {
      if (q.type === 'multi') answers.value[q.id] = []
      else answers.value[q.id] = undefined
    })
  } finally { loading.value = false }
}

function next() { if (currentIndex.value < quiz.value.questions.length - 1) currentIndex.value++ }
function prev() { if (currentIndex.value > 0) currentIndex.value-- }

async function submit() {
  submitting.value = true
  try {
    const list = quiz.value.questions.map(q => ({ questionId: q.id, value: answers.value[q.id] }))
    const { recordId } = await store.dispatch('assessment/submit', { id: quiz.value.id, answers: list })
    ElMessage.success('提交成功,正在生成报告…')
    router.replace(`/assessment/result/${recordId}`)
  } catch (e) {
    // 在 result 页面用 result id 加载,临时跳一个简易页
    router.push('/assessment')
  } finally { submitting.value = false }
}

onMounted(load)
</script>

<style scoped>
.head { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.head .el-progress { flex: 1; }
.muted { color: #909399; font-size: 13px; }
.question h3 { margin: 0 0 16px; }
.opts { display: flex; flex-direction: column; gap: 8px; }
.opts :deep(.el-radio), .opts :deep(.el-checkbox) { margin-right: 0; padding: 12px 16px; width: 100%; }
.scale-tip { display: flex; justify-content: space-between; margin-top: 8px; }
.actions { margin-top: 24px; display: flex; gap: 8px; justify-content: flex-end; }
</style>
