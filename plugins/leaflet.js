import Vue from 'vue'
import L from 'leaflet'
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LPopup,
  LCircle,
  LControlZoom,
} from 'vue2-leaflet'

Vue.prototype.$L = L

Vue.component('LMap', LMap)
Vue.component('LTileLayer', LTileLayer)
Vue.component('LMarker', LMarker)
Vue.component('LGeoJson', LGeoJson)
Vue.component('LPopup', LPopup)
Vue.component('LCircle', LCircle)
Vue.component('LControlZoom', LControlZoom)
