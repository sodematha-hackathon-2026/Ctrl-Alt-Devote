package com.seva.service.impl;

import com.seva.service.OtpService;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpServiceImpl implements OtpService {

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @Override
    public String generateOtp(String phoneNumber) {
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(phoneNumber, otp);
        return otp;
    }

    @Override
    public boolean validateOtp(String phoneNumber, String otp) {
        String storedOtp = otpStorage.get(phoneNumber);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(phoneNumber);
            return true;
        }
        return false;
    }
}
