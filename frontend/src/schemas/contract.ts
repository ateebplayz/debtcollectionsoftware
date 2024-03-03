import Installment from "./installment";

/**
 * The object for a Contract
 */
export default interface Contract {
	/**
	 * The Cr of the company the Contract belongs to
	 * 
	 * @example "ABCDE12345"
	 */
    companyCr: string,
	/**
	 * The unique 12 digit ID of the client this contract belongs to
	 * 
	 * @example "DC1234567890"
	 */
    clientId: string,
	/**
	 * The contracts unique ID
	 * 
	 * @example "CO1234567890"
	 */
    id: string,
	/**
	 * The installment period(if any)
	 */
    installments: Array<Installment>,
	/**
	 * The final deadline of the contract in MS
	 * 
	 * @example '2024-02-01'
	 */
    date: string,
	/**
	 * The total amount of money in the contract in OMR
	 * 
	 * @example 319.20
	 */
    amount: number,
	/**
	 * The description of the contract
	 * 
	 * @example "This is a blalalalallallalala"
	 */
    description: string,
	/**
	 * The percentage that will go to debt collector from the contracter
	 * 
	 * @example 15
	 */
    percentage: number,
}