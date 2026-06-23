import ClaimField from "./ClaimField";
import FormSectionCard from "./FormSectionCard";
import style from "./style.module.css";

export default function DeliveryAddressCard({ fields }) {
    const { address, company, suburb, city, postcode } = fields;

    return (
        <FormSectionCard title="Delivery Address">
            <div className={style.singleColumnGrid}>
                <div className={style.addressLookup}>
                    <ClaimField
                        label="Type and Select Delivery Address *"
                        {...address}
                        helpText="New Zealand Addresses Only."
                    />
                    {address.suggestionsOpen && (
                        <div className={style.addressSuggestions}>
                            <div className={style.addressSuggestionList}>
                                {address.suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.id}
                                        type="button"
                                        className={style.addressSuggestionItem}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => address.onSelectSuggestion(suggestion)}
                                    >
                                        <span>{suggestion.street}</span>
                                        <small>{suggestion.suburb}, {suggestion.city} {suggestion.postcode}</small>
                                    </button>
                                ))}
                            </div>
                            {address.suggestionTotalPages > 1 && (
                                <div className={style.addressSuggestionPager}>
                                    <button
                                        type="button"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={address.onPreviousSuggestionPage}
                                        disabled={address.suggestionPage === 0}
                                    >
                                        Previous
                                    </button>
                                    <span>Page {address.suggestionPage + 1} of {address.suggestionTotalPages}</span>
                                    <button
                                        type="button"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={address.onNextSuggestionPage}
                                        disabled={address.suggestionPage >= address.suggestionTotalPages - 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <ClaimField
                    label="Company Name (Optional)"
                    {...company}
                    helpText="If your address is a business address, enter the company name here."
                />
            </div>
            <div className={style.threeColumnGrid}>
                <ClaimField label="Suburb *" {...suburb} />
                <ClaimField label="City *" {...city} />
                <ClaimField label="Postcode *" {...postcode} type="postcode" />
            </div>
        </FormSectionCard>
    );
}
