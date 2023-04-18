import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default function useCategories() {
    const categories = ref([]);
    const category = ref({});
    const meta = ref({});
    const totalCategories = ref(0);
    const pages = ref([]);
    const errors = ref({});
    const router = useRouter();

    const getCategories = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/categories?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            categories.value = response.data.data;
            totalCategories.value = response.data.meta.total;
            meta.value = response.data.meta;
            pages.value = response.data.links;
        } catch (error) {
            console.log(error);
        }
    },

    goToPage = async (page) => {
        if (page >= 1 && page <= meta.value.last_page) {
            await getCategories(page);
        }
    },

    getPages = () => {
        let pagesArray = [];
        for (let i = 1; i <= meta.value.last_page; i++) {
            pagesArray.push(i);
        }
        return pagesArray;
    }

    const getCategory = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
            });
            category.value = response.data.data;
        } catch (error) {
            console.log(error);
        }
    }

    const createCategory = async (category) => {
        try {
            await axios.post('http://localhost:8000/api/v1/categories', category, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            await getCategories();
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    }

    const updateCategory = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/categories/${id}`, category.value, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
            });
            await router.push({ name: 'categories' });
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    }

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
            });
            await getCategories();
        } catch (error) {
            console.log(error);
        }
    }


    return {
        categories,
        category,
        errors,
        getCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        goToPage,
        getPages,
        meta,
        pages,
        totalCategories
    }
}