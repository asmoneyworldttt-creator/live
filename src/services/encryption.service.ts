
// MOCK ENCRYPTION SERVICE TO AVOID DEPENDENCY ERRORS
// Replace with 'react-native-libsodium' or 'crypto-js' when ready for production

export const encryptionService = {
    // Generate mock key pair
    generateKeyPair: () => {
        return {
            publicKey: 'mock_public_key_' + Math.random().toString(36).substring(7),
            privateKey: 'mock_private_key_' + Math.random().toString(36).substring(7)
        };
    },

    // Encrypt message (Pass-through for MVP)
    encryptMessage: (
        message: string,
        recipientPublicKey: string,
        senderPrivateKey: string
    ): string => {
        // Just base64 encode for mock "encryption" to simulate transformation
        // In React Native, use dedicated base64 libraries or Buffer if available, but for now just pass through
        return `encrypted_${message}`;
    },

    // Decrypt message (Pass-through for MVP)
    decryptMessage: (
        encryptedPayload: string,
        senderPublicKey: string,
        recipientPrivateKey: string
    ): string => {
        if (encryptedPayload.startsWith('encrypted_')) {
            return encryptedPayload.replace('encrypted_', '');
        }
        return encryptedPayload;
    }
};
