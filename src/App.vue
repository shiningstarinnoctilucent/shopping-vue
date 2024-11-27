<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#">Lesson Shop</a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a
                                class="nav-link"
                                href="#"
                                :class="{ active: currentView === 'lessons' }"
                                @click.prevent="currentView = 'lessons'"
                                >Lesson List</a
                            >
                        </li>
                    </ul>
                    <button
                        class="btn btn-light position-relative"
                        @click="toggleView"
                    >
                        <i class="bi bi-cart3"></i> Cart
                        <span
                            v-if="totalQuantity"
                            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        >
                            {{ totalQuantity }}
                        </span>
                    </button>
                </div>
            </div>
        </nav>

        <component
            :is="currentView === 'lessons' ? 'LessonList' : 'ShoppingCart'"
            :cart="cartItems"
            @add-to-cart="addToCart"
            @remove-from-cart="removeFromCart"
            @update-quantity="updateQuantity"
            @clear-cart="clearCart"
        />

        <div
            class="toast-container position-fixed bottom-0 end-0 p-3"
            style="z-index: 11"
        >
            <div
                id="successToast"
                class="toast align-items-center text-white bg-success border-0"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div class="d-flex">
                    <div class="toast-body">
                        {{ toastMessage }}
                    </div>
                    <button
                        type="button"
                        class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"
                    ></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LessonList from "./components/LessonList.vue";
    import ShoppingCart from "./components/ShoppingCart.vue";
    import { Toast } from "bootstrap";

    export default {
        name: "App",
        components: {
            LessonList,
            ShoppingCart,
        },
        data() {
            return {
                cart: [],
                currentView: "lessons",
                toastMessage: "",
            };
        },
        computed: {
            cartItems() {
                return this.cart.map((item) => ({
                    ...item.lesson,
                    quantity: item.quantity,
                    totalPrice: item.lesson.price * item.quantity,
                }));
            },
            totalQuantity() {
                return this.cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            },
        },
        methods: {
            toggleView() {
                this.currentView =
                    this.currentView === "lessons" ? "cart" : "lessons";
            },
            showToast(message) {
                this.toastMessage = message;
                const toastElement = document.getElementById("successToast");
                const toast = new Toast(toastElement);
                toast.show();
            },
            addToCart(lesson) {
                const existingItem = this.cart.find(
                    (item) => item.lesson.id === lesson.id
                );
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.cart.push({
                        lesson: lesson,
                        quantity: 1,
                    });
                }
                this.showToast(`Added ${lesson.subject} to cart`);
            },
            removeFromCart(lesson) {
                const index = this.cart.findIndex(
                    (item) => item.lesson.id === lesson.id
                );
                if (index !== -1) {
                    this.cart.splice(index, 1);
                }
            },
            updateQuantity(lesson, quantity) {
                const item = this.cart.find(
                    (item) => item.lesson.id === lesson.id
                );
                if (item) {
                    if (quantity <= 0) {
                        this.removeFromCart(lesson);
                    } else {
                        item.quantity = quantity;
                    }
                }
            },
            clearCart() {
                this.cart = [];
            },
        },
    };
</script>

<style>
    .toast-container {
        z-index: 1056 !important;
    }

    .nav-link.active {
        font-weight: bold;
    }

    .btn-light:hover {
        background-color: #f8f9fa;
    }
</style>
