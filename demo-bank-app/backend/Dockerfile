# Use the official .NET 8.0 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build the application
COPY . ./
RUN dotnet publish BankingMicroservice.csproj -c Release -o out

# Use the official .NET 8.0 runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Create a non-root user with specific UID
RUN adduser --disabled-password --gecos '' --uid 10014 appuser

# Copy the published application from the build stage
COPY --from=build /app/out .

# Change ownership of the app directory to the non-root user
RUN chown -R 10014:10014 /app

# Switch to the non-root user using numeric UID
USER 10014

# Expose port 8080 (matching your Program.cs configuration)
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["dotnet", "BankingMicroservice.dll"]
