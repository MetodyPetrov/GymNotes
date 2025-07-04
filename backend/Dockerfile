# -------- Stage 1: Build Stage --------
FROM maven:3.9.5-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests


# -------- Stage 2: Run Stage --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the compiled jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port (adjust if your app uses a different one)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
