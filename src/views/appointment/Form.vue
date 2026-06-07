<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.back()" content="填写预约信息" />

    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :md="16">
        <el-card>
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="咨询主题" prop="topic">
              <el-input v-model="form.topic" placeholder="一句话描述你希望咨询的问题" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item label="详细描述" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="可选,补充背景与期望(500 字内)" maxlength="500" show-word-limit />
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgency">
              <el-radio-group v-model="form.urgency">
                <el-radio value="normal">一般</el-radio>
                <el-radio value="urgent">较紧急</el-radio>
                <el-radio value="very_urgent">紧急</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="匿名预约" prop="isAnonymous">
              <el-switch v-model="form.isAnonymous" />
              <span class="muted ml-8">开启后将以"匿名同学"展示</span>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone" v-if="!form.isAnonymous">
              <el-input v-model="form.contactPhone" placeholder="便于咨询师紧急联系" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitting" @click="onSubmit">提交预约</el-button>
              <el-button @click="$router.back()">返回</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card>
          <template #header><b>预约摘要</b></template>
          <div v-if="slot" class="summary">
            <p>时段:#{{ slot.slotId }}</p>
            <p>时间:{{ fmtDateTime(slot.start) }} - {{ fmtTime(slot.end) }}</p>
            <el-divider />
            <p class="muted">提交后请关注"我的预约"页面查看状态。</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { fmtDateTime, fmtTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useStore()
const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const slot = ref(null)

const form = reactive({ topic: '', description: '', urgency: 'normal', isAnonymous: false, contactPhone: '' })
const rules = {
  topic: [{ required: true, min: 1, max: 30, message: '请输入 1-30 字主题', trigger: 'blur' }]
}

async function loadSlot() {
  loading.value = true
  try {
    const counselorId = Number(route.query.counselorId)
    // 通过所有咨询师查到该 slot
    // 这里简化:从 store 中找
    const all = store.state.counselor.currentSlots
    for (const d of all) {
      const s = d.slots.find(x => x.slotId === Number(route.params.slotId))
      if (s) { slot.value = s; return }
    }
    // 若找不到(直接进入),按需加载
    if (counselorId) {
      const data = await store.dispatch('counselor/fetchSlots', counselorId)
      for (const d of data.days || []) {
        const s = d.slots.find(x => x.slotId === Number(route.params.slotId))
        if (s) { slot.value = s; return }
      }
    }
  } finally { loading.value = false }
}

async function onSubmit() {
  await formRef.value.validate(async valid => {
    if (!valid) return
    submitting.value = true
    try {
      await store.dispatch('appointment/create', {
        slotId: Number(route.params.slotId),
        topic: form.topic,
        description: form.description,
        urgency: form.urgency,
        isAnonymous: form.isAnonymous,
        contactPhone: form.contactPhone
      })
      ElMessage.success('预约成功!')
      router.push('/appointment/records?status=upcoming')
    } catch (e) {} finally { submitting.value = false }
  })
}

onMounted(loadSlot)
</script>

<style scoped>
.muted { color: #909399; }
.ml-8 { margin-left: 8px; }
.summary p { margin: 8px 0; }
</style>
