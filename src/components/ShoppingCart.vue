<template>
    <div class="container mt-4">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">
                    <i class="bi bi-cart3"></i> Shopping Cart
                    <span class="badge bg-light text-primary ms-2">{{
                        cart.length
                    }}</span>
                </h4>
            </div>

            <div class="card-body">
                <!-- Empty cart message -->
                <div v-if="cart.length === 0" class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <p class="mt-3">Your cart is empty. Start shopping now!</p>
                </div>

                <!-- Cart items -->
                <div v-else>
                    <div class="list-group">
                        <div
                            v-for="item in cart"
                            :key="item.id"
                            class="list-group-item"
                        >
                            <div class="row align-items-center">
                                <div class="col-md-2">
                                    <img
                                        :src="
                                            'http://localhost:8081' + item.image
                                        "
                                        class="img-fluid rounded"
                                        :alt="item.name"
                                    />
                                </div>
                                <div class="col-md-3">
                                    <h5 class="mb-1">{{ item.name }}</h5>
                                    <p class="text-muted mb-0">
                                        {{ item.description }}
                                    </p>
                                </div>
                                <div class="col-md-2">
                                    <span class="text-primary fw-bold"
                                        >£{{ item.price }}</span
                                    >
                                </div>
                                <div class="col-md-3">
                                    <div class="input-group">
                                        <button
                                            class="btn btn-outline-secondary"
                                            type="button"
                                            @click="
                                                updateQuantity(
                                                    item,
                                                    item.quantity - 1
                                                )
                                            "
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            class="form-control text-center"
                                            v-model.number="item.quantity"
                                            @change="
                                                updateQuantity(
                                                    item,
                                                    item.quantity
                                                )
                                            "
                                            min="1"
                                        />
                                        <button
                                            class="btn btn-outline-secondary"
                                            type="button"
                                            @click="
                                                updateQuantity(
                                                    item,
                                                    item.quantity + 1
                                                )
                                            "
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-2 text-end">
                                    <button
                                        class="btn btn-outline-danger"
                                        @click="removeFromCart(item)"
                                    >
                                        <i class="bi bi-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Total and checkout button -->
                    <div class="mt-4">
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <h5>
                                Total:
                                <span class="text-primary"
                                    >¥{{ totalAmount }}</span
                                >
                            </h5>
                            <button
                                class="btn btn-success btn-lg"
                                @click="showCheckoutModal"
                            >
                                <i class="bi bi-credit-card"></i> Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Checkout Modal -->
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Checkout</h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <div class="modal-body">
                        <form
                            @submit.prevent="submitOrder"
                            class="needs-validation"
                            novalidate
                        >
                            <div class="mb-3">
                                <label class="form-label"
                                    >Name
                                    <span class="text-danger">*</span></label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="orderForm.name"
                                    :class="{
                                        'is-invalid':
                                            showValidation && !isNameValid,
                                    }"
                                    required
                                />
                                <div class="invalid-feedback">
                                    Please enter a valid name (letters only)
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label"
                                    >Phone
                                    <span class="text-danger">*</span></label
                                >
                                <input
                                    type="tel"
                                    class="form-control"
                                    v-model="orderForm.phone"
                                    :class="{
                                        'is-invalid':
                                            showValidation && !isPhoneValid,
                                    }"
                                    required
                                />
                                <div class="invalid-feedback">
                                    Please enter a valid phone number (numbers
                                    only)
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input
                                    type="email"
                                    class="form-control"
                                    v-model.trim="orderForm.email"
                                    :class="{
                                        'is-invalid':
                                            showValidation &&
                                            orderForm.email &&
                                            !isValidEmail,
                                    }"
                                />
                                <div class="invalid-feedback">
                                    Please enter a valid email address
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-success"
                            @click="submitOrder"
                            :disabled="!isFormValid"
                        >
                            <i class="bi bi-credit-card"></i> Confirm Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bootstrap Toast for notifications -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div
                id="orderToast"
                class="toast align-items-center text-bg-success border-0"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div class="d-flex">
                    <div class="toast-body">Order submitted successfully!</div>
                    <button
                        type="button"
                        class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // Introduce Bootstrap Modal at the top of the file.
    import { Modal, Toast } from "bootstrap";
    import { orderApi } from "@/api/order";

    export default {
        name: "ShoppingCart",
        props: ["cart"],
        data() {
            return {
                orderForm: {
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                },
                showValidation: false,
            };
        },
        computed: {
            isNameValid() {
                return (
                    this.orderForm.name &&
                    /^[A-Za-z\s]+$/.test(this.orderForm.name.trim())
                );
            },
            isPhoneValid() {
                return (
                    this.orderForm.phone &&
                    /^\d+$/.test(this.orderForm.phone.trim())
                );
            },
            isValidEmail() {
                if (!this.orderForm.email) return false;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(this.orderForm.email.trim());
            },
            isFormValid() {
                return (
                    this.isNameValid &&
                    this.isPhoneValid &&
                    (this.email ? this.isValidEmail : true)
                );
            },
            totalAmount() {
                return this.cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
        },
        methods: {
            removeFromCart(item) {
                this.$emit("remove-from-cart", item);
            },
            showCheckoutModal() {
                // 使用导入的 Modal
                const modal = new Modal(
                    document.getElementById("checkoutModal")
                );
                this.showValidation = false; // Reset verification status
                modal.show();
            },
            async submitOrder() {
                this.showValidation = true;

                if (this.isFormValid) {
                    try {
                        const orderData = {
                            lessons: this.cart.map((item) => ({
                                id: item._id,
                                spaces: item.quantity,
                            })),
                            totalAmount: this.totalAmount,
                            ...this.orderForm,
                        };

                        await orderApi.createOrder(orderData);

                        const modal = Modal.getInstance(
                            document.getElementById("checkoutModal")
                        );
                        modal.hide();

                        this.$emit("clear-cart");

                        // Show success toast
                        const toastElement =
                            document.getElementById("orderToast");
                        const toast = new Toast(toastElement);
                        toast.show();
                    } catch (error) {
                        console.error("Failed to submit order:", error);
                        // Optionally, show an error toast
                    }
                }
            },
            updateQuantity(item, quantity) {
                this.$emit("update-quantity", item, quantity);
            },
        },
    };
</script>

<style scoped>
    .modal-body {
        max-height: 70vh;
        overflow-y: auto;
    }

    /* Required field marker */
    .text-danger {
        font-weight: bold;
    }
</style>
