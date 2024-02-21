import Client from "./client";

/**
 * The object for a company
 */
export default interface Company {
	/**
	 * The company's name
	 * 
	 * @example "Disminer Incorporated"
	 */
    name: string,
	/**
	 * The company's unique registeration number
	 * 
	 * @example "ABCDE12345"
	 */
    cr: string,
	/**
	 * The company's address
	 * 
	 * @example "812 London 102930 United Kingdom"
	 */
    address: string,
	/**
	 * The company's contact information
	 */
    contact: {
        /**
         * The company contact number
         * 
         * @example "+97123920129"
         */
        number: string,
        /**
         * The company contact person name
         * 
         * @example "Joe Smith"
         */
        person: string
    },
    /**
     * The document regarding the company
     * 
     * @example "Joe Smith"
     */
    attachment: string,
    /**
     * The unique 12 digit IDs of clients in an array
     * 
     * @example ['DC1029129274', 'DC9274012882', 'DC6846382629']
     */
    clients: Array<string>
}