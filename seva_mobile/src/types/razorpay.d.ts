declare module 'react-native-razorpay' {
    export interface RazorpayOptions {
        description: string;
        image?: string;
        currency: string;
        key: string;
        amount: number;
        name: string;
        order_id: string;
        prefill?: {
            email?: string;
            contact?: string;
            name?: string;
        };
        theme?: {
            color: string;
        };
    }

    export interface RazorpaySuccessData {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
    }

    export interface RazorpayErrorData {
        code: number;
        description: string;
    }

    const RazorpayCheckout: {
        open: (options: RazorpayOptions) => Promise<RazorpaySuccessData>;
    };

    export default RazorpayCheckout;
}
