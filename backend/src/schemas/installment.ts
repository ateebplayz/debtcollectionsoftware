
/**
 * The object for an Installment
 */
export default interface Installment {
	/**
	 * Amount of installment in OMR
	 * 
	 * @example 140
	 */
    amount: number,
	/**
	 * Date the installment must be paid in Milliseconds
	 * 
	 * @example "2024-02-01"
	 */
    date: string,
}