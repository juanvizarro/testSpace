<template>
  <div id="map-container">
    <div class="d-flex flex-row align-center py-4">
      <span>SAMPLING POINTS</span>
      <v-spacer />
      <v-btn color="grey darken-1" dark @click="save">Guardar</v-btn>
    </div>
    <client-only>
      <l-map
        ref="lMap"
        :zoom="18"
        :center="{
          lat: -14.009691362405167,
          lng: -75.80287241936958,
        }"
        :style="{ height: 'calc(80vh)' }"
        :options="{ zoomControl: false }"
        @ready="readyMap"
      >
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <!-- GEOJSON -->
        <l-geo-json :geojson="geojson" @click="addMarker"></l-geo-json>
        <!-- MARKERS -->
        <l-marker
          v-for="(item, i) in markers"
          :ref="`marker${i}`"
          :key="`marker${i}`"
          :lat-lng="[item.position.latitude, item.position.longitude]"
        >
          <l-popup :ref="`popup${i}`">
            <div class="d-flex flex-row align-center pr-4">
              <div
                class="d-flex-column pr-3"
                :style="{ borderRight: '1px solid grey' }"
              >
                <div class="d-flex flex-row align-center pb-3">
                  <span>Muestras</span>
                  <v-text-field-integer
                    v-model.number="item.num_samples"
                    :properties="{
                      outlined: true,
                      dense: true,
                      hideDetails: true,
                    }"
                    class="ml-2 map__input"
                  />
                </div>
                <div class="d-flex flex-row align-center">
                  <span>Radio(m)</span>
                  <v-text-field-integer
                    v-model.number="item.radio"
                    :properties="{
                      outlined: true,
                      dense: true,
                      hideDetails: true,
                    }"
                    class="ml-2 map__input"
                  />
                </div>
              </div>
              <v-btn icon @click="deleteMarker(i)"
                ><v-icon>mdi-trash-can-outline</v-icon></v-btn
              >
            </div>
          </l-popup>
        </l-marker>
        <!-- CIRCLE RADIUS -->
        <l-circle
          v-for="(item, i) in markers"
          :key="`circle${i}`"
          :radius="item.radio"
          color="white"
          :lat-lng="[item.position.latitude, item.position.longitude]"
        />
        <!-- CONTROL ZOOM -->
        <l-control-zoom position="bottomright" />
      </l-map>
    </client-only>
  </div>
</template>

<script>
import geo from '@/one_polygon_carto.json'
export default {
  data: () => ({
    map: null,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    markers: [],
  }),
  computed: {
    geojson() {
      return geo
    },
  },
  methods: {
    readyMap() {
      this.map = this.$refs.lMap.mapObject
    },
    addMarker({ latlng }) {
      const marker = {
        position: {
          latitude: latlng.lat,
          longitude: latlng.lng,
        },
        radio: 0,
        num_samples: 1,
      }
      this.markers.push(marker)
      this.openLastPopup()
    },
    openLastPopup() {
      this.$nextTick(() => {
        const i = this.markers.length - 1 //  index of new marker
        const refName = `marker${i}`
        this.$refs[refName][0].mapObject.openPopup()
      })
    },
    deleteMarker(i) {
      const response = confirm('¿Deseas eliminar el marcador?')
      if (response) this.markers.splice(i, 1)
    },
    save() {
      const json = this.buildJson()
      console.log(json)
    },
    buildJson() {
      const json = { markers: [] }
      this.markers.forEach((marker) => {
        const temp = {
          position: {
            latitude: marker.position.latitude,
            longitude: marker.position.longitude,
          },
          radio: marker.radio,
          num_samples: marker.num_samples,
        }
        json.markers.push(temp)
      })
      return json
    },
  },
}
</script>
<style lang="scss">
#map-container {
  width: 100%;
  .leaflet-popup-close-button {
    display: none;
  }
  .leaflet-popup-content {
    width: 100% !important;
    margin: 10px 12px !important;
  }
  .map {
    &__input {
      .v-input__slot {
        min-height: 32px !important;
      }
    }
  }
}
</style>
