FROM eclipse-temurin:21-jdk-alpine

RUN apk add --no-cache bash maven

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests

ARG JAR_FILE=target/*.jar
RUN cp $JAR_FILE app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]