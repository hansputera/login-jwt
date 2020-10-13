export default class UserError extends Error {
    constructor(public name: string, message?: string) {
        super(message);
    }
}