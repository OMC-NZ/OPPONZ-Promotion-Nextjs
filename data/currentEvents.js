export const defaultEventFormConfig = {
    pageTitle: 'Claim Your Event Gift',
    pageSubtitle: 'Complete your details to submit your event claim.',
    selectedEventNote: 'Please make sure you are claiming the correct event.',
    sections: [
        {
            id: 'yourDetails',
            title: 'Your Details',
            rows: [
                {
                    layout: 'twoGrid',
                    fields: [
                        { id: 'firstName', type: 'text', label: 'First Name', required: true, placeholder: 'Enter your first name', validation: 'name' },
                        { id: 'lastName', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter your last name', validation: 'name' },
                    ],
                },
                {
                    layout: 'twoGrid',
                    fields: [
                        { id: 'email', type: 'text', label: 'Email Address', required: true, placeholder: 'Enter your email address', inputMode: 'email', validation: 'email' },
                        { id: 'mobile', type: 'phone', label: 'Mobile Number', required: true, placeholder: 'Enter mobile number', countryCode: '+61', validation: 'phone' },
                    ],
                },
            ],
        },
        {
            id: 'deliveryAddress',
            title: 'Delivery Address',
            rows: [],
        },
        {
            id: 'eventDetails',
            title: 'Event Details',
            note: 'The information you provide above will be used to assess your eligibility for this event.',
            rows: [
                {
                    layout: 'threeGrid',
                    fields: [
                        { id: 'phoneModel', type: 'select', label: 'Phone Model', required: true, placeholder: 'Select phone model', options: ['OPPO Reno10 5G', 'OPPO A98 5G', 'OPPO Find X5', 'OPPO A78 5G'] },
                        { id: 'purchaseDate', type: 'date', label: 'Purchase Date', required: true, placeholder: 'DD/MM/YYYY' },
                        { id: 'purchaseLocation', type: 'select', label: 'Purchase Location', required: true, placeholder: 'Select purchase location', options: ['Noel Leeming', 'JB Hi-Fi', 'PB Tech', 'Harvey Norman', 'One NZ', 'Other'] },
                    ],
                },
            ],
        },
        {
            id: 'uploadDocuments',
            title: 'Upload Documents',
            rows: [
                {
                    layout: 'uploadGrid',
                    fields: [
                        { id: 'proofOfPurchase', type: 'upload', label: 'Upload Proof of Purchase', required: true, helperText: 'PDF, JPG or PNG. Max 10MB.' },
                        { id: 'imeiScreenshot', type: 'upload', label: 'Upload IMEI Screenshot', required: true, helperText: 'PDF, JPG or PNG. Max 10MB.' },
                        { id: 'supportingDocument', type: 'upload', label: 'Additional Supporting Document (Optional)', helperText: 'PDF, JPG or PNG. Max 10MB.' },
                    ],
                },
            ],
        },
        {
            id: 'preferences',
            title: 'Preferences & Declaration',
            rows: [
                {
                    layout: 'oneGrid',
                    fields: [
                        { id: 'termsAccepted', type: 'checkbox', label: 'I agree to the Terms and Conditions of Promotions.', termsLink: true, required: true },
                        { id: 'marketingAccepted', type: 'checkbox', label: 'I would like to receive OPPO marketing updates by email.' },
                        { id: 'informationConfirmed', type: 'checkbox', label: 'I confirm the information provided is complete and correct.', required: true },
                    ],
                },
            ],
        },
    ],
};
