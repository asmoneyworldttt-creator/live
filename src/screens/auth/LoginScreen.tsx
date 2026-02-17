import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Input, Button, Toast } from '../../components/common';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setError(null);
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Feather name="heart" size={60} color={theme.colors.primary[500]} />
                        </View>
                        <Text variant="3xl" weight="bold" color={theme.colors.primary[600]}>
                            SoulMatch
                        </Text>
                        <Text color={theme.colors.gray[500]} style={styles.subtitle}>
                            Sign in to find your perfect match
                        </Text>
                    </View>

                    <View style={styles.form}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            leftIcon="lock"
                            rightIcon={showPassword ? 'eye-off' : 'eye'}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text variant="sm" weight="semibold" color={theme.colors.primary[500]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isLoading}
                            style={styles.loginButton}
                        />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text variant="xs" color={theme.colors.gray[400]} style={styles.dividerText}>
                                OR
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
                        <Text color={theme.colors.gray[600]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text weight="bold" color={theme.colors.primary[500]}>
                                Sign Up
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing[6],
        paddingBottom: theme.spacing[6],
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing[12],
        marginBottom: theme.spacing[10],
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing[4],
    },
    subtitle: {
        marginTop: theme.spacing[2],
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing[6],
    },
    loginButton: {
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
