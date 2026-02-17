import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Button, Toast } from '../../components/common';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';
import { isValidEmail, isValidPassword } from '../../utils/validation';

export default function SignupScreen({ navigation }: any) {
    const { signup, isLoading } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        const passwordValidation = isValidPassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors[0]);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError(null);
            await signup(email, password, { full_name: fullName });
            // Navigation to verification or home is handled by auth store observer in AppNavigator
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.navHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={theme.colors.gray[900]} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text variant="3xl" weight="bold" color={theme.colors.primary[600]}>
                            Create Account
                        </Text>
                        <Text color={theme.colors.gray[500]} style={styles.subtitle}>
                            Join SoulMatch to find your perfect partner
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={fullName}
                            onChangeText={setFullName}
                            leftIcon="user"
                        />

                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            leftIcon="mail"
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            leftIcon="lock"
                            rightIcon={showPassword ? 'eye-off' : 'eye'}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            leftIcon="lock"
                        />

                        <Text variant="xs" color={theme.colors.gray[500]} style={styles.termsText}>
                            By signing up, you agree to our{' '}
                            <Text variant="xs" weight="bold" color={theme.colors.primary[500]}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text variant="xs" weight="bold" color={theme.colors.primary[500]}>Privacy Policy</Text>.
                        </Text>

                        <Button
                            title="Sign Up"
                            onPress={handleSignup}
                            loading={isLoading}
                            style={styles.signupButton}
                        />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text variant="xs" color={theme.colors.gray[400]} style={styles.dividerText}>
                                OR SIGN UP WITH
                            </Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Feather name="facebook" size={24} color="#1877F2" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Feather name="github" size={24} color="#333" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Feather name="mail" size={24} color="#EA4335" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text color={theme.colors.gray[600]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text weight="bold" color={theme.colors.primary[500]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Toast
                message={error || ''}
                visible={!!error}
                type="error"
                onHide={() => setError(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    navHeader: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing[6],
        paddingBottom: theme.spacing[6],
    },
    header: {
        marginBottom: theme.spacing[8],
    },
    subtitle: {
        marginTop: theme.spacing[2],
    },
    form: {
        width: '100%',
    },
    termsText: {
        marginVertical: theme.spacing[4],
        lineHeight: 18,
    },
    signupButton: {
        marginBottom: theme.spacing[8],
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing[6],
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.gray[200],
    },
    dividerText: {
        marginHorizontal: theme.spacing[4],
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: theme.spacing[10],
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: theme.spacing[3],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingVertical: theme.spacing[4],
    },
});
