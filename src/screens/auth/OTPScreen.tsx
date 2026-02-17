import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Toast } from '../../components/common';
import { theme } from '../../theme';
import { useAuth } from '../../hooks';
import { Feather } from '@expo/vector-icons';

export default function OTPScreen({ route, navigation }: any) {
    const { phone, email, type } = route.params || {};
    const { verifyOTP, isLoading } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<TextInput[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length < 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        try {
            setError(null);
            const identifier = type === 'phone' ? phone : email;
            await verifyOTP(identifier, otpString, type || 'sms');
        } catch (err: any) {
            setError(err.message || 'Verification failed. Please try again.');
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(60);
            // Add resend logic here
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

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text variant="3xl" weight="bold" color={theme.colors.primary[600]}>
                            Verify Code
                        </Text>
                        <Text color={theme.colors.gray[500]} style={styles.subtitle}>
                            Please enter the 6-digit code sent to{'\n'}
                            <Text weight="bold" color={theme.colors.gray[800]}>
                                {type === 'phone' ? phone : email}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputActive : null,
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    <View style={styles.resendContainer}>
                        <Text color={theme.colors.gray[500]}>Didn't receive the code? </Text>
                        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                            <Text
                                weight="bold"
                                color={timer > 0 ? theme.colors.gray[400] : theme.colors.primary[500]}
                            >
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Verify & Continue"
                        onPress={handleVerify}
                        loading={isLoading}
                        style={styles.verifyButton}
                    />
                </View>
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
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing[6],
    },
    header: {
        marginTop: theme.spacing[4],
        marginBottom: theme.spacing[10],
    },
    subtitle: {
        marginTop: theme.spacing[4],
        lineHeight: 22,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[10],
    },
    otpInput: {
        width: (Dimensions.get('window').width - 48 - 50) / 6,
        height: 56,
        borderRadius: 12,
        backgroundColor: theme.colors.gray[50],
        borderWidth: 1,
        borderColor: theme.colors.gray[200],
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.gray[900],
    },
    otpInputActive: {
        borderColor: theme.colors.primary[500],
        backgroundColor: theme.colors.white,
        ...theme.shadows.sm,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: theme.spacing[10],
    },
    verifyButton: {
        marginTop: 'auto',
        marginBottom: theme.spacing[6],
    },
});
