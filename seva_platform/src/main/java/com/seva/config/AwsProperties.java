package com.seva.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "aws")
public class AwsProperties {
    private String accessKey;
    private String secretKey;
    private String region;
    private S3 s3 = new S3();

    @Data
    public static class S3 {
        private String bucket;
    }
}
