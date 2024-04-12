<script setup lang="ts">
import { ref, defineModel, defineProps, defineEmits, onMounted } from 'vue'

const showPicker = ref(false)
const model = defineModel<any>({ required: true })
const emit = defineEmits<{
    (e: 'labelclick'): void
}>()
const props = defineProps<{
    columns: string[]
    label: string
}>()


const onConfirm = (d: { selectedValues: string[] }) => {
    showPicker.value = false
    console.log(d.selectedValues)
    model.value = d.selectedValues[0]
}

const columnsFunc = () => {

}

const onClick = (e: MouseEvent) => {
    let t = <HTMLElement>(e.target)
    if (t.tagName != "LABEL") {
        showPicker.value = true
        return
    }
    emit("labelclick")
}

const defaultData = ref(<string[]>[])


onMounted(() => {
    let list = [...props.columns]
    defaultData.value = list.sort((a, b) => {
        if (a == model.value) {
            return -1
        }
        if (b == model.value) {
            return 1
        }
        return 0
    })
})

</script>
<template>
    <van-field v-model="model" is-link readonly :label="label" @click="onClick($event)" />
    <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker v-model="defaultData" :columns="columns.map(c => { return { text: c, value: c } })"
            @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
</template>
<style scoped></style>
