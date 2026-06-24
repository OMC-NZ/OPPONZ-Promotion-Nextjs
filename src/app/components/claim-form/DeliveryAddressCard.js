import ClaimField from "./ClaimField";
import FormSectionCard from "./FormSectionCard";
import style from "./style.module.css";

export default function DeliveryAddressCard({ fields }) {
    const { address, street, company, suburb, city, postcode } = fields;

    return (
        <FormSectionCard title="Delivery Address">
            <div className={style.singleColumnGrid}>
                <div className={style.addressLookup}>
                    <div className={style.addressSearchRow}>
                        <div className={style.addressSearchInputWrap}>
                            <ClaimField
                                label="Search a Delivery Address"
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
                                                <span>{suggestion.fullAddress}</span>
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
                        <button
                            type="button"
                            className={style.addressSearchButton}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={address.onSearch}
                            disabled={!address.canSearch}
                        >
                            {address.isSearching && <span className={style.addressSearchSpinner} />}
                            {address.isSearching ? "Searching" : "Search"}
                        </button>
                    </div>
                </div>
            </div>
            <div className={style.twoColumnGrid}>
                <ClaimField label="Street *" {...street} />
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
