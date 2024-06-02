<template>
  <dialog class="_addBikeModal" open @click.self="$emit('close')">
    <div class="_addBikeModalContent" :data-step="step">
      <h1>Add Bike</h1>

      <transition name="fade" mode="out-in">
        <form class="_step" v-if="step === 1" @submit.prevent="submitStep1">
          <h2>Step 1: basic informations</h2>
          <div class="_addBikeModalInput">
            <label for="model">Model</label>
            <input type="text" autofocus v-model="model" id="model" />
          </div>

          <div class="_addBikeModalInput">
            <label for="manufacturer">Manufacturer</label>
            <input type="text" v-model="manufacturer" id="manufacturer" />
            <small v-if="filtered_manufacturers.length > 0">
              Suggestions
              <div class="_manufacturerSelect">
                <button
                  v-for="e_manufacturer in filtered_manufacturers"
                  :key="e_manufacturer"
                  @click="manufacturer = e_manufacturer"
                >
                  {{ e_manufacturer }}
                </button>
              </div>
            </small>
            <div
              class="_warning"
              v-if="
                bikes.find((bike) => bike.model === model && bike.manufacturer === manufacturer)
              "
            >
              <small>
                A bike with this model/manufacturer is already in the database, proceed only if
                you’re sure you want to add it.
              </small>
            </div>
          </div>

          <div class="_addBikeModalInput">
            <label for="price">Total length</label>
            <small> Usually available on the manufacturer's website. </small>
            <div class="_totalLengthInput">
              <input type="number" v-model.number="totalLength" id="totalLength" required />
              <select v-model="totalLengthUnit">
                <option value="cm">cm</option>
                <option value="inches">inches</option>
              </select>
            </div>
          </div>
          <div class="_addBikeModalInput">
            <label for="price">Product page URL</label>
            <input type="url" placeholder="https://" v-model="productPageUrl" id="productPageUrl" />
          </div>

          <div class="_addBikeModalInput">
            <label for="imageUrl">URL to image</label>
            <small>
              It must be a profile image of the bike, with the front to the right, ideally on a
              white or transparent background. Higher resolution is better (at least 1000px in each
              dimension).
            </small>
            <input type="url" placeholder="https://" v-model="imageUrl" required id="imageUrl" />
          </div>

          <input type="submit" class="u-button" value="next &gt;" />
        </form>

        <section class="_step" v-else-if="step === 2">
          <h2>Step 2: profile image and size</h2>
          <MeasureInImg :imageUrl="imageUrl" />
        </section>

        <section class="_step" v-else-if="step === 3">
          <h2>Step 3</h2>
          <div>Click this button to send an email with the correct informations.</div>
          <button type="button">Send</button>
        </section>
      </transition>
      <!-- 
      <transition name="fade" mode="out-in">
        <div class="_nav" :key="step">
          <button type="button" v-if="step > 1" @click="step--">&lt; back</button>
          <button type="button" v-if="step === 3" @click="reloadComponent">Add another bike</button>
          <button type="button" v-if="step < 3" :disabled="!imageUrl" @click="step++">
            next &gt;
          </button>
        </div>
      </transition> -->
    </div>
    <button autofocus>Fermer</button>
  </dialog>
</template>
<script>
import MeasureInImg from './add_bikes/MeasureInImg.vue'

export default {
  props: {
    bikes: Array
  },
  components: {
    MeasureInImg
  },
  data() {
    return {
      step: 1,

      model: '',
      manufacturer: '',
      totalLength: 12,
      totalLengthUnit: 'cm',
      productPageUrl: '',
      imageUrl: 'https://veloe.eu/wp-content/uploads/2024/04/multi-lungo-bosch-yellow.jpg'
    }
  },
  created() {},
  mounted() {},
  beforeUnmount() {},
  watch: {},
  computed: {
    all_manufacturers() {
      return this.bikes
        .map((bike) => bike.manufacturer)
        .filter((value, index, self) => self.indexOf(value) === index)
    },
    filtered_manufacturers() {
      return this.all_manufacturers.filter(
        (manufacturer) =>
          this.$normalizeStringForSearch(manufacturer).includes(
            this.$normalizeStringForSearch(this.manufacturer)
          ) && manufacturer !== this.manufacturer
      )
    }
  },
  methods: {
    submitStep1() {
      this.step++
    }
  }
}
</script>
<style lang="scss" scoped>
._addBikeModal {
  position: fixed;
  width: 100%;
  height: 100%;
  // top: 0;
  // left: 0;
  padding: 2rem;
  // background-color: rgba(0, 0, 0, 0.9);
  background-color: rgba(155, 155, 155, 0.9);
  backdrop-filter: blur(10px);

  border: none;
}
._addBikeModalContent {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 0.5rem;
  background: var(--color-background);

  display: flex;
  flex-direction: column;
  gap: 2rem;

  &[data-step='2'] {
    max-width: 900px;
  }

  h1 {
    flex: 0 0 auto;
    margin-bottom: 0;
  }
  // ._step {
  //   flex: 1 1 auto;
  // }
  ._nav {
    flex: 0 0 auto;
  }
}

._steps {
  li {
    margin-bottom: 1rem;
  }
}

h2 {
  margin-bottom: 0.5rem;
}
._addBikeModalInput {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 0rem;
  // border-bottom: 1px solid #000;

  label {
    font-size: 0.8rem;
    font-weight: 800;
  }
  // gap: 0.5rem;
}
._totalLengthInput {
  display: flex;
  gap: 0.25rem;
  input {
    // flex: 1 1 auto;
    text-align: right;
  }
}

._nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  // margin-top: 2rem;
}

._manufacturerSelect {
  display: flex;
  flex-flow: row wrap;
  gap: 0.25rem;
  // border: 1px solid #000;
  // padding: 0 0.25rem;
  // background-color: #f0f0f0;
  border-radius: 0.25rem;

  button {
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #000;
  }
}

._warning {
  color: var(--color-warning);
}
</style>
