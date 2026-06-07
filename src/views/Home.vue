<template>
  <div class="container page">
    <el-card class="hero">
      <div class="hero-inner">
        <div>
          <h1>愿你被温柔以待</h1>
          <p class="muted">校园心理咨询预约系统,陪你度过每一个需要倾诉的瞬间。</p>
          <div class="cta">
            <el-button type="primary" size="large" @click="$router.push('/counselors')">
              <el-icon><UserFilled /></el-icon> 找咨询师
            </el-button>
            <el-button size="large" @click="$router.push('/assessment')">
              <el-icon><DataAnalysis /></el-icon> 心理测评
            </el-button>
          </div>
        </div>
        <el-icon :size="120" color="#dcdfe6" class="hero-icon"><FirstAidKit /></el-icon>
      </div>
    </el-card>

    <el-row :gutter="16" class="mt-24">
      <el-col :xs="24" :sm="12" :md="6" v-for="f in features" :key="f.title">
        <el-card class="feat" shadow="hover" @click="$router.push(f.path)">
          <el-icon :size="32" :color="f.color"><component :is="f.icon" /></el-icon>
          <h3>{{ f.title }}</h3>
          <p class="muted">{{ f.desc }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-24">
      <template #header><b>温馨提示</b></template>
      <ul class="tips">
        <li>本系统支持匿名预约,开启后您的姓名将以"匿名同学"展示。</li>
        <li>请提前 24 小时取消预约,以便资源释放给其他同学。</li>
        <li>遇到紧急情况,请直接拨打 24 小时心理援助热线:400-xxx-xxxx。</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
const features = [
  { title: '咨询师列表', desc: '查看专长与可约时段', path: '/counselors', icon: 'UserFilled', color: '#5b8def' },
  { title: '我的预约', desc: '管理与评价预约', path: '/appointment/records', icon: 'Calendar', color: '#67c23a' },
  { title: '在线留言', desc: '随时与咨询师沟通', path: '/messages', icon: 'ChatDotRound', color: '#e6a23c' },
  { title: '心理测评', desc: '科学评估心理状态', path: '/assessment', icon: 'DataAnalysis', color: '#f56c6c' }
]
</script>

<style scoped>
.hero { background: linear-gradient(135deg, #f0f5ff, #fff); border: none; }
.hero-inner { display: flex; align-items: center; justify-content: space-between; }
.hero h1 { margin: 0 0 8px; font-size: 28px; }
.muted { color: #909399; }
.cta { margin-top: 24px; display: flex; gap: 12px; }
.cta .el-button { display: inline-flex; gap: 6px; align-items: center; }
.feat { text-align: center; cursor: pointer; margin-bottom: 16px; }
.feat h3 { margin: 12px 0 4px; }
.feat p { margin: 0; font-size: 13px; }
.tips { color: #606266; line-height: 1.9; margin: 0; padding-left: 20px; }
</style>
