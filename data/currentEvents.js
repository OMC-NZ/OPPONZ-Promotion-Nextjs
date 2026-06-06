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
                    layout: 'threeGrid',
                    fields: [
                        { id: 'firstName', type: 'text', label: 'First Name', required: true, placeholder: 'Enter your first name', validation: 'name' },
                        { id: 'lastName', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter your last name', validation: 'name' },
                        { id: 'email', type: 'text', label: 'Email Address', required: true, placeholder: 'Enter your email address', inputMode: 'email', validation: 'email' },
                    ],
                },
                {
                    layout: 'detailsSecondRow',
                    fields: [
                        { id: 'mobile', type: 'phone', label: 'Mobile Number', required: true, placeholder: 'Enter mobile number', countryCode: '+61', validation: 'phone' },
                        {
                            id: 'preferredContact',
                            type: 'radio',
                            label: 'Preferred Contact Method',
                            required: true,
                            defaultValue: 'email',
                            options: [
                                { label: 'Email', value: 'email' },
                                { label: 'Phone', value: 'phone' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'deliveryAddress',
            title: 'Delivery Address',
            rows: [
                {
                    layout: 'twoGrid',
                    fields: [
                        { id: 'addressLine1', type: 'text', label: 'Address Line 1', required: true, placeholder: 'Enter your street address' },
                        { id: 'companyName', type: 'text', label: 'Company Name (Optional)', placeholder: 'Enter company name' },
                    ],
                },
                {
                    layout: 'threeGrid',
                    fields: [
                        { id: 'suburb', type: 'text', label: 'Suburb', required: true, placeholder: 'Enter suburb' },
                        { id: 'city', type: 'text', label: 'City', required: true, placeholder: 'Enter city' },
                        { id: 'postcode', type: 'text', label: 'Postcode', required: true, placeholder: 'Enter postcode', inputMode: 'numeric', validation: 'postcode' },
                    ],
                },
                {
                    layout: 'oneGrid',
                    fields: [
                        { id: 'deliveryInstructions', type: 'textarea', label: 'Delivery Instructions (Optional)', placeholder: 'e.g. Leave at front door, near the mailbox, etc.', maxLength: 200 },
                    ],
                },
            ],
        },
        {
            id: 'eventDetails',
            title: 'Event Details',
            note: 'The information you provide above will be used to assess your eligibility for this event.',
            rows: [
                {
                    layout: 'fourGrid',
                    fields: [
                        { id: 'phoneModel', type: 'select', label: 'Phone Model', required: true, placeholder: 'Select phone model', options: ['OPPO Reno10 5G', 'OPPO A98 5G', 'OPPO Find X5', 'OPPO A78 5G'] },
                        { id: 'variant', type: 'select', label: 'Colour / Variant', required: true, placeholder: 'Select colour / variant', options: ['Black', 'White', 'Blue', 'Green'] },
                        { id: 'purchaseDate', type: 'date', label: 'Purchase Date', required: true, placeholder: 'DD/MM/YYYY' },
                        { id: 'purchaseLocation', type: 'select', label: 'Purchase Location', required: true, placeholder: 'Select purchase location', options: ['Noel Leeming', 'JB Hi-Fi', 'PB Tech', 'Harvey Norman', 'One NZ', 'Other'] },
                    ],
                },
                {
                    layout: 'oneGrid',
                    fields: [
                        { id: 'referralSource', type: 'select', label: 'How did you hear about this event?', required: true, placeholder: 'Select an option', options: ['OPPO website', 'Retail store', 'Social media', 'Email', 'Friend or family', 'Other'] },
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

export const currentEvents = [
    {
        url: '/temporary/events/2ds/events01.jpg',
        bannerUrl: '/temporary/events/2ds/events01.jpg',
        title: 'Current Event 01',
        slug: 'current-event-01',
        termsUrl: '/terms',
        termsTitle: 'Current Event 01 Terms and Conditions',
        termsSummary: 'Claims are subject to event eligibility, proof of purchase, IMEI verification, and stock availability.',
        claimUrl: '/events/current-event-01',
        href: '/events/current-event-01',
        formConfig: defaultEventFormConfig,
    },
    {
        url: '/temporary/events/2ds/events02.jpg',
        bannerUrl: '/temporary/events/2ds/events02.jpg',
        title: 'Current Event 02',
        slug: 'current-event-02',
        termsUrl: '/terms',
        termsTitle: 'Current Event 02 Terms and Conditions',
        termsSummary: 'Claims are subject to event eligibility, proof of purchase, IMEI verification, and stock availability.',
        claimUrl: '/events/current-event-02',
        href: '/events/current-event-02',
        formConfig: defaultEventFormConfig,
    },
    {
        url: '/temporary/events/2ds/events03.jpg',
        bannerUrl: '/temporary/events/2ds/events03.jpg',
        title: 'Current Event 03',
        slug: 'current-event-03',
        termsUrl: '/terms',
        termsTitle: 'Current Event 03 Terms and Conditions',
        termsSummary: 'Claims are subject to event eligibility, proof of purchase, IMEI verification, and stock availability.',
        claimUrl: '/events/current-event-03',
        href: '/events/current-event-03',
        formConfig: defaultEventFormConfig,
    },
    {
        url: '/temporary/events/2ds/events04.jpg',
        bannerUrl: '/temporary/events/2ds/events04.jpg',
        title: 'Current Event 04',
        slug: 'current-event-04',
        termsUrl: '/terms',
        termsTitle: 'Current Event 04 Terms and Conditions',
        termsSummary: 'Claims are subject to event eligibility, proof of purchase, IMEI verification, and stock availability.',
        claimUrl: '/events/current-event-04',
        href: '/events/current-event-04',
        formConfig: defaultEventFormConfig,
    },
]

export const hasCurrentEvents = currentEvents.length > 0;
