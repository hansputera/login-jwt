export interface registerData {
    userID: number,
    userName: string,
    password: string,
    email: string,
    registeredAt: string,
    userAgent: string
}

export interface sessionData {
    [key: string]: boolean
}