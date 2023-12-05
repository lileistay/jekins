<template>
  <div>
    <ReservationInformation ref="previewRef" />
  </div>
</template>

<script>
// import ReservationInformation from "@/components/reservationinformation"
import ReservationInformation from '@/components/ReservationInformation'
export default {
  data() {
    return {
      appointment: null
    }
  },
  components: {
    ReservationInformation
  },
  created() {
    this.appointment = this.$route.query.id
    // this.$refs.previewRef.getUserInfoById(this.appointment)

  }
}
</script>

<style>
</style>
