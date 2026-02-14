package com.seva.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "razorpay")
public class RazorpayProperties {

    private Key key = new Key();

    @Data
    public static class Key {
        private String id;
        private String secret;
    }
}
