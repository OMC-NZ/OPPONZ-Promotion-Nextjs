export const claimTrackingRecords = {
    "CLM-240018": {
        status: "pending",
        label: "Pending Review",
        title: "Your claim has been received and is waiting to be processed.",
        description: "Please check back later for updates.",
    },
    "CLM-240019": {
        status: "approved",
        label: "Approved - Preparing Dispatch",
        title: "Your claim has been approved and is being prepared for dispatch.",
        description: "We'll update the status again once it has been shipped.",
    },
    "CLM-240020": {
        status: "dispatched",
        label: "Dispatched",
        title: "Your gift has been dispatched.",
        trackingUrl: "https://courier.example.com/track/CLM-240020",
    },
    "CLM-240021": {
        status: "returned",
        label: "Returned to Office",
        title: "Your parcel has been returned to our office.",
        description: "If you need assistance, please contact support@oppo.co.nz.",
        contactEmail: "support@oppo.co.nz",
    },
    "CLM-240022": {
        status: "rejected",
        label: "Rejected",
        title: "Your claim has been rejected.",
        description: "If you need more information, please contact support@oppo.co.nz.",
        contactEmail: "support@oppo.co.nz",
    },
    "CLM-240023": {
        status: "trackingUnavailable",
        label: "Tracking Unavailable",
        title: "Your claim was found, but there is no tracking URL available to display.",
        description: "If you need assistance, please contact support@oppo.co.nz.",
        contactEmail: "support@oppo.co.nz",
    },
};

export const getClaimTrackingRecord = (claimId) => {
    const normalizedClaimId = claimId.trim().replace(/\s+/g, "").toUpperCase();
    return claimTrackingRecords[normalizedClaimId] || null;
};
