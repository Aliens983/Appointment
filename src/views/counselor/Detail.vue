<template>
  <div class="container page" v-loading="loading">
    <el-page-header @back="$router.back()" :icon="ArrowLeft" content="咨询师详情" />

    <el-card v-if="counselor" class="mt-16">
      <div class="header">
        <el-avatar :size="80" :src="counselor.avatar">{{ counselor.name?.[0] }}</el-avatar>
        <div class="info">
          <h2>{{ counselor.name }} <el-tag>{{ counselor.title }}</el-tag></h2>
          <div class="meta">
            <el-rate :model-value="counselor.rating" disabled show-score />
            <span class="muted">共 {{ counselor.ratingCount }} 评价</span>
          </div>
          <div class="tags">
            <el-tag v-for="s in counselor.specialties" :key="s" type="success" effect="plain">{{ s }}</el-tag>
          </div>
        </div>
        <div class="cta">
          <el-button type="primary" size="large" @click="goBook">
            <el-icon><Calendar /></el-icon> 立即预约
          </el-button>
          <el-button size="large" @click="goChat">
            <el-icon><ChatDotRound /></el-icon> 在线留言
          </el-button>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="tab" class="mt-16">
      <el-tab-pane label="简介" name="intro">
        <el-card>
          <p>{{ counselor?.intro }}</p>
          <h4>从业经历</h4>
          <el-timeline>
            <el-timeline-item v-for="(e, i) in counselor?.experiences || []" :key="i" :timestamp="e.period">
              {{ e.desc }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="可预约时段" name="slots">
        <el-card>
          <div v-for="d in slots" :key="d.date" class="day">
            <div class="date">{{ d.date }}</div>
            <div class="slot-grid">
              <el-button
                v-for="s in d.slots"
                :key="s.slotId"
                :type="s.available ? 'primary' : 'info'"
                :disabled="!s.available"
                plain
                size="small"
                @click="onPickSlot(s)"
              >{{ fmtTime(s.start) }} - {{ fmtTime(s.end) }}</el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowLeft } from '@element-plus/icons-vue'
import { fmtTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)
const counselor = computed(() => store.state.counselor.current)
const slots = ref([])
const tab = ref('intro')

async function load() {
  loading.value = true
  try {
    await store.dispatch('counselor/fetchDetail', route.params.id)
    const data = await store.dispatch('counselor/fetchSlots', route.params.id)
    slots.value = data.days || []
  } finally { loading.value = false }
}

function onPickSlot(s) {
  if (!s.available) return
  if (!store.getters['user/isLoggedIn']) {
    router.push({ path: '/login', query: { redirect: `/appointment/form/${s.slotId}?counselorId=${route.params.id}` } })
  } else {
    router.push({ path: `/appointment/form/${s.slotId}`, query: { counselorId: route.params.id } })
  }
}

function goBook() {
  if (!store.getters['user/isLoggedIn']) {
    router.push({ path: '/login', query: { redirect: `/appointment/book/${route.params.id}` } })
  } else {
    router.push(`/appointment/book/${route.params.id}`)
  }
}

async function goChat() {
  if (!store.getters['user/isLoggedIn']) {
    router.push({ path: '/login', query: { redirect: '/messages' } })
    return
  }
  const convId = await store.dispatch('message/openConversation', Number(route.params.id))
  router.push(`/messages/${convId}`)
}

onMounted(load)
</script>

<style scoped>
.header { display: flex; align-items: center; gap: 24px; }
.info { flex: 1; }
.info h2 { margin: 0 0 8px; display: flex; align-items: center; gap: 8px; }
.meta { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
.tags { display: flex; gap: 6px; flex-wrap: wrap; }
.muted { color: #909399; }
.cta { display: flex; flex-direction: column; gap: 8px; }
.day { padding: 12px 0; border-bottom: 1px solid #ebeef5; }
.date { font-weight: 600; margin-bottom: 8px; }
.slot-grid { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
