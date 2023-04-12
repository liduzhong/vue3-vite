<template>
  <div class="calendar">
    <div class="header">
      <button class="prev" @click="prevMonth">&lt;</button>
      <div class="month">{{ renderMonth() }}</div>
      <button class="next" @click="nextMonth">&gt;</button>
    </div>
    <div class="weekdays">
      <div v-for="day in daysOfWeek" :key="day">{{ day }}</div>
    </div>
    <div class="days">
      <div v-for="(day, index) in days" :key="index" :class="day.className" @click="handleClick(day)">
        <div class="date">{{ day.date }}</div>
        <div class="holiday-name">{{ day.holiday }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['select'])

const holidays = {
  '2018/1/1': '元旦节',
  '2018/2/15': '春节',
  '2018/4/5': '清明节',
  '2018/5/1': '劳动节',
  '2018/6/18': '端午节',
  '2018/9/24': '中秋节',
  '2018/10/1': '国庆节',
  '2019/1/1': '元旦节',
  '2019/2/5': '春节',
  '2019/4/5': '清明节',
  '2019/5/1': '劳动节',
  '2019/6/7': '端午节',
  '2019/9/13': '中秋节',
  '2019/10/1': '国庆节',
  '2020/1/1': '元旦节',
  '2020/1/24': '春节',
  '2020/4/4': '清明节',
  '2020/5/1': '劳动节',
  '2020/6/25': '端午节',
  '2020/10/1': '国庆节',
  '2021/1/1': '元旦节',
  '2021/2/12': '春节',
  '2021/4/4': '清明节',
  '2021/5/1': '劳动节',
  '2021/6/14': '端午节',
  '2021/9/21': '中秋节',
  '2021/10/1': '国庆节',
  '2022/1/1': '元旦节',
  '2022/1/31': '春节',
  '2022/4/5': '清明节',
  '2022/5/1': '劳动节',
  '2022/6/2': '端午节',
  '2022/9/10': '中秋节',
  '2022/10/1': '国庆节',
  '2023/1/1': '元旦节',
  '2023/2/20': '春节',
  '2023/4/5': '清明节',
  '2023/5/1': '劳动节',
  '2023/6/22': '端午节',
  '2023/9/30': '中秋节',
  '2023/10/1': '国庆节',
}
const days = ref([])
const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六']
const date = ref(new Date())
const selectedDate = date.value

const initCalendar = () => {
  let daysArray = []

  // 获取当前月份的第一天
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  // 获取当前月份的最后一天
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
  // 获取当前月份的最后一天是几号
  const lastDateOfMonth = lastDayOfMonth.getDate()

  // 获取当前月份的第一天是星期几
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // 获取当前月份的最后一天是星期几
  const lastDayOfWeek = lastDayOfMonth.getDay()

  // 获取上个月份一共有多少天
  const prevMonthDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate()

  // 将上个月的日期添加到days数组中
  for (let i = prevMonthDays - firstDayOfWeek + 1; i <= prevMonthDays; i++) {
    daysArray.push({
      date: i,
      className: ['prev-month'],
    })
  }
  // 将当前月份的日期添加到days数组中
  for (let i = 1; i <= lastDateOfMonth; i++) {
    // 获取到每个索引对应的日期
    const currDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i).toLocaleDateString()

    // 判断是否是今天
    const isToday = currDate === new Date().toLocaleDateString()

    daysArray.push({
      date: i,
      className: ['curr-month', isToday ? 'today' : ''],
      holiday: holidays[currDate] || '', // 判断是否是节假日
    })
  }
  // 将下个月的日期添加到days数组中
  for (let i = 1; i <= 13 - lastDayOfWeek; i++) {
    if (daysArray.length >= 42) {
      break
    }
    daysArray.push({
      date: i,
      className: ['next-month'],
    })
  }
  days.value = daysArray
}

const prevMonth = () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1)
  initCalendar()
}
const nextMonth = () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1)
  initCalendar()
}

const handleClick = day => {
  const { date, className, holiday } = day
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1
  if (className.includes('curr-month')) {
    emit('select', { year, month, date, holiday })
  }
}
const renderMonth = () => {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1
  return `${year}年${month}月`
}
initCalendar()
</script>

<style scoped>
.calendar {
  font-family: Arial, sans-serif;
  width: 280px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.weekdays {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f0f0f0;
}

.days {
  display: flex;
  flex-wrap: wrap;
  padding: 8px;
}

.days > div {
  width: calc(100% / 7);
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.days .prev-month,
.days .next-month {
  color: #ccc;
}
.days .today {
  background-color: #2a58e0;
  color: #fff;
}
.days .today:hover {
  background-color: #2a58e0;
}
.days .holiday-name {
  color: red;
  font-size: 12px;
  transform: scale(0.8);
}

.days > div:hover {
  background-color: #f0f0f0;
}
</style>