import { ref } from "vue";
import axios from "axios";
import router from "../router";

export default function useArtboards() {
    const artboards = ref([]);
    const artboard = ref({});
    const totalArtboards = ref(0);
    const meta = ref({});
    const pages = ref([]);
    const errors = ref({});

    const getArtboards = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/artboards?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            artboards.value = response.data.data;
            totalArtboards.value = response.data.meta.total;
            meta.value = response.data.meta;
            pages.value = response.data.links;
        } catch (error) {
            console.log(error);
        }
    };

    const goToPage = async (page) => {
        if (page >= 1 && page <= meta.value.last_page) {
            await getArtboards(page);
        }
    };
    
    const getPages = () => {
        let pagesArray = [];
        for (let i = 1; i <= meta.value.last_page; i++) {
            pagesArray.push(i);
        }
        return pagesArray;
    }

    const getArtboard = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/artboards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            artboard.value = response.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createArtboard = async (artboard) => {
        try {
            await axios.post("http://localhost:8000/api/v1/artboards", artboard, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            await getArtboards();
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    };

    const updateArtboard = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/artboards/${id}`, artboard.value, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            router.push({ name: "artboards" });
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    }

    const deleteArtboard = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to delete this artboard?")) {
                return;
            }
            await axios.delete(`http://localhost:8000/api/v1/artboards/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            await getArtboards();
        } catch (error) {
            console.log(error);
        }
    }

    return {
        artboards,
        artboard,
        errors,
        getArtboards,
        getArtboard,
        createArtboard,
        updateArtboard,
        deleteArtboard,
        getPages,
        goToPage,
        meta,
        pages,
        totalArtboards,
    };
}