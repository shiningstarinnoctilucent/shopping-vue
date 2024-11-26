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
                        @input="onSearch"
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
                    @change="sortLessons"
                >
                    <option value="asc">Price Low to High</option>
                    <option value="desc">Price High to Low</option>
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
                    <div class="card-body">
                        <h5 class="card-title">{{ lesson.subject }}</h5>
                        <p class="card-text">{{ lesson.description }}</p>
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
</template>

<script>
    export default {
        name: "LessonList",
        data() {
            return {
                lessons: [],
                searchQuery: "",
                sortOrder: "asc",
            };
        },
        computed: {
            filteredLessons() {
                return this.lessons
                    .filter((lesson) =>
                        lesson.subject
                            .toLowerCase()
                            .includes(this.searchQuery.toLowerCase())
                    )
                    .sort((a, b) => {
                        if (this.sortOrder === "asc") return a.price - b.price;
                        return b.price - a.price;
                    });
            },
        },
        methods: {
            fetchLessons() {
                fetch("/api/lessons")
                    .then((response) => response.json())
                    .then((data) => {
                        this.lessons = data;
                    });
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
            onSearch() {
                // 实时搜索功能
            },
            sortLessons() {
                // 触发排序
            },
        },
        mounted() {
            this.fetchLessons();
        },
    };
</script>
