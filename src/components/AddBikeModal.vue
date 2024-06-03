<template>
  <dialog class="_addBikeModal" open @click.self="$emit('close')">
    <div class="_addBikeModalContent" :data-step="step">
      <h1>{{ $t('add_bike.title') }}</h1>

      <transition name="fade" mode="out-in">
        <div class="_step" v-if="step === 0">
          <h2>{{ $t('add_bike.how_to_add') }}</h2>
          <p>
            <strong>
              {{ $t('add_bike.simple_steps') }}
            </strong>
          </p>
          <p>
            {{ $t('add_bike.data_license') }}
          </p>
          <p v-html="$t('add_bike.collaborative_bike_database_if_you_have_questions')" />

          <div class="_nav">
            <button type="button" data-color="important" @click="step++">start &gt;</button>
          </div>
        </div>
        <form class="_step" v-else-if="step === 1" @submit.prevent="submitStep1">
          <h2>{{ $t('add_bike.step_1_basic_informations') }}</h2>
          <div class="inputField">
            <label for="model">{{ $t('add_bike.model') }}</label>
            <input type="text" autofocus v-model="model" id="model" />
          </div>

          <div class="inputField">
            <label for="manufacturer">{{ $t('add_bike.manufacturer') }}</label>
            <input type="text" v-model="manufacturer" id="manufacturer" />
            <small v-if="filtered_manufacturers.length > 0">
              {{ $t('add_bike.suggestions') }}
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
                {{ $t('add_bike.a_bike_with_this_model_manufacturer_is_already_in_the_database') }}
              </small>
            </div>
          </div>

          <div class="inputField">
            <label for="price">{{ $t('add_bike.total_bike_length') }}</label>
            <div class="_totalLengthInput">
              <input type="number" v-model.number="totalLength" id="totalLength" required />
              <select v-model="totalLengthUnit">
                <option value="cm">{{ $t('add_bike.cm') }}</option>
                <option value="inches">{{ $t('add_bike.inches') }}</option>
              </select>
            </div>
            <small> {{ $t('add_bike.usually_available_on_the_manufacturer_s_website') }} </small>
          </div>
          <div class="inputField">
            <label for="price">{{ $t('add_bike.product_page_url') }}</label>
            <input type="url" placeholder="https://" v-model="productPageUrl" id="productPageUrl" />
          </div>

          <div class="inputField">
            <label for="frame_made_in">{{ $t('add_bike.bike_mostly_made_in') }}</label>
            <input type="text" v-model="frame_made_in" id="frame_made_in" />
            <small>
              {{ $t('add_bike.if_that_information_is_officially_available') }}
            </small>
          </div>

          <hr />

          <div class="inputField">
            <label for="imageUrl">{{ $t('add_bike.bike_image') }}</label>
            <input type="url" placeholder="https://" v-model="imageUrl" required id="imageUrl" />
            <small>
              {{ $t('add_bike.bike_image_explanation') }}
            </small>
          </div>

          <div class="_nav">
            <button type="button" @click="step--">&lt; {{ $t('add_bike.back') }}</button>
            <input
              type="submit"
              data-color="important"
              class="u-button"
              :value="$t('add_bike.next') + ' &gt;'"
            />
          </div>
        </form>

        <section class="_step" v-else-if="step === 2">
          <h2>{{ $t('add_bike.step_2_profile_image_and_size') }}</h2>
          <MeasureInImg
            :imageUrl="imageUrl"
            v-model:img_left="img_left"
            v-model:img_right="img_right"
            v-model:img_bottom="img_bottom"
          />
          <div class="_nav">
            <button type="button" @click="step--">&lt; {{ $t('add_bike.back') }}</button>
            <button type="button" data-color="important" @click="step++">
              {{ $t('add_bike.next') }} &gt;
            </button>
          </div>
        </section>

        <section class="_step" v-else-if="step === 3">
          <h2>{{ $t('add_bike.step_3_share_this_information') }}</h2>

          <div>{{ $t('add_bike.the_following_code_contains_all_the_informations') }}</div>
          <div class="_recap">
            <pre v-text="JSON.stringify(new_bike_recap, null, 2)" />
          </div>

          <div>
            <strong>{{ $t('add_bike.to_add_this_bike_to_the_database') }}</strong>
          </div>

          <ul>
            <li>
              {{ $t('add_bike.by_mail') }}
              <a
                :href="`mailto:hello@louiseveillard.com?subject=bike comparator / new bike to add&body=${JSON.stringify(new_bike_recap, null, 2) + '%0D%0A%0D%0A---%0D%0A%0D%0AHello,%0D%0A%0D%0A'}`"
              >
                hello@louiseveillard.com
              </a>
            </li>
            <li>
              {{ $t('add_bike.or') }}
              <button type="button" @click="copyToClipboard">
                {{ $t('add_bike.copy_this_code_to_clipboard') }} 📋
              </button>
              <span v-html="$t('add_bike.or_copy_post')" />
            </li>
            <li>
              {{ $t('add_bike.or_if_you_know_a_bit_of_javascript_add_it_yourself') }}
              <ol>
                <li
                  v-html="
                    $t('add_bike.fork_the_repository', {
                      link: `<a
                    href='https://github.com/louis-ev/Cargo-Bikes-Size-Comparator'
                    target='_blank'
                    >Cargo-Bikes-Size-Comparator</a
                  >`
                    })
                  "
                ></li>
                <li>
                  {{ $t('add_bike.if_the_image_includes_a_white_background') }}
                </li>

                <li
                  v-html="
                    $t('add_bike.add_the_bike_informations_to_the', {
                      link: `<a href='https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/blob/main/src/assets/bike_images.json' target='_blank'>bike_images.json</a>`
                    })
                  "
                ></li>
              </ol>
            </li>
          </ul>

          <hr />

          <div>{{ $t('add_bike.thank_you') }}</div>

          <div class="_nav">
            <button type="button" @click="step--">&lt; {{ $t('add_bike.back') }}</button>
            <button type="button" data-color="important" @click="reloadComponent">
              {{ $t('add_bike.add_another_bike') }}
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
    <button autofocus>{{ $t('add_bike.close') }}</button>
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
      totalLength: '',
      totalLengthUnit: 'cm',
      productPageUrl: '',
      imageUrl: '',
      frame_made_in: '',

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
      const frame_made_in = this.frame_made_in

      return {
        id,
        manufacturer,
        model,
        src,
        bike_length_percent,
        bike_length_cm,
        left_margin_percent,
        bottom_margin_percent,
        url,
        frame_made_in
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
    },
    reloadComponent() {
      this.step = 1

      this.model = ''
      this.manufacturer = ''
      this.totalLength = ''
      this.productPageUrl = ''
      this.imageUrl = ''
      this.frame_made_in = ''

      this.img_left = 10
      this.img_right = 10
      this.img_bottom = 10
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
