import Contract from "./contract"

/**
 * Object for a Client inside a Company
 */

export default interface Client {
    cr: string
	/**
	 * The client's company's CR
	 * 
	 * @example "ABCDE12345"
	 */
    companyCr: string,
	/**
	 * The client's name
	 * 
	 * @example "Ateeb Sohail"
	 */
    name: string,
	/**
	 * The user's unique 12 digit id.
	 * 
	 * @example "DC1234567890"
	 */
    id: string,
	/**
	 * The client's address
	 * 
	 * @example "821 D London RW8-DWL"
	 */
    address: string,
	/**
	 * The client's contact information
	 */
    contact: {
        /**
         * The clients contact number
         * 
         * @example "+97123920129"
         */
        number: string,
        /**
         * The clients contact person name
         * 
         * @example "Joe Smith"
         */
        person: string
    },
	/**
	 * A document regarding the client
	 */
    attachment: string,
	/**
	 * The contracts ID client is part of
	 */
    contracts: Array<string>,
}