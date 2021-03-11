// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
// import router from './router'

Vue.config.productionTip = false
require('@/assets/styles/style.css')

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
    <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      require: true
    }
  },
  template: `
    <div class="product">
    <div class="product-image">
      <a :href="jump_url"><img v-bind:src="image" :alt="description"></a>
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inventory>0 && inventory<10">Almost Sold Out!</p>
      <p v-else-if="inventory>0">Adequate Stock!</p>
      <p v-else>Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <product-details :details="details"></product-details>

      <div v-for="(variant, index) in variants"
           :key="variant.variantId"
           class="color-box"
           :style="{ backgroundColor: variant.variantColor }"
           @mouseover="productUpdate(index)">
        <!--        <p style="display:inline" @mouseover="productUpdate(variant.variantImage)">{{ variant.variantColor }} </p>-->
      </div>

      <!--  <detailOfText :details="showDetail"></detailOfText>-->
      <div class="explains">
        <!--    <div v-show="showDetail">Show</div>-->
        <div @mouseover="showExplain = true" @mouseleave="showExplain = false">
          <u>Show explanation</u>
        </div>
        <p>{{ showexplainComputed }}</p>
      </div>

      <button v-on:click="addToCart"
              :disabled="!inventory"
              :class="{ disabledButton: !inventory }"
      >Add to Cart
      </button>
      <button v-on:click="reduceFromCart">Reduce from cart</button>
    </div>
    <div>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul v-else>
        <li v-for="(review, index) in reviews" :key="index">
          <p>{{ review.name }}</p>
          <p>Rating:{{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
    </div>
    <product-review @review-submitted="addReview"></product-review>
    </div>
  `,
  data () {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      // image: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
      selectedVariant: 0,
      jump_url: 'https://github.com/sun510001?tab=repositories',
      description: 'The product for sale?',
      // inventory: 11,
      // inStock: true,
      details: ['80% cotton', '20% sugar', 'Can not be eat!'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 15
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 15
        }
      ],
      cart: 0,
      showExplain: false,
      ExplainTexts: 'Explanation balabala....'
    }
  },
  methods: {
    addToCart () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    reduceFromCart () {
      this.$emit('reduce-to-cart', this.variants[this.selectedVariant].variantId)
    },
    productUpdate (index) {
      this.selectedVariant = index
      console.log(index)
    }
    // mouseOver () {
    //   this.active = !this.active
    // }
  },
  computed: {
    title () {
      return this.brand + ': ' + this.product + ' (' + this.variants[this.selectedVariant].variantColor + ')'
    },
    image () {
      return this.variants[this.selectedVariant].variantImage
    },
    inventory () {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping () {
      if (this.premium) {
        return 'Free'
      } else {
        return 2.99
      }
    },
    showexplainComputed () {
      if (this.showExplain) {
        return this.ExplainTexts
      } else {
        return ''
      }
    }
  }
})

Vue.component('product-review', {
  template: `
      <form class="review-form" @submit.prevent="onSubmit">
        <p class="error" v-if="errors.length != undefined && errors.length > 1">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
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
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>

        <p>
          <input type="submit" value="Submit">
        </p>

    </form>
    `,
  data () {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit () {
      this.errors = []
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        this.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      } else {
        if (!this.name) this.errors.push('Name required.')
        if (!this.review) this.errors.push('Review required.')
        if (!this.rating) this.errors.push('Rating required.')
        if (!this.recommend) this.errors.push('Recommendation required.')
      }
    }
  }
})
// Vue.component('details', details)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart (id) {
      this.cart.push(id)
    },
    reduceCart (id) {
      this.cart.pop(id)
    }
  }
  // components: { App },
  // template: '<App/>'
})

// export default app
