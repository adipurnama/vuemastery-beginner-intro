Vue.config.devtools = true
var eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
      <div class="product">
        <div class="product-image">
          <img :src="image" />
        </div>

        <div class="product-info">
          <h1>{{ title }}</h1>
          <p v-if="inventory > 10">In Stock</p>
          <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out</p>
          <p v-else>Out of Stock</p>
          <p>Shipping Cost : {{shipping_cost}}</p>

          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>

          <div
            v-for="(variant, index) in variants"
            :key="variant.id"
            class="color-box"
            :style="{backgroundColor: variant.color}"
            @mouseover="updateProduct(index)"
          ></div>

          <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
          >
            Add to Cart
          </button>

          <product-tabs :reviews="reviews"></product-tabs>
        </div>
      </div>
  `,
  data() {
    return {
      brand: 'Awesome',
      product: 'Socks',
      inventory: 11,
      onSale: true,
      details: ['new items', 'really fancy', 'classy'],
      selectedVariantIdx: 0,
      variants: [
        {
          id: 2234,
          color: 'green',
          image: './assets/vmSocks-green.jpg'
        },
        {
          id: 2235,
          color: 'blue',
          image: './assets/vmSocks-green.jpg'
        }
      ],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariantIdx].id)
    },
    updateProduct(index) {
      this.selectedVariantIdx = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    inStock() {
      return this.inventory > 0
    },
    image() {
      return this.variants[this.selectedVariantIdx].image
    },
    shipping_cost() {
      if (this.premium) {
        return 'free'
      }
      return '$ 9'
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>

    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
    </p>
    <p>
      <input type="submit" value="Submit">
    </p>
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: 3
    }
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      eventBus.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab"
          :class="{activeTab: selectedTab === tab}"
          v-for="(tab,index) in tabs"
          :key="index"
          @click="selectedTab = tab"
          >{{tab}}</span>

    <div v-show="selectedTab === 'Reviews'"">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews</p>
      <ul v-else>
        <li v-for="review in reviews">
        <p>{{review.name}}</p>
        <p>Rating: {{review.rating}}</p>
        <p>Review: {{review.review}}</p>
        </li>
      </ul>
    </div>
    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
  </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      let existingCartCount = this.cart[id]
      this.cart.push(id)
    }
  }
})
