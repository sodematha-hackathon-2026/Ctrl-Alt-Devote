package com.seva.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class SchemaFixConfig {

    @Autowired
    private DataSource dataSource;

    @PostConstruct
    public void fixSchema() {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            jdbcTemplate.execute("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_category_check");
            System.out.println("Successfully dropped events_category_check constraint");
        } catch (Exception e) {
            System.err.println("Failed to drop constraint: " + e.getMessage());
        }
    }
}
