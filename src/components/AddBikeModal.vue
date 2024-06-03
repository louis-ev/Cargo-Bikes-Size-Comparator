<template>
  <dialog class="_addBikeModal" open @click.self="$emit('close')">
    <div class="_addBikeModalContent" :data-step="step">
      <h1>Add a bike</h1>

      <transition name="fade" mode="out-in">
        <div class="_step" v-if="step === 0">
          <h2>How to add a bike to this tool</h2>
          <p>
            The following form will explain how to contribute a bike to this tool.
            <strong
              >There are 3 simple steps to follow and it should take you between 2 and 5
              minutes.</strong
            >
          </p>
          <p>
            The data you'll provide will be added to the database with the same free and open-source
            license (AGPL v3) as the rest of the tool.
          </p>
          <p>
            You can see the collaborative bike database
            <a
              href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/blob/main/src/assets/bike_images.json"
              target="_blank"
              >here</a
            >. If you have any questions, send me an email at
            <a href="mailto:hello@louiseveillard.com">hello@louiseveillard.com</a>.
          </p>

          <div class="_nav">
            <button type="button" data-color="important" @click="step++">start &gt;</button>
          </div>
        </div>
        <form class="_step" v-else-if="step === 1" @submit.prevent="submitStep1">
          <h2>Step 1: Basic informations</h2>
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
            <label for="price">Total bike length</label>
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

          <div class="_addBikeModalInput">
            <label for="frame_made_in">Bike mostly made in</label>
            <input type="text" v-model="frame_made_in" id="frame_made_in" />
            <small>
              If that information is officially available, the name of the country the bike and its
              frame is made in.</small
            >
          </div>

          <div class="_nav">
            <button type="button" @click="step--">&lt; back</button>
            <input type="submit" data-color="important" class="u-button" value="next &gt;" />
          </div>
        </form>

        <section class="_step" v-else-if="step === 2">
          <h2>Step 2: profile image and size</h2>
          <MeasureInImg
            :imageUrl="imageUrl"
            v-model:img_left="img_left"
            v-model:img_right="img_right"
            v-model:img_bottom="img_bottom"
          />
          <div class="_nav">
            <button type="button" @click="step--">&lt; back</button>
            <button type="button" data-color="important" @click="step++">next &gt;</button>
          </div>
        </section>

        <section class="_step" v-else-if="step === 3">
          <h2>Step 3: share this information</h2>
          <div>The following code contains all the informations you've provided:</div>
          <div class="_recap">
            <pre v-text="JSON.stringify(new_bike_recap)" />
            <button type="button" @click="copyToClipboard">Copy to clipboard 📋</button>
          </div>

          <div><strong>To add this bike to the database, you can either:</strong></div>

          <ul>
            <li>
              <a
                :href="`mailto:${email}?subject=bike comparator / new bike to add&body=${JSON.stringify(new_bike_recap, null, 2) + '%0D%0A%0D%0A---%0D%0A%0D%0AHello,%0D%0A%0D%0A'}`"
                >send me an email</a
              >
              with this information and I'll do it for you and let you know when it's done.
            </li>
            <li>
              or copy this information and post it in a comment there and @ me (
              <a href="https://piaille.fr/@louis_ev">@louis_ev on Mastodon</a>,
              <a href="https://x.com/timetofirstfix">@timetofirstfix on X</a>, or
              <a href="https://www.reddit.com/user/luddits/">@luddits on Reddit</a>
              ).
            </li>
            <li>
              or, if you know a bit of JavaScript, add it yourself:
              <ol>
                <li>
                  Fork the repository
                  <a href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator">
                    Cargo-Bikes-Size-Comparator
                  </a>
                  on GitHub,
                </li>
                <li>
                  If the image includes a white background, remove it and save it as a PNG with the
                  highest possible resolution,
                </li>

                <li>
                  Add the bike informations to the
                  <a
                    href="https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/blob/main/src/assets/bike_images.json"
                  >
                    bike_images.json
                  </a>
                  file
                </li>
              </ol>
            </li>
          </ul>
          <hr />

          <div>Click this button to send an email with the correct informations.</div>
          <button type="button">Send</button>

          <div class="_nav">
            <button type="button" @click="step--">&lt; back</button>
            <button type="button" data-color="important" @click="reloadComponent">
              add another bike
            </button>
          </div>
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
      step: 0,

      model: '',
      manufacturer: '',
      totalLength: 12,
      totalLengthUnit: 'cm',
      productPageUrl: '',
      imageUrl: 'https://veloe.eu/wp-content/uploads/2024/04/multi-lungo-bosch-yellow.jpg',

      img_left: 10,
      img_right: 10,
      img_bottom: 10
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
    sorted_manufacturers() {
      return this.all_manufacturers.sort((a, b) => a.localeCompare(b))
    },
    filtered_manufacturers() {
      return this.sorted_manufacturers.filter(
        (manufacturer) =>
          this.$normalizeStringForSearch(manufacturer).includes(
            this.$normalizeStringForSearch(this.manufacturer)
          ) && manufacturer !== this.manufacturer
      )
    },
    new_bike_recap() {
      const id = (this.model + ' ' + this.manufacturer).toLowerCase().replace(/ /g, '-')
      const manufacturer = this.manufacturer
      const model = this.model
      const src = this.imageUrl
      const bike_length_percent = (100 - this.img_left - this.img_right) / 100

      let bike_length_cm
      if (this.totalLengthUnit === 'inches') {
        bike_length_cm = this.totalLength * 2.54
      } else {
        bike_length_cm = this.totalLength
      }

      const left_margin_percent = this.img_left / 100
      const bottom_margin_percent = this.img_bottom / 100
      const url = this.productPageUrl

      return {
        id,
        manufacturer,
        model,
        src,
        bike_length_percent,
        bike_length_cm,
        left_margin_percent,
        bottom_margin_percent,
        url
      }
    }
  },
  methods: {
    submitStep1() {
      this.step++
    },
    copyToClipboard() {
      const text = JSON.stringify(this.new_bike_recap)
      navigator.clipboard.writeText(text)
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
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  transition: all 0.5s ease-in-out;

  &[data-step='2'] {
    max-width: 900px;
  }

  h1 {
    position: sticky;
    top: -1rem;
    flex: 0 0 auto;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 800;
    background-color: var(--color-text);
    color: var(--color-background);
    padding: 0.5rem 1rem;
    margin: -1rem;
    margin-bottom: -1.5rem;
    z-index: 10;
    // border-radius: 0.5rem;
  }
  // ._step {
  //   flex: 1 1 auto;
  // }
  ._nav {
    flex: 0 0 auto;
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
    text-align: center;
  }
}

._nav {
  // // position: sticky;
  // bottom: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;

  button,
  input[type='submit'] {
    // background-color: white;
  }
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

pre {
  font-size: 0.8rem;
  font-family: 'Mono', 'Courier', sans-serif;
  background-color: var(--color-text);
  color: var(--color-background);
  padding: 0.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
._recap {
  margin-bottom: 1rem;
  position: relative;
  button {
    // position: absolute;
    // top: 0;
    // right: 0;
    // color: white;
    // background-color: var(--color-text-secondary);
  }
}
</style>
