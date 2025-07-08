export interface PasswordValidation {
    isValid: boolean
    errors: string[]
    strength: "weak" | "medium" | "strong"
}

export const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = []

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long")
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter")
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter")
    }

    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number")
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character")
    }

    const isValid = errors.length === 0

    let strength: "weak" | "medium" | "strong" = "weak"
    const criteriaCount = 5 - errors.length

    if (criteriaCount >= 4) {
        strength = "strong"
    } else if (criteriaCount >= 2) {
        strength = "medium"
    }

    return {
        isValid,
        errors,
        strength,
    }
}

export const getPasswordStrengthScore = (password: string): number => {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ]

    return checks.filter(Boolean).length
}
