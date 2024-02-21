
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
	 * @example "17231229138"
	 */
    date: number,
}