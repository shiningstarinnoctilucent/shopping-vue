<template>
    <div class="container mt-4">
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="input-group">
                    <input
                        type="text"
                        class="form-control"
                        v-model="searchQuery"
                        placeholder="Search lessons"
                        @input="handleSearch"
                    />
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button">
                            <i class="bi bi-search"></i> Search
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <select
                    class="form-select"
                    v-model="sortOrder"
                    @change="handleSort"
                >
                    <option value="price:asc">Price Low to High</option>
                    <option value="price:desc">Price High to Low</option>
                    <option value="subject:asc">Subject A to Z</option>
                    <option value="subject:desc">Subject Z to A</option>
                    <option value="duration:asc">Duration Short to Long</option>
                    <option value="duration:desc">
                        Duration Long to Short
                    </option>
                    <option value="location:asc">Location A to Z</option>
                    <option value="location:desc">Location Z to A</option>
                    <option value="instructor:asc">Instructor A to Z</option>
                    <option value="instructor:desc">Instructor Z to A</option>
                    <option value="spaces:asc">Spaces Low to High</option>
                    <option value="spaces:desc">Spaces High to Low</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div
                class="col-md-4 mb-4"
                v-for="lesson in filteredLessons"
                :key="lesson.id"
            >
                <div class="card h-100">
                    <img
                        :src="'http://localhost:8081' + lesson.image"
                        class="card-img-top"
                        :alt="lesson.subject"
                    />
                    <div class="card-header bg-light">
                        <i :class="lesson.icon" class="me-2"></i>
                        <span class="badge bg-primary">{{
                            lesson.duration
                        }}</span>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ lesson.subject }}</h5>
                        <p class="card-text">{{ lesson.description }}</p>
                        <div class="mb-2">
                            <i class="bi bi-geo-alt me-2"></i>
                            <span>{{ lesson.location }}</span>
                        </div>
                        <div class="mb-2">
                            <i class="bi bi-person me-2"></i>
                            <span>{{ lesson.instructor }}</span>
                        </div>
                        <div
                            class="d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <h5 class="text-primary mb-0">
                                    £{{ lesson.price }}
                                </h5>
                                <small class="text-muted">
                                    {{ lesson.spaces }} spaces left
                                </small>
                            </div>
                            <button
                                class="btn btn-primary"
                                @click="addToCart(lesson)"
                                :disabled="lesson.spaces <= 0"
                            >
                                <i class="bi bi-cart-plus"></i>
                                {{
                                    lesson.spaces > 0
                                        ? "Add to Cart"
                                        : "No Spaces Left"
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
    </div>
</template>

<script>
    import { lessonApi } from "@/api";
    import debounce from "lodash/debounce";

    export default {
        name: "LessonList",
        data() {
            return {
                lessons: [],
                searchQuery: "",
                sortOrder: "price:asc",
                loading: false,
                error: null,
            };
        },
        computed: {
            filteredLessons() {
                return this.lessons;
            },
        },
        created() {
            // Create debounced search function
            this.debouncedSearch = debounce(this.fetchLessons, 300);
        },
        methods: {
            async fetchLessons() {
                try {
                    this.loading = true;
                    this.error = null;

                    const params = {
                        search: this.searchQuery,
                        sort: this.sortOrder,
                    };

                    const data = await lessonApi.getLessons(params);
                    this.lessons = data;
                } catch (error) {
                    console.error("Failed to fetch lessons:", error);
                    this.error = "Failed to load lessons. Please try again.";
                } finally {
                    this.loading = false;
                }
            },
            handleSearch() {
                this.debouncedSearch();
            },
            handleSort() {
                this.fetchLessons();
            },
            addToCart(lesson) {
                if (lesson.spaces > 0) {
                    lesson.spaces--;
                    this.$emit("add-to-cart", {
                        ...lesson,
                        availableSpaces: lesson.spaces,
                    });
                }
            },
        },
        mounted() {
            this.fetchLessons();
        },
    };
</script>

<style scoped>
    .card {
        transition: transform 0.2s;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .card-img-top {
        height: 200px;
        object-fit: cover;
    }

    .card-header i {
        font-size: 1.2rem;
    }

    .badge {
        font-weight: normal;
    }

    /* Add loading and error states styles */
    .loading-overlay {
        position: relative;
        min-height: 200px;
    }

    .error-message {
        color: #dc3545;
        text-align: center;
        padding: 1rem;
    }
</style>
