<script>
import GamesTable from '@/components/GamesTable.vue'
export default {
  components: { 
    GamesTable
  },
  data() { 
    return {
    allGames: []
  }
},
  async Created() {
    this.allGames = await (await fetch('http://localhost:8080/games')).json()
  }
}
</script>

<template>
  <main>
    <GamesTable :items="allGames
    
    "/>
  </main>
</template>