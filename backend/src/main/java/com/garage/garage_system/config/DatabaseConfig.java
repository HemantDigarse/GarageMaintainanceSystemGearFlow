package com.garage.garage_system.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

@Component
@Order(1)
public class DatabaseConfig implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    private final DataSource dataSource;

    public DatabaseConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        try {
            Connection connection = dataSource.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();
            logger.info("✅ Database connection successful!");
            logger.info("   Database: {}", metaData.getDatabaseProductName());
            logger.info("   Version: {}", metaData.getDatabaseProductVersion());
            logger.info("   URL: {}", metaData.getURL());
            connection.close();
        } catch (Exception e) {
            logger.error("❌ Database connection failed!", e);
            logger.error("   Please check:");
            logger.error("   1. MySQL is running");
            logger.error("   2. Database 'garage_db' exists");
            logger.error("   3. Username and password in application.properties are correct");
            throw new RuntimeException("Database connection failed", e);
        }
    }
}

