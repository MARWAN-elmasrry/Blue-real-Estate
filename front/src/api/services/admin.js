import api from "../axios";

const Token = localStorage.getItem("token");

export const GetAllBuildings = async()=>{
    try {
         const response = await api.get("/",{
            headers: {
                Authorization: `Bearer ${Token}`
            },
         });
    return response.data;
    } catch (error) {
        throw error.response?.data?.message || "failed to get data";
    }
}

export const getBuildingById = async(id)=>{
    try {
         const response = await api.get(`/${id}`,{
            headers: {
                Authorization: `Bearer ${Token}`
            },
         });
    return response.data;
    } catch (error) {
        throw error.response?.data?.message || "failed to get data of the buidling";
    }
}

export const updateApartmentByNumber = async (buildingId, apartmentNumber, data) => {
    try {
        const response = await api.put(`/${buildingId}/apartments/${apartmentNumber}`, data, {
            headers: {
                Authorization: `Bearer ${Token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update apartment";
    }
}

export const clearApartmentData = async (buildingId, apartmentNumber) => {
    try {
        const response = await api.delete(`/${buildingId}/apartments/${apartmentNumber}`, {
            headers: {
                Authorization: `Bearer ${Token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to clear apartment data";
    }
}

export const addBuilding = async (buildingData) => {
    try {
        const response = await api.post('/', buildingData, {
            headers: {
                Authorization: `Bearer ${Token}`
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to add building";
    }
}