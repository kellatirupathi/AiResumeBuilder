import NiatId from "../models/niatId.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllNiatIds = async (req, res) => {
    try {
        const ids = await NiatId.find({}).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, ids, "All NIAT IDs fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to fetch NIAT IDs", [], error.stack));
    }
};

export const addSingleNiatId = async (req, res) => {
    const { niatId } = req.body;
    if (!niatId) {
        return res.status(400).json(new ApiError(400, "NIAT ID is required."));
    }

    try {
        const existingId = await NiatId.findOne({ niatId: niatId.toUpperCase() });
        if (existingId) {
            return res.status(409).json(new ApiError(409, "This NIAT ID already exists."));
        }

        const newId = await NiatId.create({ niatId: niatId.toUpperCase() });
        return res.status(201).json(new ApiResponse(201, newId, "NIAT ID added successfully."));

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json(new ApiError(400, error.message));
        }
        return res.status(500).json(new ApiError(500, "Failed to add NIAT ID", [], error.stack));
    }
};

export const addBulkNiatIds = async (req, res) => {
    let { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(new ApiError(400, "An array of IDs is required."));
    }

    const uniqueIds = [...new Set(ids.map(id => id.trim().toUpperCase()).filter(id => id))];
    
    const documents = uniqueIds.map(id => ({ niatId: id }));

    try {
        const result = await NiatId.insertMany(documents, { ordered: false });
        return res.status(201).json(new ApiResponse(201, { addedCount: result.length }, `${result.length} NIAT IDs were added successfully.`));
    } catch (error) {
        // Mongoose throws a bulk write error if there are duplicates
        if (error.name === 'MongoBulkWriteError' && error.code === 11000) {
            const addedCount = error.result.nInserted;
            const duplicateCount = error.result.getWriteErrors().length;
            const totalAttempted = addedCount + duplicateCount;
            return res.status(207).json(new ApiResponse(207, { addedCount }, `Operation completed. Added ${addedCount} new IDs. ${duplicateCount} duplicates were ignored.`));
        }
        return res.status(500).json(new ApiError(500, "Failed to add bulk NIAT IDs.", [], error.stack));
    }
};


export const deleteNiatId = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedId = await NiatId.findByIdAndDelete(id);
        if (!deletedId) {
            return res.status(404).json(new ApiError(404, "NIAT ID not found."));
        }
        return res.status(200).json(new ApiResponse(200, null, "NIAT ID deleted successfully."));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed to delete NIAT ID", [], error.stack));
    }
};
