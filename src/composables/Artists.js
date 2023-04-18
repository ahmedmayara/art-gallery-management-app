import { ref } from "vue";
import axios from "axios";

export default function useArtists() {
    const artists = ref([]);
    const artist = ref({});
    const totalArtists = ref(0);
    const errors = ref({});

    const getArtists = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/artists", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(response);
            artists.value = response.data.data;
            totalArtists.value = response.data.meta.total;
        } catch (error) {
            console.log(error);
        }
    };

    const getArtist = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/artists/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            artist.value = response.data.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createArtist = async (artist) => {
        try {
            await axios.post("http://localhost:8000/api/v1/artists", artist, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            await getArtists();
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    };

    const updateArtist = async (id) => {
        try {
            await axios.put(`http://localhost:8000/api/v1/artists/${id}`, artist.value, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (error) {
            if (error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    };

    const deleteArtist = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/artists/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            await getArtists();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        artists,
        artist,
        errors,
        getArtists,
        getArtist,
        createArtist,
        updateArtist,
        deleteArtist,
        totalArtists,
    };
}